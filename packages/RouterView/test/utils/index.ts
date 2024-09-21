import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
export function getAppVue(name: string, file = 'App.vue') {
  return readFileSync(resolve(__dirname, '../fixture', name, file), 'utf-8')
}
