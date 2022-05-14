let activeEffect = null
// let shouldTrack = false
// effect嵌套的时候，内层的activeEffect会覆盖外层的activeEffect，用栈管理，支持嵌套
let effectStack = []
const targetMap = new WeakMap()

interface EffectOption{
  lazy?:boolean,
  scheduler?:(any)=>void
}
// type effectFnType = typeof effect
export function effect(fn, options:EffectOption = {}) {
  // effect嵌套，通过队列管理
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    // 在调用副作用函数之前将当前副作用函数压栈
    effectStack.push(effectFn)
    // fn执行的时候，内部读取响应式数据的时候，就能在get配置里读取到activeEffect
    let res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }
  effectFn.deps = [] // 收集依赖
  if (!options.lazy) {
    // 没有配置lazy 直接执行
    effectFn()
  }
  effectFn.options = options // 调度时机 watchEffect回用到
  return effectFn
}
function cleanup(effectFn){
  for(let i=0;i<effectFn.deps.length;i++){
    effectFn.deps[i].delete(effectFn)
  }
  effectFn.deps.length =0
}
export function track(target, type, key) {
  if(!activeEffect) return 
  // console.log(`触发 track -> target: ${target} type:${type} key:${key}`)

  // 1. 先基于 target 找到对应的 dep
  // 如果是第一次的话，那么就需要初始化
  // {
  //   target1: {//depsmap
  //     key:[effect1,effect2]
  //   }
  // }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 初始化 depsMap 的逻辑
    // depsMap = new Map()
    // targetMap.set(target, depsMap)
    // 上面两行可以简写成下面的
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps){
    deps = new Set()
  }

  if (!deps.has(activeEffect) && activeEffect) {
    // 防止重复注册
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
  }
  depsMap.set(key, deps)
}
export function trigger(target, type, key) {
  // console.log(`触发 trigger -> target:  type:${type} key:${key}`)
  // 从targetMap中找到触发的函数，执行他
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // 没找到依赖
    return
  }
  const deps = depsMap.get(key)
  if (!deps)
    return 
    // set forEach里delete和add会死循环 ，新建一个set
  const depsToRun = new Set()
  deps && deps.forEach(effectFn=>{
    if(effectFn !==activeEffect){
      depsToRun.add(effectFn) // 过滤掉一个effct同时get和set的情况
    }
  })
  depsToRun.forEach((effectFn) => {
    // 调度器
    if (effectFn.options.scheduler){
      effectFn.options.scheduler(effectFn)
    }else{
      effectFn()
    }
  })
}
