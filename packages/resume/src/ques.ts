import inquirer from 'inquirer'
import open from 'open'


export async function ask(){
  let questions = [
    {
      type: 'list',
      name: 'name',
      message: '想做点啥?',
      choices:[
        {name:'看我的github', url:'https://github.com/shengxinjing'},
        {name:'给我发邮件', url:'mailto:316783812@qq.com'},
        {name:'加我微信', url:'https://shengxinjing.cn/weixin.jpg'},
        {name:'学习网站', url:'https://shengxinjing.cn/'},
        {name:'我的B站', url:'https://space.bilibili.com/26995758'},
      ].map(item=>({
        name:item.name,
        value: async()=>{
          await open(item.url)
          let answer = await inquirer.prompt(questions)
          answer.name()
        }
      }))
    }
  ]
  
  let answer = await inquirer.prompt(questions)
  // answer.action()
  answer.name()
}