import cac from 'cac'
import { startServer } from './server'

const cli = cac('vite')

cli
  .command('[root]', '开发环境')
  .alias('dev')
  .action(async () => {
    console.log('测试1')
    startServer()
  })

cli.help()

cli.parse()
