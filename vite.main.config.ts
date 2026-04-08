import { defineConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function sqlJsPlugin(): Plugin {
  return {
    name: 'sql-js-plugin',
    renderChunk(code) {
      return code.replace(/require\(["']sql\.js["']\)/g, 'require("./sql-wasm.js")');
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'node_modules/sql.js/dist');
      const buildDir = path.resolve(__dirname, '.vite/build');
      for (const file of ['sql-wasm.js', 'sql-wasm.wasm']) {
        const src = path.join(distDir, file);
        try {
          fs.copyFileSync(src, path.join(buildDir, file));
        } catch (err) {
          throw new Error(`sql-js-plugin: missing ${src} — is sql.js installed?`);
        }
      }
    },
  };
}

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['sql.js'],
    },
  },
  plugins: [sqlJsPlugin()],
  resolve: {
    alias: {
      '@shared': '/src/shared',
      '@main': '/src/main',
      '@content': '/src/content',
    },
  },
});
