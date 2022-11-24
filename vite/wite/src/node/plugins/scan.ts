import type { Plugin, PluginBuild } from 'esbuild'
import { BARE_IMPORT_RE, EXTERNAL_TYPES } from '../constants'

// esbuild的插件，扫描一下依赖
export function scanPlugin(deps: Set<string>): Plugin {
  return {
    name: 'esbuild:scan-deps',
    setup(build: PluginBuild) {
      // onResolve 路径解析的正则（匹配 匹配文件
      // 只处理静态资源
      build.onResolve(
        { filter: new RegExp(`\\.(${EXTERNAL_TYPES.join('|')})$`) },
        ({ path: id }) => {
          return {
            path: id,
            // 打上 external 标记
            external: true,
          }
        },
      )
      // 所有的bare import语句，就是不带. ./ /啥的，直接import 'react'
      build.onResolve(
        {
          filter: BARE_IMPORT_RE,
        },
        (args) => {
          const { path: id } = args
          // 推入 deps 集合中
          deps.add(id)
          return {
            path: id,
            external: true,
          }
        },
      )
    },
  }
}
