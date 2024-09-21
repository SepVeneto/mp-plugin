import type { Level } from './util'
export interface Options {
  // define your plugin options here
  log?: Level
  collect?: string | boolean | ((path: string) => boolean)
}
