const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function screen(reply){
  const hooks=[];let cursor=0,calls=0;
  const scope={exports:{},AbortSignal,fetch:async()=>{calls++;return reply();},require:name=>{
    if(name==='react')return {useState:init=>{const i=cursor++;if(!(i in hooks))hooks[i]=init;return [hooks[i],next=>{hooks[i]=typeof next==='function'?next(hooks[i]):next;}];}};
    if(name==='react/jsx-runtime')return require(name);
    if(name==='next/navigation')return {useRouter:()=>({push(){},refresh(){}})};
    return {};
  }};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('../web/src/components/ReuseAssistant.js','utf8'),{fileName:'ReuseAssistant.jsx',compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,allowJs:true}}).outputText,scope);
  const render=()=>{cursor=0;return scope.exports.default();};
  function nodes(n){return !n||typeof n!=='object'?[]:Array.isArray(n)?n.flatMap(nodes):[n,...nodes(n.props?.children)];}
  return {render,nodes,calls:()=>calls,flush:()=>new Promise(setImmediate)};
}
test('Web mostra a sugestão pendente antes da resposta e não duplica a pergunta após sucesso',async()=>{
  let resolve;const f=screen(()=>new Promise(r=>{resolve=r;}));
  f.nodes(f.render()).find(n=>n.type==='button'&&n.props.children==='Como publicar uma doação?').props.onClick();
  assert.ok(f.nodes(f.render()).some(n=>n.props?.children==='Enviando…'));
  resolve({ok:true,json:async()=>({data:{text:'Resposta de fixture',proposal:null}})});await f.flush();
  const tree=f.nodes(f.render());assert.ok(!tree.some(n=>n.props?.children==='Enviando…'));
  assert.equal(tree.filter(n=>n.type==='p'&&Array.isArray(n.props.children)&&n.props.children.includes('Como publicar uma doação?')).length,1);
  assert.equal(f.calls(),1);
});
test('Web distingue falha de envio e preserva a pergunta visível sem resposta IBM simulada',async()=>{
  const f=screen(async()=>{throw Error('Network fixture');});
  f.nodes(f.render()).find(n=>n.type==='button'&&n.props.children==='Como publicar uma doação?').props.onClick();await f.flush();
  const tree=f.nodes(f.render());assert.ok(tree.some(n=>n.props?.children==='Falha no envio. Tente novamente pelo campo de mensagem.'));
  assert.equal(tree.find(n=>n.type==='input').props.value,'Como publicar uma doação?');
  assert.ok(tree.some(n=>n.props?.role==='alert'));assert.equal(f.calls(),1);
});
