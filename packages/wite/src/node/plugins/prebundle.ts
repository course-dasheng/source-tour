import path from 'node:path'
import fs from 'node:fs'
import resolve from 'resolve'
import type { Plugin, PluginBuild } from 'esbuild'
import { init, parse } from 'es-module-lexer'
import { BARE_IMPORT_RE } from '../constants'
export function preBundlePlugin(deps: Set<string>): Plugin {
  return {
    name: 'esbuild:pre-bundle',
    setup(build: PluginBuild) {
      // {
      //   path: 'react',
      //   importer: '',
      //   namespace: '',
      //   resolveDir: '/Users/hugsun/github/source-tour/packages/wite/demo-react',
      //   kind: 'entry-point',
      //   pluginData: undefined
      // }
      // {
      //   path: 'object-assign',
      //   importer: '/Users/hugsun/github/source-tour/node_modules/.pnpm/react@17.0.2/node_modules/react/cjs/react-jsx-runtime.development.js',
      //   namespace: 'file',
      //   resolveDir: '/Users/hugsun/github/source-tour/node_modules/.pnpm/react@17.0.2/node_modules/react/cjs',
      //   kind: 'require-call',
      //   pluginData: undefined
      // }
      // 预构建模块
      build.onResolve({
        filter: BARE_IMPORT_RE,
      }, (args) => {
        const { path: id, kind } = args
        // 没有importer 也是entry
        if (deps.has(id)) {
          return kind === 'entry-point'
            ? { path: id, namespace: 'entry-dep' } // .replace(/\//g,"__")
            : { path: resolve.sync(id, { basedir: process.cwd() }) }
        }
      })
      build.onLoad({ filter: /.*/, namespace: 'entry-dep' }, async ({ path: id }) => {
        await init
        const root = process.cwd()
        const entryPath = resolve.sync(id, { basedir: root })
        const code = fs.readFileSync(entryPath, 'utf-8')
        const [imports, exports] = await parse(code)
        const modules: string[] = []
        if (!imports.length && !exports.length) {
          // 直接export default require 会有小问题，需要把所有method都暴露
          // import exports都没有, 用的是require获取所有导出的变量
          const methods = Object.keys(require(entryPath))
          modules.push(
            `export { ${methods.join(',')} } from "${entryPath}"`,
            `export default require("${entryPath}")`,
          )
        }
        else {
          modules.push(`import d from "${entryPath}";export default d;`)
        }
        modules.push(`export * from "${entryPath}"`)
        // console.log(modules.join('\n'))
        const loader = path.extname(entryPath).slice(1)
        return {
          loader,
          resolveDir: root,
          contents: modules.join('\n'),
        }
      })
    },
  }
}

