import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      outDir: 'dist',
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FormxReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `formx-react.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@enginx/formx-core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@enginx/formx-core': 'FormxCore'
        }
      }
    },
    outDir: 'dist',
    sourcemap: true
  }
});
