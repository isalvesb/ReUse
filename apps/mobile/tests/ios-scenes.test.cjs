const test = require('node:test');
const assert = require('node:assert/strict');
const {configureScenes,appendSceneDelegate} = require('../plugins/with-ios-scenes');
test('manifesto preserva configurações existentes e acrescenta a cena principal',()=>{
 const info={NSCameraUsageDescription:'Câmera',UIApplicationSceneManifest:{UISceneConfigurations:{ExternalDisplay:[{name:'externa'}]}}};
 const result=configureScenes(info);
 assert.equal(result.NSCameraUsageDescription,'Câmera');
 assert.equal(result.UIApplicationSceneManifest.UISceneConfigurations.ExternalDisplay[0].name,'externa');
 assert.equal(result.UIApplicationSceneManifest.UISceneConfigurations.UIWindowSceneSessionRoleApplication[0].UISceneDelegateClassName,'$(PRODUCT_MODULE_NAME).ReUseSceneDelegate');
 assert.deepEqual(configureScenes(result),result);
});
test('prebuild repetido não duplica o delegado de cenas e preserva o AppDelegate',()=>{
 const source='class AppDelegate: ExpoAppDelegate { var window: UIWindow? }';
 const once=appendSceneDelegate(source);
 assert.ok(once.startsWith(source));assert.equal(appendSceneDelegate(once),once);
 assert.match(once,/window\?\.windowScene = windowScene/);assert.match(once,/openURLContexts/);
});
test('delegado nativo inesperado exige revisão em vez de alteração silenciosa',()=>{
 assert.throws(()=>appendSceneDelegate('@implementation AppDelegate'),/compatibilidade/);
});
