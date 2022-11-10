
import {COL_KEY} from './reactive'
let targetMap = new WeakMap() // 就是个Map，WeakMap会性能好一点，回收机制好一些
// 对象=>{
//   key: [effect1,effect2]
// }
// set的好处可以去重

// obj:{}
let activeEffect
let effectStack = []

export function track(obj,type,key){
  if(!activeEffect) return
  let depsMap = targetMap.get(obj)
  if(!depsMap){
    targetMap.set(obj,(depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if(!deps){
    depsMap.set(key,(deps = new Set()))
  }
  deps.add(activeEffect)
}

// type:操作类型
export function trigger(obj,type,key){
  let depsMap = targetMap.get(obj)
  if(!depsMap) return
  if(type=='collection-add'||type=='collection-delete'){
    key = COL_KEY
  }
  let deps = depsMap.get(key)
  
  if(deps){
    // COL_KEY
    deps.forEach(effect=>{
      effect()
    })
  }
}

export function effect(fn){
  activeEffect = fn
  effectStack.push(activeEffect)
  fn() // 会触发Proxy的get方法，执行track，执行完重置
  // fn内部还有effect，activeEffect指向就错了
  effectStack.pop()
  // 回复上一个嵌套数组的值
  // effectStack = []
  activeEffect = effectStack[effectStack.length-1] 
}
