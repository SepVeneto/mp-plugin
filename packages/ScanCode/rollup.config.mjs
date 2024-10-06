import vue from 'rollup-plugin-vue'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: './lib/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  plugins: [
    vue()
  ]
})
