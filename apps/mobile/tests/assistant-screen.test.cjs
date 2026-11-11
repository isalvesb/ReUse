const test=require("node:test"),assert=require("node:assert/strict"),vm=require("node:vm"),fs=require("node:fs"),ts=require("typescript");
function screen(reply){
  const hooks=[],calls=[];let cursor=0;
  const tokens=JSON.parse(fs.readFileSync("../../design/tokens.json","utf8"));
  class ApiError extends Error {}
  const modules={
    react:{useState:init=>{const i=cursor++;if(!(i in hooks))hooks[i]=init;return [hooks[i],next=>{hooks[i]=typeof next==='function'?next(hooks[i]):next;}];},useRef:init=>{const i=cursor++;return hooks[i]||(hooks[i]={current:init});}},
    "react/jsx-runtime":require("react/jsx-runtime"),
    "react-native":{View:"View",Pressable:"Pressable",ScrollView:"ScrollView",TextInput:"TextInput",ActivityIndicator:"ActivityIndicator",KeyboardAvoidingView:"KeyboardAvoidingView",Platform:{OS:"ios"},StyleSheet:{create:x=>x}},
    "@react-navigation/native":{useNavigation:()=>({goBack(){}})},
    "react-native-safe-area-context":{useSafeAreaInsets:()=>({top:59,bottom:34})},
    "@expo/vector-icons":{Ionicons:"Icon"},"../../design/Text":{Text:"Text"},
    "../../design/tokens":{...tokens,tokens},
    "../../lib/assistantApi":{AssistantApiError:ApiError,assistantRequest:async(path,input)=>{calls.push({path,input});return reply(path,input);}},
  };
  const scope={exports:{},require:name=>modules[name],Promise,Error};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync("src/screens/Assistant/index.tsx","utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,scope);
  const render=()=>{cursor=0;return scope.exports.AssistantScreen();};
  function elements(node){if(!node||typeof node!=='object')return [];if(Array.isArray(node))return node.flatMap(elements);return [node,...elements(node.props?.children)];}
  const find=(tree,label)=>elements(tree).find(x=>x.props?.accessibilityLabel===label);
  return {render,find,elements,calls,flush:()=>new Promise(setImmediate)};
}
test("equal listing titles retain independent keys and select the exact record",async()=>{
  const f=screen(async path=>path==='messages'?{text:"Escolha um",origin:"ibm",proposal:{intent:"PAUSAR",proposalToken:"proof",items:[{id:"one",title:"Mesmo título"},{id:"two",title:"Mesmo título"}]}}:{confirmationToken:"confirmation",intent:"PAUSAR",item:{id:"two",title:"Mesmo título"}});
  f.find(f.render(),"Quero pausar um anúncio meu").props.onPress();await f.flush();
  const rows=f.elements(f.render()).filter(x=>x.props?.accessibilityLabel==='Mesmo título');
  assert.deepEqual(rows.map(x=>x.key),["one","two"]);
  rows[1].props.onPress();await f.flush();
  assert.equal(f.calls[1].path,"selection");assert.equal(f.calls[1].input.itemId,"two");
});
test("native network failure preserves the typed draft and presents a clear error",async()=>{
  const f=screen(async()=>{throw Error("Network request failed");});
  f.find(f.render(),"Mensagem para o assistente").props.onChangeText("Minha pergunta fictícia");
  f.find(f.render(),"Enviar ao IBM").props.onPress();await f.flush();
  const tree=f.render();assert.equal(f.find(tree,"Mensagem para o assistente").props.value,"Minha pergunta fictícia");
  const alert=f.elements(tree).find(x=>x.props?.accessibilityRole==='alert');
  assert.match(alert.props.children,/Falha de conexão/);assert.equal(f.calls.length,1);
});
test("suggested question is visible while pending and settles once without duplicate user messages",async()=>{
  let resolve;const f=screen(()=>new Promise(r=>{resolve=r;}));
  f.find(f.render(),"Como publicar uma doação?").props.onPress();
  let entries=f.elements(f.render()).filter(x=>x.type==='Text'&&x.props.selectable&&x.props.children==='Como publicar uma doação?');
  assert.equal(entries.length,1);
  assert.ok(f.elements(f.render()).some(x=>x.props?.children==='Enviando…'));
  resolve({text:'Resposta isolada',origin:'ibm',proposal:null});await f.flush();
  assert.ok(!f.elements(f.render()).some(x=>x.props?.children==='Enviando…'));
  assert.equal(f.calls.length,1);
});
