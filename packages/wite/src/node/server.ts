// 一个中间件 & 服务器
import connect from "connect"
// 命令行颜色
import { blue, green,red } from "picocolors"

export async function startServer() {
  const app = connect()
  const startTime = Date.now()
  const PORT = 9092
  app.listen(PORT, async () => {
    console.log( red(`🍻 Wite 启动!耗时: ${Date.now() - startTime}ms`))
    console.log(`${green("http://localhost:"+PORT)}`)
  })
}