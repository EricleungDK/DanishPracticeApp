import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.danishpractice.app',
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
