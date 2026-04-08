import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Standalone web build for Capacitor mobile
export default defineConfig({
  root: resolve(__dirname, 'src/mobile'),
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist-web'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/mobile/index.html'),
    },
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@content': resolve(__dirname, 'src/content'),
      '@data-layer': resolve(__dirname, 'packages/data-layer/src'),
    },
  },
  css: {
    postcss: resolve(__dirname, 'postcss.config.js'),
  },
  server: {
    fs: {
      allow: [resolve(__dirname, 'src'), resolve(__dirname, 'packages')],
    },
  },
});
