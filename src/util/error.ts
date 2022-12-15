import colors from 'colors'
import { NAME } from '..'
export type Level = 'error' | 'log' | undefined | boolean

export function genError(msg: string) {
  return `${colors.yellow(`\n[${NAME}]`)} ${colors.red(`✖  ${msg}`)}`
}

export function genLog(msg: string) {
  return `${colors.yellow(`\n[${NAME}]`)} ${colors.cyan(`✔  ${msg}`)}`
}

export function error(msg: string, level: Level) {
  if (!level || level === 'log')
    return
  console.error(genError(msg))
}

export function log(msg: string, level: Level) {
  if (!level || level === 'error')
    return
  // eslint-disable-next-line no-console
  console.log(genLog(msg))
}
