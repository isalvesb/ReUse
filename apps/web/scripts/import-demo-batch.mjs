import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import dotenv from 'dotenv';
import sharp from 'sharp';
import {PrismaClient} from '@prisma/client';
import {assertLabDatabaseUrl,LAB_AUTH_URL,LAB_PROJECT_REF} from '../src/lib/lab-config.mjs';
import {storageClient} from '../src/lib/item-storage.mjs';
import {hasValidImageSignature} from '../src/lib/image-signatures.mjs';
import {preparePlan,classifyPlan,assertSameItem,assertRollbackSafe,rollbackRows,digest,BATCH_ID} from './demo-batch-plan.mjs';
const app=fileURLToPath(new URL('../',import.meta.url));
Object.assign(process.env,dotenv.parse(await fs.readFile(path.join(app,'.env.local'))));
const [mode='dry-run',manifestPath,snapshotPath,journalPath]=process.argv.slice(2);
assert.ok(['dry-run','apply','verify','rollback-dry-run','rollback'].includes(mode), 'Modo inválido.');
if(mode==='rollback') assert.equal(process.argv[6], '--confirm-batch='+BATCH_ID, 'Reversão exige confirmação manual específica do lote.');
assert.ok(manifestPath && snapshotPath && journalPath,'Informe manifesto, snapshot e diário privados.');
assertLabDatabaseUrl(process.env.DATABASE_URL);
assert.equal(process.env.SUPABASE_AUTH_URL,LAB_AUTH_URL);
const manifest=JSON.parse(await fs.readFile(manifestPath)),snapshot=JSON.parse(await fs.readFile(snapshotPath));
assert.equal(snapshot.project,LAB_PROJECT_REF);
const db=new PrismaClient(), store=storageClient();
async function protectedState(tx=db){ return {categories:await tx.category.findMany({orderBy:{id:'asc'}}),items:await tx.item.findMany({where:{id:{in:snapshot.items.map(x=>x.id)}},orderBy:{id:'asc'}}),images:await tx.itemImage.findMany({where:{id:{in:snapshot.images.map(x=>x.id)}},orderBy:{id:'asc'}}),uploads:await tx.itemUpload.findMany({where:{id:{in:snapshot.uploads.map(x=>x.id)}},orderBy:{id:'asc'}}),users:await tx.user.findMany({select:{id:true,authSubject:true,name:true,bio:true,updatedAt:true},orderBy:{id:'asc'}}),protectedCounts:{conversations:await tx.conversation.count(),messages:await tx.message.count(),notifications:await tx.notification.count()}}; }
function assertPreserved(state){for(const key of ['categories','items','images','uploads','users','protectedCounts'])assert.equal(digest(state[key]),digest(snapshot[key]),'Estado anterior alterado: '+key);}
async function existingFor(plan,tx=db){return tx.item.findMany({where:{OR:[{id:{in:plan.map(x=>x.item.id)}},{creationKey:{in:plan.map(x=>x.item.creationKey)}}]}});}
async function verifyRows(plan){
 const rows=await existingFor(plan);assert.equal(rows.length,plan.length);for(const p of plan)assertSameItem(rows.find(x=>x.id===p.item.id),p.item);
 const images=await db.itemImage.findMany({where:{itemId:{in:plan.map(p=>p.item.id)}}});assert.equal(images.length,plan.flatMap(p=>p.photos).length);
 for(const p of plan)for(const [position,photo] of p.photos.entries()){
  const image=images.find(i=>i.id===photo.imageId);assert.deepEqual(image,{id:photo.imageId,uploadId:photo.uploadId,url:'/api/v1/images/'+photo.uploadId,position,itemId:p.item.id});
  const upload=await db.itemUpload.findUnique({where:{id:photo.uploadId}});assert.equal(upload.ownerId,p.item.sellerId);assert.equal(upload.storageKey,photo.storageKey);assert.equal(upload.status,'ATTACHED');
  const r=await store.download(photo.storageKey);assert.equal(r.error,null,'Imagem persistida indisponível.');assert.equal(digest(Buffer.from(await r.data.arrayBuffer())),photo.sha256,'Imagem persistida divergente.');
 }
 return rows;
}
try{
 assertPreserved(await protectedState());
 const credentials=JSON.parse(await fs.readFile(path.resolve(app,'../../../.local-secrets/reuse-lab-work13.json')));
 assert.equal(credentials.project_ref,LAB_PROJECT_REF);
 const owners={};for(const name of ['A','B']){const u=await db.user.findUnique({where:{authSubject:credentials['account_'+name.toLowerCase()+'_id']},select:{id:true}});assert.ok(u,'Conta fictícia não encontrada.');owners[name]=u.id;}assert.notEqual(owners.A,owners.B);
 const categories=await db.category.findMany(),plan=preparePlan(manifest,categories,owners);
 // Validate exact bytes and decoded content before Storage or PostgreSQL writes.
 for(const p of plan)for(const photo of p.photos){const bytes=await fs.readFile(photo.path);assert.equal(digest(bytes),photo.sha256);assert.equal(bytes.length,photo.bytes);assert.ok(hasValidImageSignature(bytes,photo.mime));const meta=await sharp(bytes,{limitInputPixels:40000000}).metadata();assert.equal(meta.format,'webp');assert.equal(meta.width,photo.width);assert.equal(meta.height,photo.height);await sharp(bytes).stats();}
 const classified=classifyPlan(plan,await existingFor(plan)),pending=classified.filter(p=>!p.exists),photos=plan.flatMap(p=>p.photos);
 const allowedUploads=await db.itemUpload.findMany({where:{OR:[{id:{in:photos.map(p=>p.uploadId)}},{storageKey:{in:photos.map(p=>p.storageKey)}},{stagingKey:{in:photos.map(p=>p.stagingKey)}}]}});
 const oldImages=await db.itemImage.findMany({where:{OR:[{id:{in:photos.map(p=>p.imageId)}},{uploadId:{in:photos.map(p=>p.uploadId)}}]}});
 for(const u of allowedUploads){const p=classified.find(p=>p.photos.some(ph=>ph.uploadId===u.id));assert.ok(p?.exists&&u.ownerId===p.item.sellerId,'Upload prévio colide com lote.');const ph=p.photos.find(ph=>ph.uploadId===u.id);assert.equal(u.storageKey,ph.storageKey);assert.equal(u.stagingKey,ph.stagingKey);}
 for(const image of oldImages)assert.ok(classified.some(p=>p.exists&&p.item.id===image.itemId&&p.photos.some(ph=>ph.imageId===image.id&&ph.uploadId===image.uploadId)),'Colisão de imagem.');
 const summary={mode,project:LAB_PROJECT_REF,batch:BATCH_ID,manifestSha256:digest(await fs.readFile(manifestPath)),items:plan.length,images:photos.length,newItems:pending.length,alreadyPresent:plan.length-pending.length,preexistingItemsPreserved:snapshot.items.length,writes:false};
 if(mode==='apply'&&pending.length){
  assert.equal(pending.length,plan.length,'Aplicação parcial inesperada; investigar antes de escrever.');
  let journal;try{journal=JSON.parse(await fs.readFile(journalPath));assert.equal(journal.manifestSha256,summary.manifestSha256);}catch(e){if(e.code!=='ENOENT')throw e;journal={...summary,startedAt:new Date().toISOString(),objects:[],versions:{}};}
  // Persist every intended immutable key BEFORE upload. No unrelated cleanup.
  journal.objects=photos.map(p=>({key:p.storageKey,sha256:p.sha256}));await fs.writeFile(journalPath,JSON.stringify(journal,null,2),{mode:0o600});
  let n=0;for(const photo of photos){const bytes=await fs.readFile(photo.path);const result=await store.upload(photo.storageKey,bytes,{contentType:photo.mime,upsert:false});if(result.error){const old=await store.download(photo.storageKey);assert.equal(old.error,null,'Storage recusou criação.');assert.equal(digest(Buffer.from(await old.data.arrayBuffer())),photo.sha256,'Objeto existente divergente; não sobrescrever.');}const verified=await store.download(photo.storageKey);assert.equal(verified.error,null);assert.equal(digest(Buffer.from(await verified.data.arrayBuffer())),photo.sha256);if(++n%10===0)console.log(JSON.stringify({verifiedUploads:n,total:photos.length}));}
  const now=new Date(),expiresAt=new Date(now.getTime()+3*3600000);
  await db.$transaction(async tx=>{
   assertPreserved(await protectedState(tx));assert.equal((await existingFor(plan,tx)).length,0,'Lote foi criado concorrentemente.');
   await tx.itemUpload.createMany({data:plan.flatMap(p=>p.photos.map(ph=>({id:ph.uploadId,ownerId:p.item.sellerId,stagingKey:ph.stagingKey,storageKey:ph.storageKey,mime:ph.mime,size:ph.bytes,status:'ATTACHED',createdAt:now,expiresAt})))});
   await tx.item.createMany({data:plan.map(p=>({...p.item,createdAt:now,updatedAt:now}))});
   await tx.itemImage.createMany({data:plan.flatMap(p=>p.photos.map((ph,position)=>({id:ph.imageId,uploadId:ph.uploadId,itemId:p.item.id,url:'/api/v1/images/'+ph.uploadId,position})))});
  },{timeout:120000,maxWait:10000});
  journal.versions=Object.fromEntries(plan.map(p=>[p.item.id,now.toISOString()]));journal.committedAt=new Date().toISOString();await fs.writeFile(journalPath,JSON.stringify(journal,null,2),{mode:0o600});summary.writes=true;
 }
 if(mode==='verify'||mode==='apply'||mode==='rollback-dry-run'||mode==='rollback'){
  const rows=await verifyRows(plan);assertPreserved(await protectedState());summary.totalItems=await db.item.count();summary.publicItems=await db.item.count({where:{status:'ATIVO'}});summary.storageBytesVerified=photos.reduce((n,p)=>n+p.bytes,0);
  if(mode==='apply'&&!pending.length){
   // Recover the local receipt if a previous process committed successfully and
   // stopped before writing it. Matching immutable payloads were verified above.
   let journal;try{journal=JSON.parse(await fs.readFile(journalPath));assert.equal(journal.manifestSha256,summary.manifestSha256);}catch(e){if(e.code!=='ENOENT')throw e;journal={...summary,objects:photos.map(p=>({key:p.storageKey,sha256:p.sha256}))};}
   if(!journal.committedAt){journal.versions=Object.fromEntries(rows.map(r=>[r.id,r.updatedAt.toISOString()]));journal.committedAt=new Date().toISOString();journal.recoveredReceipt=true;await fs.writeFile(journalPath,JSON.stringify(journal,null,2),{mode:0o600});}
  }
  if(mode==='rollback-dry-run'||mode==='rollback'){const journal=JSON.parse(await fs.readFile(journalPath));assert.equal(journal.manifestSha256,summary.manifestSha256);assertRollbackSafe(plan,rows,{conversations:await db.conversation.count({where:{itemId:{in:plan.map(p=>p.item.id)}}}),notifications:await db.notification.count({where:{itemId:{in:plan.map(p=>p.item.id)}}})},journal.versions);summary.rollbackEligible=true;summary.deletedObjects=0;
   if(mode==='rollback'){
    const removed=await db.$transaction(tx=>rollbackRows(tx,plan,journal.versions),{timeout:120000,maxWait:10000});
    assertPreserved(await protectedState());
    journal.rolledBackAt=new Date().toISOString();journal.storageCleanupPending=journal.objects.map(x=>x.key);await fs.writeFile(journalPath,JSON.stringify(journal,null,2),{mode:0o600});
    // Database rollback never performs Storage deletion. Exact keys stay in the
    // journal for a separately authorized, scoped recovery/cleanup operation.
    Object.assign(summary,{writes:true,removed,storageCleanupPending:journal.storageCleanupPending.length});
   }
  }
 }
 console.log(JSON.stringify(summary));
}catch(e){console.error(JSON.stringify({failed:true,kind:e.name,code:e.code||null,reason:e.name==='AssertionError'?e.message.split('\n')[0]:'Operação interrompida; credenciais e mensagens internas não registradas.'}));process.exitCode=1;}finally{await db.$disconnect();}
