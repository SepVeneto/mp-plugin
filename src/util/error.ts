import colors from 'colors'
import { NAME } from '..'
export type Level = 'error' | 'log' | undefined | boolean

export function error(msg: string, level: Level) {
  if (!level || level === 'log')
    return
  console.error(colors.yellow(`\n[${NAME}]`), colors.red(`✖  ${msg}`))
}

export function log(msg: string, level: Level) {
  if (!level || level === 'error')
    return
  // eslint-disable-next-line no-console
  console.log(colors.yellow(`\n[${NAME}]`), colors.cyan(`✔  ${msg}`))
}
