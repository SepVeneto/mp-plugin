import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
export function getAppVue(name: string) {
  return readFileSync(resolve(__dirname, '../fixture', name, 'App.vue'), 'utf-8')
}
