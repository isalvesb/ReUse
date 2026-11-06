import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { validateItem } from '../src/lib/item-write-domain.mjs';
import { LAB_PROJECT_REF } from '../src/lib/lab-config.mjs';
import { getItemPhotoValidationError } from '../src/lib/upload-constraints.mjs';
export const BATCH_ID = 'reuse-lab-work118-20261106';
export const digest = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
export function preparePlan(manifest, categories, owners) {
  assert.equal(manifest.batchId, BATCH_ID, 'Lote não autorizado.');
  assert.equal(manifest.projectRef, LAB_PROJECT_REF, 'Projeto não autorizado.');
  assert.ok(manifest.records.length > 0 && manifest.records.length <= 84);
  const ids = new Set(), keys = new Set(), uploadIds = new Set(), imageIds = new Set();
  return manifest.records.map(record => {
    assert.match(record.id, /^lab118-(s\d{3}|m\d{3}|p\d{2}-q[1-4])$/);
    assert.ok(!ids.has(record.id) && !keys.has(record.creationKey), 'Identificadores repetidos.');
    ids.add(record.id); keys.add(record.creationKey);
    assert.match(record.creationKey, /^[a-f\d-]{36}$/i);
    assert.ok(['A', 'B'].includes(record.account) && owners[record.account]);
    const photos = record.photos.map(photo => {
      assert.equal(photo.aiGenerated, true, 'Fotografia sem procedência IA autorizada.');
      assert.equal(photo.mime, 'image/webp');
      assert.match(photo.sha256, /^[a-f\d]{64}$/);
      assert.match(photo.uploadId, /^[a-f\d-]{36}$/i);
      assert.equal(photo.imageId.startsWith(record.id + '-photo-'), true);
      assert.ok(!uploadIds.has(photo.uploadId) && !imageIds.has(photo.imageId), 'Imagem repetida entre anúncios.');
      uploadIds.add(photo.uploadId); imageIds.add(photo.imageId);
      assert.ok(Number.isSafeInteger(photo.bytes) && photo.bytes > 0);
      assert.ok(photo.width > 0 && photo.height > 0 && photo.width * photo.height <= 40000000);
      return { ...photo, storageKey: `verified/${owners[record.account]}/${photo.uploadId}.webp`, stagingKey: `staging/${owners[record.account]}/${photo.uploadId}.webp` };
    });
    assert.equal(getItemPhotoValidationError(photos.map(p => ({ type:p.mime, size:p.bytes })), { required:true }), null);
    // Fixture import preserves historical reserved/completed states. The pure edit
    // validator checks the same fields without changing the public creation flow.
    const checked = validateItem({ title:record.title, description:record.description, category:record.category, type:record.type, condition:record.condition, price:record.price, status:record.status, location:record.location, photos:photos.map(p => ({ uploadId:p.uploadId })), updatedAt:'2026-11-06T00:00:00.000Z' }, true);
    assert.ok(checked.data.description.includes('demonstrativo fictício'));
    const category = categories.find(c => c.slug === checked.category);
    assert.ok(category, 'Categoria central não encontrada.');
    const item = { id:record.id, creationKey:record.creationKey, ...checked.data, sellerId:owners[record.account], categoryId:category.id };
    item.creationHash = digest({ batch:BATCH_ID, item, photos:photos.map(p => ({ id:p.imageId, uploadId:p.uploadId, sha256:p.sha256 })) });
    return { item, photos, ref:record.ref };
  });
}
function comparable(item) {
  return Object.fromEntries(['id','creationKey','creationHash','title','description','price','type','condition','status','location','sellerId','categoryId'].map(k => [k, k === 'price' && item[k] != null ? Number(item[k]).toFixed(2) : item[k]]));
}
export function assertSameItem(actual, planned) {
  assert.deepEqual(comparable(actual), comparable(planned), 'Registro existente diverge; nenhuma sobrescrita permitida.');
}
export function classifyPlan(plan, existing) {
  const byId = new Map(existing.map(x => [x.id,x]));
  for(const row of existing) assert.ok(plan.some(p => p.item.id === row.id && p.item.creationKey === row.creationKey), 'Colisão de chave fora do lote.');
  return plan.map(p => { const old=byId.get(p.item.id); if(old) assertSameItem(old,p.item); return {...p, exists:!!old}; });
}
export function assertRollbackSafe(plan, rows, relations, expectedVersions) {
  assert.equal(relations.conversations, 0, 'Reversão bloqueada: lote possui conversas.');
  assert.equal(relations.notifications, 0, 'Reversão bloqueada: lote possui notificações.');
  assert.equal(rows.length, plan.length, 'Lote incompleto; não excluir parcialmente.');
  for(const p of plan){ const row=rows.find(x=>x.id===p.item.id); assert.ok(row); assertSameItem(row,p.item); assert.equal(new Date(row.updatedAt).toISOString(),expectedVersions[row.id], 'Anúncio editado após importação; reversão bloqueada.'); }
}
export async function rollbackRows(tx, plan, versions) {
  const ids = plan.map(p => p.item.id);
  // Lock parent rows before checking dependants; new FK references cannot race
  // with the cascade-sensitive deletion. Values remain bound parameters.
  await tx.$queryRawUnsafe('SELECT id FROM items WHERE id = ANY($1::text[]) FOR UPDATE', ids);
  const rows = await tx.item.findMany({where:{id:{in:ids}}});
  assertRollbackSafe(plan, rows, {
    conversations:await tx.conversation.count({where:{itemId:{in:ids}}}),
    notifications:await tx.notification.count({where:{itemId:{in:ids}}}),
  }, versions);
  const images = await tx.itemImage.findMany({where:{itemId:{in:ids}}});
  assert.equal(images.length,plan.flatMap(p=>p.photos).length);
  for(const p of plan) for(const [position,photo] of p.photos.entries()) {
    assert.deepEqual(images.find(x=>x.id===photo.imageId),{id:photo.imageId,uploadId:photo.uploadId,url:'/api/v1/images/'+photo.uploadId,position,itemId:p.item.id});
  }
  const removedImages = await tx.itemImage.deleteMany({where:{itemId:{in:ids}}});
  const removedItems = await tx.item.deleteMany({where:{id:{in:ids}}});
  const removedUploads = await tx.itemUpload.deleteMany({where:{id:{in:plan.flatMap(p=>p.photos.map(ph=>ph.uploadId))}}});
  assert.equal(removedItems.count,plan.length);
  assert.equal(removedImages.count,images.length);
  assert.equal(removedUploads.count,images.length);
  return {items:removedItems.count,images:removedImages.count};
}
