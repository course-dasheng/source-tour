import cac from "cac"

const cli = cac('vite')

cli
  .command("[root]", "开发环境")
  .alias("dev")
  .action(async () => {
    console.log('测试1')
  })

cli.help()

cli.parse()