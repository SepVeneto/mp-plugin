import copy from 'rollup-plugin-copy'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: ['./lib/index.js', './lib/loader.js'],
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
