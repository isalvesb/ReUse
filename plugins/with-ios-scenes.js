const { withAppDelegate, withInfoPlist } = require('@expo/config-plugins');
const SCENE_SOURCE = "class ReUseSceneDelegate: UIResponder, UIWindowSceneDelegate {\n  var window: UIWindow?\n\n  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {\n    guard let windowScene = scene as? UIWindowScene,\n      let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }\n    window = appDelegate.window\n    window?.windowScene = windowScene\n    window?.makeKeyAndVisible()\n    for context in connectionOptions.urlContexts {\n      _ = appDelegate.application(UIApplication.shared, open: context.url, options: [:])\n    }\n  }\n\n  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {\n    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }\n    for context in URLContexts {\n      _ = appDelegate.application(UIApplication.shared, open: context.url, options: [:])\n    }\n  }\n\n  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {\n    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }\n    _ = appDelegate.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })\n  }\n}\n";

function configureScenes(info) {
  const manifest = info.UIApplicationSceneManifest || {};
  const configurations = manifest.UISceneConfigurations || {};
  return { ...info, UIApplicationSceneManifest: {
    ...manifest, UIApplicationSupportsMultipleScenes: false,
    UISceneConfigurations: { ...configurations,
      UIWindowSceneSessionRoleApplication: configurations.UIWindowSceneSessionRoleApplication || [{
        UISceneConfigurationName: 'Default Configuration', UISceneClassName: 'UIWindowScene',
        UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).ReUseSceneDelegate',
      }],
    },
  }};
}
function appendSceneDelegate(source) {
  if (source.includes('class ReUseSceneDelegate:')) return source;
  if (!source.includes('class AppDelegate: ExpoAppDelegate') || !source.includes('var window: UIWindow?')) {
    throw new Error('Revise a compatibilidade de cenas: esperado AppDelegate Swift do Expo com window.');
  }
  return source + '\n\n' + SCENE_SOURCE;
}
function withIosScenes(config) {
  config = withInfoPlist(config, mod => { mod.modResults = configureScenes(mod.modResults); return mod; });
  return withAppDelegate(config, mod => {
    if (mod.modResults.language !== 'swift') throw new Error('A adaptação de cenas exige AppDelegate Swift.');
    mod.modResults.contents = appendSceneDelegate(mod.modResults.contents);
    return mod;
  });
}
module.exports = withIosScenes;
module.exports.configureScenes = configureScenes;
module.exports.appendSceneDelegate = appendSceneDelegate;
