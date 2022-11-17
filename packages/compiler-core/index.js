


function tokenizer(input){
  // 切开字符串
  const tokens = []
  let type = ""
  let val = ""
  for(let i=0;i<input.length;i++){
    let ch = input[i]
    if(ch==='<'){
      push()
      if(input[i+1]==='/'){
        // 标签结束
        type = 'tagend'
      }else{
        // 标签开始
        type = 'tagstart'
      }
    }else if(ch==='>'){
      if(input[i-1]==='='){
      // 箭头函数 尽量忽略        
      }else{
        push()
        type="text"
        continue
      }
      // 或者闭合标签的结束
    }else if(/[\s]/.test(ch)){
      // 遇见空格 收集一个token
      push()
      type = 'props'
      continue
    }
    val += ch
  }
  return tokens
  function push(){
    if(val){
      if(type==='tagstart') val = val.slice(1)
      if(type==='tagend') val = val.slice(2)
      tokens.push({
        type,val
      })
      val = ""
    }
  }
}

function parse(template){
  //templtae-》ast
  // 字符串挨个遍历，变成嵌套的对象
  const tokens = tokenizer(template)
  // console.log(tokens)
  let cur = 0 
  let ast = {
    type:'root',
    props:[],
    children:[]
  }
  // 遍历切开的内容，整理成嵌套的对象
  while(cur<tokens.length){
    ast.children.push(walk())
  }
  return ast
  function walk(){
    let token = tokens[cur]
    if(token.type==='tagstart'){
      // tagstart意味着你多了一个子元素
      let node = {
        type:'element',
        tag:token.val,
        props:[],
        children:[]
      }
      token = tokens[++cur]
      while(token.type!=='tagend'){
        if(token.type==='props'){
          node.props.push(walk())
        }else {
          node.children.push(walk())
        }
        token = tokens[cur]
      }
      cur++
      return node //下一个节点
    }else if(token.type==='tagend'){
      cur++
    }else if(token.type==='text'){
      cur++
      return token
    }else if(token.type==='props'){
      cur++
      const [key,val] = token.val.replace('=','~').split('~')
      return {key,val}
    }
    cur++
  }
}
const PatchFlags = {
  "TEXT":1,
  "CLASS":1<<1,
  "STYLE":1<<2,
  "PROPS":1<<3,
  "EVENT":1<<4,
}

function transform(ast){
  let context = {
    // 收集当前模板依赖的函数，这样generate才能生成impor语句
    helpers : new Set(['createElementVNode'])
  }
  // 提供上下文
  // 标记一些vue的语法, vue3还多了一个静态标记
  // 遍历ast这棵树，对vue识别的语法进行转换  对节点是否静态进行标记
  travese(ast,context)
  ast.helpers = context.helpers
}
function travese(ast,context){ // 需要嵌套
  switch(ast.type){
    case "root":
      context.helpers.add('openBlock')
      context.helpers.add('_createElementBlock')
    case "element":
        ast.children.forEach(node=>{
          travese(node,context)
        })
        ast.flag = 0
      
        ast.props = ast.props.map(prop=>{
            const {key,val} = prop
            if(key[0]==='@'){
              ast.flag |= PatchFlags.EVENT
              return {
                key:'on'+key[1].toUpperCase()+key.slice(2),
                val
              }
            }else if(key[0]===':'){
              // 属性的操作函数不同 diff的时候做不同的标记
              let k = key.slice(1)
              if(k==='class'){
                ast.flag |= PatchFlags.CLASS
              }else if(k==='style'){
                ast.flag |= PatchFlags.STYLE
              }else{
                ast.flag |= PatchFlags.PROPS
              }
              // calss
              // style
              // 别的属性
              return {
                key:key.slice(1),
                val
              }
            }else if(key.startsWith('v-')){
              // v-mode  v-if
            }
            // 所有的vue语法都没识别，这里就是静态的
            return {...prop,static:true}
        })
        break
    case "text":
        let re = /\{\{(.*)\}\}/g
        if(re.test(ast.val)){
          // 说明有变量
          ast.flag |= PatchFlags.TEXT
          context.helpers.add("toDisplayString")
          ast.val = ast.val.replace(re,function(s0,s1){
            return s1//直接替换，默认变量
          })
        }else{
          // 普通的文本
          ast.static = true
        }
  }
}
function generate(ast){
  // 标记之后的ast生成render函数
  const code =`import {${[...ast.helpers].map(v=>v+' as _'+v).join(',')}} from 'vue'
export function render(_ctx,_cache,$props){
  return (_openblock(),${ast.children.map(node=>travaseNode(node))})
}`

  return code
  function travaseNode(node){
    switch(node.type){
      case 'element':
        let {flag} = ast
        let props = node.props.reduce((ret,p)=>{
          if(flag&PatchFlags.PROPS){
            ret.push(p.key+':_ctx.'+p.val)
          }else{
            ret.push(p.key+":"+p.val)
          }
          return ret
        },[]).join(',')
        return `_createElementVNode("${node.tag}",{${props}},[
          ${node.children.map(n=>travaseNode(n))}
        ]${node.flag?','+node.flag:""})`
        break
      case 'text':
        console.log(node)
        if(node.static){
          return `'${node.val}'`
        }else{
          return `_toDisplayString(_ctx.${node.val})`
        }
        break
    }
  }

}


function compile(template){
  // 模板解析成render函数
  const ast = parse(template.trim())
  transform(ast)
  // console.log(JSON.stringify(ast,null,2)) //done
  return generate(ast)
} 

{/* <sheng></sheng> */}
// 浏览器没有这个标签，所以div的识别，要放在dom里
const template = `<div id="app">
  <div @click="()=>{console.log('hi')}" :id="name">{{name}}</div>
  <h1 :name="title">Vue编译</h1>
  <p class="container">编译学习</p>
</div>
`
let renderCode = compile(template)
console.log(renderCode)
