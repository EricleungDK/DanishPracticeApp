import type { CapacitorConfig } from '@capacitor/cli';

// NOTE on appId:
// - iOS bundle ID (Apple):   'com.DanishPracticeApp'
// - Android applicationId:   'com.danishpractice.app' (see android/app/build.gradle)
// The value below is the iOS ID, used when scaffolding `npx cap add ios`.
// Android is not re-scaffolded and keeps its original ID.
const config: CapacitorConfig = {
  appId: 'com.DanishPracticeApp',
  appName: 'Dansk Praksis',
  webDir: 'dist-web',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      androidIsEncryption: false,
    },
    SplashScreen: {
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      overlaysWebView: true,
      backgroundColor: '#00000000',
    },
  },
  ios: {
    contentInset: 'never',
    scheme: 'Dansk Praksis',
  },
  android: {
    minWebViewVersion: 80,
  },
};

export default config;
