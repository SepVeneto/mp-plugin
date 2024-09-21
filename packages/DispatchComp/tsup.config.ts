import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/*.ts',
  ],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  external: ['@dcloudio/uni-cli-shared/lib/cache'],
  onSuccess: 'npm run build:fix',
}
