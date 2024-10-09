import vue from 'rollup-plugin-vue'
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
  plugins: [
    vue()
  ]
})
