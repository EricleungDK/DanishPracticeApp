import type { CapacitorConfig } from '@capacitor/cli';

// NOTE on appId:
// - iOS bundle ID (Apple): 'com.ai-ya-work.DanishPractice' (hyphens OK for Apple)
// - Android applicationId: 'com.danishpractice.app' (hyphens NOT allowed in Java package names,
//   so Android keeps its original ID — see android/app/build.gradle)
// The value below is the iOS ID, used when scaffolding `npx cap add ios`.
const config: CapacitorConfig = {
  appId: 'com.ai-ya-work.DanishPractice',
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
    contentInset: 'always',
    scheme: 'Dansk Praksis',
  },
  android: {
    minWebViewVersion: 80,
  },
};

export default config;
