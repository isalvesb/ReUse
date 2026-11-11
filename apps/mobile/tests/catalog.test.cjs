const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const vm = require('node:vm');
const output = ts.transpileModule(fs.readFileSync(require.resolve('../src/lib/catalog.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const scope={exports:{}};vm.runInNewContext(output,scope);const {filterCatalog}=scope.exports;
const items=[{title:'Cadeira de madeira',category:'Móveis',description:'Bela Vista'},{title:'Jaqueta azul',category:'Roupas e Acessórios'},{title:'Livro infantil',category:'Livros e Revistas'},{title:'Carrinho',category:'Bebês e Crianças'}];
test('busca ignora acentos e exige todos os termos mesmo em campos diferentes',()=>{
 assert.deepEqual(Array.from(filterCatalog(items,'MOVEIS madeira','')), [items[0]]);
 assert.equal(filterCatalog(items,'cadeira azul','').length,0);
});
test('categoria e busca combinam sem misturar o público infantil com título de outra categoria',()=>{
 assert.deepEqual(Array.from(filterCatalog(items,'','Infantil')), [items[3]]);
 assert.deepEqual(Array.from(filterCatalog(items,'azul','Acessórios')), [items[1]]);
 assert.equal(filterCatalog(items,'madeira','Roupas').length,0);
});
test('limpar filtros restaura o catálogo e aceita catálogo vazio',()=>{
 assert.equal(filterCatalog(items,'  ','').length,4);
 assert.equal(filterCatalog([],'cadeira','Móveis').length,0);
});
