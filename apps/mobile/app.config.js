// Work 1.3 uses email/password only; no legacy provider initializes in the lab.
module.exports = ({ config }) => ({
  ...config,
  scheme: "com.guicunhasou.reuse",
  plugins: ["expo-font", "expo-secure-store", "expo-web-browser", "./plugins/with-ios-scenes"],
  ios: {
    ...config.ios,
    infoPlist: {
      ...config.ios?.infoPlist,
      FacebookAutoInitEnabled: false,
      FacebookAutoLogAppEventsEnabled: false,
      FacebookAdvertiserIDCollectionEnabled: false,
    },
  },
});
