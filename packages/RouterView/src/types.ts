import type { Level } from './util'
export interface Options {
  // define your plugin options here
  log?: Level
  collect?: string | boolean | ((path: string) => boolean)
  /**
   * 是否向每一个路由页面注入该路由的元数据
   */
  inject?: boolean
}
