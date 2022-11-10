
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
  activeEffect.deps.push(deps)
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
    const depsToRun = new Set(deps)
    depsToRun.forEach(effect=>{
      effect()
    })
  }
}

function cleanup(effectFn){
  // effectFn的依赖清理
  // 全部清理，track的时候重新收集 Vue3.2的时候进行了优化 ，位运算
  for (let i = 0; i < effectFn.deps.length; i++) {
    effectFn.deps[i].delete(effectFn)
  }
  effectFn.deps.length = []
}

// effect函数依赖的 key
// key依赖的effect
export function effect(fn){
  const effectFn = ()=>{
    let ret 
    try{
      activeEffect = effectFn
      effectStack.push(activeEffect)
      cleanup(effectFn)
      ret = fn() // 会触发Proxy的get方法，执行track，执行依赖收集的
    }finally{
      // fn内部还有effect，activeEffect指向就错了
      effectStack.pop()
      // 回复上一个嵌套数组的值
      // effectStack = []
      activeEffect = effectStack[effectStack.length-1] 
    }
    return ret
  }
  effectFn.deps = []
  effectFn()
  return effectFn
}
