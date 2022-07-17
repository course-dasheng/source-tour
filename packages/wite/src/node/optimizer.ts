
import path from 'node:path'
import fs from 'node:fs'
import glob from 'fast-glob'
import { build } from "esbuild";
import { magenta } from "picocolors";
import {scanPlugin} from './plugins/scan'
const htmlTypesRE = /\.(html|vue|svelte|astro)$/
const JS_TYPES_RE = /\.(?:j|t)sx?$|\.mjs$/

// 忽略空格等边界情况 src=\s*=\s*  => src=""
const scriptRE =  /<script type="module" src="([^>]*)"><\/script>/

// /(<script\b[^>]*type\s*=\s*(?:"module"|'module')[^>]*>)(.*?)<\/script>/gims


export async function optimize(root:string){
  
  let entries = await globEntries(root,"**/*.html")
  // entries = entries.filter(
  //   (entry) => isScannable(entry) && fs.existsSync(entry)
  // )
  // console.log(entries)
  // 简化成只有一个
  const entry = entries[0]
  const content:string = await fs.promises.readFile(entry,'utf-8')
  const jsEntry = content.match(scriptRE)![1].slice(1)
  // 开始扫描
  scanImports(path.resolve(root, jsEntry))

}

async function scanImports(entry:string){
  console.log(entry)
  // 扫描入口的依赖
  // 2. 从入口处扫描依赖
  const deps = new Set<string>()
  await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    plugins: [scanPlugin(deps)],
  })
  console.log(
  `${magenta("需要预构建的依赖")}:\n${[...deps]
    .map(magenta)
    .map((item) => `  ${item}`)
    .join("\n")}`
  )
  }


function globEntries(root:string,pattern: string | string[]) {
  // 配置文件先不支持 
  return glob(pattern, {
    cwd: root,
    ignore: [
      '**/node_modules/**',
      `**/dist/**`,
      // `**/__tests__/**`, `**/coverage/**` 等等
    ],
    absolute: true,
    suppressErrors: true 
  })
}

function isScannable(id: string): boolean {
  return JS_TYPES_RE.test(id) || htmlTypesRE.test(id)
}