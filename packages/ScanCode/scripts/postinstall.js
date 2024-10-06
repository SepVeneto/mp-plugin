#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')
const packageRoot = path.resolve(__dirname, '..')
const depsRoot = path.resolve(packageRoot, '../..')

const wasm = path.resolve(depsRoot, 'zxing-wasm/dist/full/zxing_full.wasm')
const target = path.resolve(process.env.INIT_CWD, 'public/zxing_full.wasm')
fs.copyFileSync(wasm, target)

// throw new Error(JSON.stringify(process.env, null, 2))
