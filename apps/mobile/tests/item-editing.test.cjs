const test=require('node:test');const assert=require('node:assert/strict');const ts=require('typescript');const fs=require('node:fs');const vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../src/lib/itemEditing.ts'),'utf8');const conditionScope={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(require.resolve("../src/lib/itemCondition.ts"),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,conditionScope);const scope={exports:{},require:(name)=>{assert.equal(name,"./itemCondition");return conditionScope.exports;}};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,scope);
const {prepareItemForEditing}=scope.exports;
const item={id:1,user_email:'pessoa@example.test',title:'Anúncio fictício',item_condition:'bom_estado',images:['http://localhost/foto.jpg'],price:'12,00',item_type:'venda',location:'Local fictício'};
test('edição impede item ausente, sessão ausente e anúncio de outra pessoa',()=>{
 for(const [record,email] of [[null,item.user_email],[item,null],[item,'outra@example.test']]) assert.throws(()=>prepareItemForEditing(record,email),/anúncio seu/);
});
test('edição preserva fotos, preço, modalidade e demais dados salvos',()=>{
 const value=prepareItemForEditing(item,'PESSOA@example.test');
 assert.equal(value.title,item.title);assert.equal(value.price,item.price);assert.equal(value.item_type,'venda');assert.deepEqual(value.images,item.images);assert.equal(value.condition,'Usado • Bom estado');
});
test('condições antigas são compatíveis e condição desconhecida exige nova seleção',()=>{
 for(const [source,label] of [['novo','Novo'],['como_novo','Usado • Como novo'],['regular','Usado • Estado Regular'],['Usado • Bom estado','Usado • Bom estado'],['sem-dado',null]]) assert.equal(prepareItemForEditing({...item,item_condition:source},item.user_email).condition,label);
});

test("rótulos do catálogo não expõem códigos legados nem inventam condição",()=>{assert.equal(conditionScope.exports.conditionLabel("bom_estado"),"Usado • Bom estado");assert.equal(conditionScope.exports.conditionLabel(""),"Condição não informada");assert.equal(conditionScope.exports.conditionLabel("condição especial"),"condição especial");});
