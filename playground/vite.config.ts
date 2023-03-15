import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [Inspect(), Unplugin({
    log: 'log',
    collect: 'include'
  }) as Plugin, uni()],
})
