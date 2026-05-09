module.exports = ({ config }) => {
  const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
  const facebookClientToken = process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN;

  return {
    ...config,

    plugins: [
      "expo-font",
      "expo-secure-store",
      "expo-web-browser",
      [
        "react-native-fbsdk-next",
        {
          appID: facebookAppId,
          clientToken: facebookClientToken,
          displayName: "ReUse",
          scheme: `fb${facebookAppId}`,
          advertiserIDCollectionEnabled: false,
          autoLogAppEventsEnabled: false,
          isAutoInitEnabled: true,
          iosUserTrackingPermission:
            "Este identificador será usado para login com Facebook."
        }
      ],
      "expo-tracking-transparency"
    ],

    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        FacebookAppID: facebookAppId,
        FacebookClientToken: facebookClientToken,
        FacebookDisplayName: "ReUse"
      }
    }
  };
};