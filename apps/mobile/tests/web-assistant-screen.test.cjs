const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function screen(reply){
  const hooks=[],requests=[];let cursor=0,calls=0;
  const scope={exports:{},AbortSignal,fetch:async(path,input)=>{calls++;requests.push({path,body:JSON.parse(input.body)});return reply(path,input);},require:name=>{
    if(name==='react')return {useState:init=>{const i=cursor++;if(!(i in hooks))hooks[i]=init;return [hooks[i],next=>{hooks[i]=typeof next==='function'?next(hooks[i]):next;}];}};
    if(name==='react/jsx-runtime')return require(name);
    if(name==='next/navigation')return {useRouter:()=>({push(){},refresh(){}})};
    return {};
  }};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('../web/src/components/ReuseAssistant.js','utf8'),{fileName:'ReuseAssistant.jsx',compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,allowJs:true}}).outputText,scope);
  const render=()=>{cursor=0;return scope.exports.default();};
  function nodes(n){return !n||typeof n!=='object'?[]:Array.isArray(n)?n.flatMap(nodes):[n,...nodes(n.props?.children)];}
  return {render,nodes,requests,calls:()=>calls,flush:()=>new Promise(setImmediate)};
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
test('seleção e confirmação Web ficam no chat; cancelar mantém o contrato e não confirma a mutação',async()=>{
  const f=screen(async(path)=>({ok:true,json:async()=>({data:path.endsWith('messages')
    ? {text:'Fixture',proposal:{intent:'PAUSAR',proposalToken:'proposal-fixture',items:[{id:'item-fixture',title:'Livro de fotografia'}]}}
    : path.endsWith('selection')
      ? {intent:'PAUSAR',confirmationToken:'confirmation-fixture',item:{title:'Livro de fotografia'}}
      : {cancelled:true}})}));
  f.nodes(f.render()).find(n=>n.type==='button'&&n.props.children==='Quero pausar um anúncio meu').props.onClick();await f.flush();
  let tree=f.nodes(f.render()),chat=tree.find(n=>n.props?.['aria-busy']!==undefined);
  assert.ok(f.nodes(chat).some(n=>n.props?.['aria-label']==='Escolha um anúncio próprio'));
  const choose=f.nodes(chat).find(n=>n.type==='button'&&n.props.children==='Livro de fotografia');
  choose.props.onClick();await f.flush();
  tree=f.nodes(f.render());chat=tree.find(n=>n.props?.['aria-busy']!==undefined);
  const cancel=f.nodes(chat).find(n=>n.type==='button'&&n.props.children?.includes?.('Cancelar'));
  assert.ok(cancel,'cancelamento deve estar dentro do contêiner rolável do chat');
  assert.deepEqual(f.requests[1],{path:'/api/v1/assistant/selection',body:{proposalToken:'proposal-fixture',itemId:'item-fixture'}});
  cancel.props.onClick();await f.flush();
  assert.deepEqual(f.requests[2],{path:'/api/v1/assistant/confirm',body:{confirmationToken:'confirmation-fixture',decision:'cancel'}});
  assert.ok(f.nodes(f.render()).some(n=>n.type==='p'&&n.props.children?.includes?.('Solicitação cancelada. Nenhum anúncio foi alterado por esta confirmação.')));
  assert.equal(f.calls(),3);
});
test('confirmação Web de fixture continua enviando somente o token e a decisão explícita',async()=>{
  const f=screen(async(path)=>({ok:true,json:async()=>({data:path.endsWith('messages')
    ? {text:'Fixture',proposal:{intent:'RETOMAR',proposalToken:'proposal-fixture',items:[{id:'item-fixture',title:'Livro'}]}}
    : path.endsWith('selection')
      ? {intent:'RETOMAR',confirmationToken:'confirmation-fixture',item:{title:'Livro'}}
      : {item:{title:'Livro',status:'ATIVO'}}})}));
  f.nodes(f.render()).find(n=>n.type==='button'&&n.props.children==='Quero reativar um anúncio meu').props.onClick();await f.flush();
  f.nodes(f.render()).find(n=>n.type==='button'&&n.props.children==='Livro').props.onClick();await f.flush();
  f.nodes(f.render()).find(n=>n.type==='button'&&n.props.children?.includes?.('Confirmar ')).props.onClick();await f.flush();
  assert.deepEqual(f.requests[2].body,{confirmationToken:'confirmation-fixture',decision:'confirm'});
  assert.ok(f.nodes(f.render()).some(n=>n.type==='p'&&n.props.children?.includes?.('“Livro”: reativação persistida no ReUse.')));
});
