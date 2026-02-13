import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@enginx/formx-core': resolve(__dirname, './lib/index.ts'),
      '@enginx/formx-react': resolve(__dirname, './packages/formx-react/src/index.ts')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});