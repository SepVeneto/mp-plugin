import copy from 'rollup-plugin-copy'
import path from 'node:path'
// import vue from 'rollup-plugin-vue'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: ['./lib/index.js'],
  // input: ['./lib/ScanCode.vue'],
  output: [{
    dir: 'dist/cjs',
    format: 'cjs',
  }, {
    dir: 'dist/es',
    format: 'es'
  }],
  external: (id) => {
    return id.endsWith('.vue')
  },
  plugins: [
        {
      name: 'watch-custom-files',
      buildStart() {
        // 添加单个文件
        this.addWatchFile(path.resolve('lib/ScanCode.vue'));
        
        // 添加整个目录
        // const dataFiles = glob.sync('data/**/*.csv');
        // dataFiles.forEach(file => this.addWatchFile(file));
      }
    },
    // vue(),
    copy({
      targets: [
        {
          src: './lib/ScanCode.vue',
          dest: 'dist/cjs',
        },
        {
          src: './lib/ScanCode.vue',
          dest: 'dist/es',
        },
      ]
    })
  ]
})
