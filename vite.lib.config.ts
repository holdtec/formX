import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

// ESM environment workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    // 自动生成 .d.ts 类型声明文件，包含 lib 下的代码和根目录的 types.ts
    dts({ 
      include: ['lib', 'types.ts'],
      insertTypesEntry: true,
    })
  ],
  build: {
    // 输出目录改为 dist-lib 以区别于应用的 dist
    outDir: 'dist-lib',
    lib: {
      // 指定入口文件
      entry: resolve(__dirname, 'lib/index.ts'),
      // 库的全局变量名（用于 CDN 引用）
      name: 'FormxCore',
      // 生成的文件名：formx-core.js, formx-core.umd.cjs
      fileName: (format) => `formx-core.${format === 'es' ? 'js' : 'cjs'}`,
      // 导出格式：ESM (现代) + CJS (兼容 Node)
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    // 库构建通常不需要混淆，以便调试
    minify: false,
    sourcemap: true
  }
});