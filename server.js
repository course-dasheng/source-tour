

const http = require('http')
http.createServer((req,res)=>{
  // // *代表允许任意域名跨域
  // res.setHeader("Access-Control-Allow-Origin","*");
  // //允许的header类型
  // res.setHeader("Access-Control-Allow-Headers","Content-type,Content-Length,Authorization,Accept,X-Requested-Width");
  // //允许的请求方式
  // res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  let response 
  let query ={}
  let [url,searchParams] = req.url.split('?')
  console.log([url,searchParams])
  if(searchParams){
    query = searchParams.split('&').reduce((ret,a)=>{
      const [key,val] = a.split('=')
      ret[key] = val
      return ret
    },{})
  }

  if(url==='/info'){
    response = JSON.stringify({
      title:'今天天气不错1'
    })
  }
  if(query.callback){
    //jsonp
    response = query.callback+'('+response+')'

  }else{
    res.setHeader("Content-Type","application/json")
  }
  res.end(response)



}).listen(24678)