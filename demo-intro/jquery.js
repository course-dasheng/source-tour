let $ = window.$ = function(selector){
  return new jQuery(selector)
}
$.get = function(url,callback){
  let xhr = new XMLHttpRequest()
  xhr.open('GET',url)
  xhr.onload = function(){
    if(xhr.status==200){
      callback(JSON.parse(xhr.response))
    }
  }
  xhr.send()
}
$.get1 = function(url,callback){
  fetch(url)
    .then(res=>res.json())
    .then(res=>callback(res))
}

$.jsonp = function(url,callback){
  let callbackName = 'JSONP_'+Math.random().toString().replace('.','')
  window[callbackName] = function(data){
    callback(data)
    delete window[callbackName]
  }
  let script = document.createElement('script')
  script.src= url+"?callback="+callbackName
  document.body.appendChild(script)
  // window.functionname = 
  // script src="url?callback=functionname"
  // functionname({
  //   title:1
  // })
}

class jQuery{
  constructor(selector){
    this.selector = selector
    this.init(selector)
  }
  init(selector){
    // #id .clsss
    if(typeof selector==='string'){
      this.elements = [...document.querySelectorAll(selector)]
    }else if(typeof selector==='function'){
      this.elements = []
      document.addEventListener('DOMContentLoaded',selector)
    }else if(selector instanceof HTMLElemenrt){
      this.elements = [selector]
    }
  }
  html(str){
    if(str!==undefined){
      //修改
      this.elements.forEach(ele=>ele.innerHTML = str)
      return this
    }else{
      // 返回第一个节点的html内容
      return this.elements[0].innerHTML
    }
  }
  addClass(cls){
    this.elements.forEach(ele=>ele.classList.add(cls))
    return this
  }
  on(event,callback, useCaptue=false){
    this.elements.forEach(ele=>ele.addEventListener(event,callback,useCaptue))
    return this
  }
  val(str){
    if(str!==undefined){
      this.elements.forEach(ele=>ele.value=str)
      return this
    }else{
      return this.elements[0].value
    }
  }
  append(child){
    if(typeof child==='string'){
      this.elements.forEach(ele=>ele.innerHTML+=child)
    }else if(child instanceof jQuery){
      //
    }else if(child instanceof HTMLElement){
      ///
    }
  }
}
