const test = require("node:test"), assert = require("node:assert/strict"),
  vm = require("node:vm"), fs = require("node:fs"), ts = require("typescript");
function load(statuses = [200], offline = false) {
  let session = { access_token: "fictional-session" }, refreshed = 0, loggedOut = 0;
  const calls = [];
  const scope = { exports: {}, Error, JSON, Promise, process: {env:{EXPO_PUBLIC_REUSE_API_URL:"http://127.0.0.1:4330"}},
    require: name => name === "./profileApi" ? {apiBase:()=>"http://127.0.0.1:4330"} : name === "./fetchWithTimeout" ? {fetchWithTimeout: async (url, init, timeout) => {
      calls.push({url,init,timeout}); if (offline) throw new Error("Network");
      const status = statuses.shift() ?? 200;
      return {status,ok:status===200,json:async()=>({data:{cancelled:false,item:{status:"INATIVO"}},error:{message:"Assistente indisponível"}})};
    }} : {supabase:{auth:{getSession:async()=>({data:{session}}),refreshSession:async()=>{
      refreshed++;session={access_token:"renewed-fictional-session"};return {data:{session}};
    }}},signOutLocally:async()=>{loggedOut++;}},
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync("src/lib/assistantApi.ts","utf8"),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
  }).outputText,scope);
  return {api:scope.exports,calls,refreshed:()=>refreshed,loggedOut:()=>loggedOut};
}
test("native confirmation retries authorization once with the same one-use token and no client identity",async()=>{
  const f=load([401,200]);
  await f.api.assistantRequest("confirm",{confirmationToken:"fictional-proof",decision:"confirm"});
  assert.equal(f.refreshed(),1);assert.equal(f.calls.length,2);
  assert.equal(f.calls[0].init.body,f.calls[1].init.body);
  assert.equal(f.calls[1].init.headers.Authorization,"Bearer renewed-fictional-session");
  assert.equal(f.calls[0].timeout,45000);
  assert.equal(f.calls[0].url,"http://127.0.0.1:4330/api/v1/assistant/confirm");
});
test("IBM failure or offline network has no simulated response, automatic mutation retry or logout",async()=>{
  for(const f of [load([503]),load([],true)]){
    await assert.rejects(f.api.assistantRequest("messages",{message:"Como publicar?"}));
    assert.equal(f.calls.length,1);assert.equal(f.refreshed(),0);assert.equal(f.loggedOut(),0);
  }
});
test("persistently expired session signs out after one failed refresh retry",async()=>{
  const f=load([401,401]);
  await assert.rejects(f.api.assistantRequest("messages",{message:"Como publicar?"}),e=>e.status===401);
  assert.equal(f.loggedOut(),1);assert.equal(f.calls.length,2);
});
