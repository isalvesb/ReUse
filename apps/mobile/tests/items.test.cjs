const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function service({failUpload = -1, failRead = false} = {}) {
  let uploads = 0;
  const storage = {
    upload: async () => ({data: {}, error: uploads++ === failUpload ? new Error('falha fictícia de upload') : null}),
    getPublicUrl: file => ({data: {publicUrl: 'https://example.test/' + file}}),
  };
  const context = {
    exports: {}, Date, Math, Uint8Array, atob,
    console: {error() {}},
    require(name) {
      if (name === '../lib/supabase') return {supabase: {storage: {from: () => storage}}};
      if (name === 'expo-file-system/legacy') return {EncodingType: {Base64: 'base64'},readAsStringAsync: async () => {if(failRead) throw new Error('arquivo fictício ausente');return 'aW1hZ2Vt';}};
      throw new Error('Dependência inesperada no teste: ' + name);
    },
  };
  const source = fs.readFileSync('src/Services/Items.ts','utf8');
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,context);
  return {api:context.exports, uploads:()=>uploads};
}
test('falha de upload rejeita a publicação em vez de devolver lista vazia',async()=>{
  const {api} = service({failUpload:0});
  await assert.rejects(api.uploadItemImages(['file:///foto.png'],'pessoa@example.test'));
});
test('falha na segunda foto não aparenta sucesso parcial',async()=>{
  const {api,uploads} = service({failUpload:1});
  await assert.rejects(api.uploadItemImages(['file:///a.png','file:///b.png'],'pessoa@example.test'));
  assert.equal(uploads(),2);
});
test('arquivo ilegível impede conclusão sem fotos',async()=>{
  const {api,uploads} = service({failRead:true});
  await assert.rejects(api.uploadItemImages(['file:///ausente.png'],'pessoa@example.test'));
  assert.equal(uploads(),0);
});
test('upload completo preserva uma URL por foto; lista vazia não acessa storage',async()=>{
  const {api,uploads} = service();
  assert.equal((await api.uploadItemImages([],'pessoa@example.test')).length,0);
  assert.equal(uploads(),0);
  const urls = await api.uploadItemImages(['file:///a.png','file:///b.png'],'pessoa@example.test');
  assert.equal(urls.length,2);assert.equal(uploads(),2);
  assert.ok(urls.every(url=>url.startsWith('https://example.test/')));
});
