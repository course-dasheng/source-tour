// 一个中间件 & 服务器
import connect from 'connect'
// 命令行颜色
import { green, red } from 'picocolors'
import { optimize } from './optimizer'

export async function startServer() {
  const app = connect()
  const startTime = Date.now()
  const PORT = 9092
  const rootDir = process.cwd()
  app.listen(PORT, async () => {
    await optimize(rootDir)
    console.log(red(`🍻 Wite 启动!耗时: ${Date.now() - startTime}ms`))
    console.log(`${green(`http://localhost:${PORT}`)}`)
  })
}
