import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    outDir: 'dist-lib',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'FormxCore',
      fileName: () => 'formx-core.mini',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        entryFileNames: 'formx-core.mini.js',
      },
    },
    // esbuild 先做初步压缩
    minify: 'esbuild',
    sourcemap: false,
  },
});
