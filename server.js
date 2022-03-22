const http = require('http')

http.createServer(function(req,res){
  // jsonp
  // res.setHeader('Access-Control-Allow-Origin','*')
  // req.setHeader('Access-Control-Allow-Headers','')
  // res.setHeader('Access-Control-Allow-Methods')
// a=1&b=2
// {a:1,b:2}
  let response
  let query = {}
  let [url,searchParams] = req.url.split('?')
  if(searchParams){
    // query = searchParams.split('&').reduce((ret,a)=>{
    //   const [key,val] = a.split('=')
    //   ret[key] = val
    //   return ret
    // },{})
    searchParams.split('&').forEach(item=>{
      let [key,val] = item.split('=')
      query[key] = val
    })
  }
  console.log(query)
  let result = {
    title:'今天天气不错',
    code:0
  }
  res.setHeader('Content-Type','application/json')

  if(url=='/info'){
    response = JSON.stringify(result)
  }else{
    res.end(JSON.stringify({error:404}))
  }
  if(query.callback){
    response = query.callback + '('+ response + ')'
  }

  res.end(response)

}).listen(24678)

