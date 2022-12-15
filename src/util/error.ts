import colors from 'colors'
import { NAME } from '..'

export function error(msg: string) {
  console.error(colors.yellow(`\n[${NAME}]`), colors.red(`✖  ${msg}`))
}

export function log(msg: string) {
  // eslint-disable-next-line no-console
  console.log(colors.yellow(`\n[${NAME}]`), colors.cyan(`✔  ${msg}`))
}
