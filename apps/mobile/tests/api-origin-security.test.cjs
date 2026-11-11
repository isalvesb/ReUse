const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function clients(url,development){
  const calls=[],cache={};
  function load(name){
    if(cache[name])return cache[name];
    const scope={exports:{},URL,__DEV__:development,process:{env:{EXPO_PUBLIC_REUSE_API_URL:url}},require:name=>{
      if(name==='./profileApi')return load('profileApi');
      if(name==='./supabase')return {supabase:{auth:{getSession:async()=>({data:{session:{access_token:'isolated-fixture'}}})}}};
      if(name==='./fetchWithTimeout')return {fetchWithTimeout:async(url,init)=>{calls.push({url,init});return {ok:true,status:200,json:async()=>({data:{}})}}};
      return {};
    }};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(`src/lib/${name}.ts`,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,scope);
    return cache[name]=scope.exports;
  }
  return {calls,run:async()=>{await load('profileApi').readMyProfile();await load('assistantApi').assistantRequest('messages',{message:'Pergunta de fixture'});await load('chatApi').conversations();await load('itemWriteApi').itemRequest('/me/items');},load};
}
test('todos os clientes autenticados recusam HTTP e origens ambíguas fora de desenvolvimento antes de transmitir Bearer',async()=>{
  for(const url of ['http://127.0.0.1:4330','http://example.com','https://user:password@example.com','https://example.com/path','https://example.com?token=x','https://example.com#fragment']){
    const c=clients(url,false);
    for(const [module,method,args] of [['profileApi','readMyProfile',[]],['assistantApi','assistantRequest',['messages',{message:'Fixture'}]],['chatApi','conversations',[]],['itemWriteApi','itemRequest',['/me/items']]])await assert.rejects(c.load(module)[method](...args));
    assert.equal(c.calls.length,0);
  }
});
test('HTTPS de publicação e loopback de desenvolvimento preservam os contratos e o Bearer',async()=>{
  for(const [url,dev] of [['https://reuse-preview.example',false],['http://127.0.0.1:4330',true]]){
    const c=clients(url,dev);await c.run();assert.equal(c.calls.length,4);
    assert.ok(c.calls.every(x=>x.url.startsWith(url+'/api/v1/')&&x.init.headers.Authorization==='Bearer isolated-fixture'));
  }
});
