import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.registapp',
  appName: 'RegistAPP',
  webDir: 'www',
  server: {
    cleartext: true,  // Permite HTTP en lugar de HTTPS
  },
};

export default config;
