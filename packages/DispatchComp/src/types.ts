export interface Options {
  // define your plugin options here
  collect?: string | boolean | ((path: string) => boolean)
}
