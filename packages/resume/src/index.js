import chalk from 'chalk'
import inquirer from 'inquirer'
import open from 'open'

const userinfo = `基本信息
姓名:盛鑫晶
工作年限:10年
Github: github.com/shengxinjing
Bilibili:space.bilibili.com/26995758
微信: shengxinjing
学历: 本科

工作经验
2012-2013:石山视频，前端工程师
2013-2015:百度地图&糯米  营销团队前端负责人
XXX-XXX:    XXXXXX   XXXXXXXX

技术特点
1. 精通XX（最好别写，除非你真的很精通，不怕问
2. 了解XX（最好别写两条以上
3. 熟练掌握Javascript，了解XX和XX机制（基础扎实
4. 熟练掌握Vue，开发并维护了XX开源库，XX个star （贴地址
5. 熟练掌握工程化，主导并实现了团队的XX系统
6. 熟悉常见算法和设计模式，有较好的计算机素养
7. （切记不写自己不会不擅长的

项目经历
1. 开发了XX项目 （❌ 流水账没意义）
2. 参与XX项目开发，使用Vue其中XX模块和XX个页面代码 
3. （实现XX功能，就是一个P5的描述，多少个功能都是）
4. 参与YY项目开发，使用React开发其中XX模块和XX个页面代码
`

async function ask() {
  const questions = [
    {
      type: 'list',
      name: 'name',
      message: '想做点啥?',
      choices: [
        { name: '看我的github', url: 'https://github.com/shengxinjing' },
        { name: '给我发邮件', url: 'mailto:316783812@qq.com' },
        { name: '加我微信', url: 'https://shengxinjing.cn/weixin.jpg' },
        { name: '学习网站', url: 'https://shengxinjing.cn/' },
        { name: '我的B站', url: 'https://space.bilibili.com/26995758' },
      ].map(item => ({
        name: item.name,
        value: async () => {
          await open(item.url)
          const answer = await inquirer.prompt(questions)
          answer.name()
        },
      })),
    },
  ]

  const answer = await inquirer.prompt(questions)
  answer.name()
}

const cc = chalk.bgHex('#d07a3a').hex('#FFF').bold
const bk = chalk.bgHex('#4a9a98').hex('#FFF').bold
const h1 = chalk.bgHex('#808080').hex('#FFF').bold.italic
const r1 = chalk.bgHex('#ECF0F1').hex('#000')

const LINE_WIDTH = 60
const LABEL_WIDTH = 20
const MG = (n = 1) => bk(' '.repeat(n))
const EMPTY_ROW = MG(LINE_WIDTH)

// 18+6
function center(str) {
  const len = getLen(str)
  const pad = Math.floor((LINE_WIDTH - getLen(str)) / 2)
  return ' '.repeat(pad) + str + ' '.repeat(LINE_WIDTH - len - pad)
}

function genLine(str, n = LINE_WIDTH) {
  const len = getLen(str)
  return str + ' '.repeat(n - len)
}
function genLabel(label, text) {
  return h1(genLine(label, LABEL_WIDTH)) + r1(genLine(text, LINE_WIDTH - LABEL_WIDTH))
}

function getLen(str) {
  let realLength = 0; const len = str.length; let charCode = -1
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128)
      realLength += 1
    else realLength += 2
  }
  return realLength
}

function getInfo() {
  const info = userinfo.split('\n\n').filter(Boolean)
  const ret = [
    EMPTY_ROW,
    bk(center('个人简历')),
    EMPTY_ROW,
  ]
  info.forEach((group) => {
    const [title, ...rows] = group.split('\n')
    ret.push(cc(center(title)))
    rows.forEach((row) => {
      if (row.includes(':')) {
        const [label, text] = row.split(':').map(v => v.trim())
        ret.push(genLabel(label, text))
      }
      else {
        ret.push(r1(genLine(row)))
      }
    })
  })
  ret.push(EMPTY_ROW)

  return ret.map((row) => {
    const m = bk(' '.repeat(4))
    return m + row + m
  }).join('\n')
}

const resume = getInfo()
// eslint-disable-next-line no-console
console.log(resume)
ask()
