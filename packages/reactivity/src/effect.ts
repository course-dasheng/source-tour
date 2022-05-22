import { ITERATE_KEY } from './baseHandlers'
import {initDepMarkers,finalizeDepMarkers,newTracked,wasTracked, createDep} from './dep'
let activeEffect: effectFnType | undefined
let shouldTrack = true
export function stopTrack() {
  shouldTrack = false
}
export function startTrack() {
  shouldTrack = true
}
// effect嵌套的时候，内层的activeEffect会覆盖外层的activeEffect，用栈管理，支持嵌套
const effectStack: any[] = []
const targetMap = new WeakMap()

// effect的嵌套深度
let effectTrackDepth = 0 
// 标识依赖收集的状态 二进制标记
export let trackOpBit = 1
// 最大标记的位数，超过这个js，恢复全部clean的逻辑 数字太大可能溢出
const maxMarkerBits = 30

interface EffectOption {
  lazy?: boolean
  immediate?: boolean
  scheduler?: (...args: any[]) => void
}
export function watchEffect<T>(){

}
export function effect<T>(
  fn: () => T,
  options: EffectOption = {},
) {
  // effect嵌套，通过队列管理
  const effectFn = () => {
    let res
    try{

      activeEffect = effectFn
      // 在调用副作用函数之前将当前副作用函数压栈
      effectStack.push(effectFn)
      trackOpBit = 1<<effectTrackDepth //标记位 当前effect的二进制位置
      if (effectTrackDepth <= maxMarkerBits) {
        // 给依赖打标记
        initDepMarkers(effectFn)
      }
      else {
        cleanup(effectFn)
      }
      // fn执行的时候，内部读取响应式数据的时候，就能在get配置里读取到activeEffect
      res = fn()
    }finally{
      if (effectTrackDepth <= maxMarkerBits) {
        // 完成依赖标记
        finalizeDepMarkers(effectFn)
      }
      // 恢复上个effect嵌套
      trackOpBit = 1 << --effectTrackDepth
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
    return res
  }
  effectFn.deps = [] // 收集依赖
  if (!options.lazy) {
    // 没有配置lazy 直接执行
    effectFn()
  }
  effectFn.stop = function(){
    const { deps } = effectFn
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effectFn)
      }
      deps.length = 0
    }
  }
  effectFn.options = options // 调度时机 watchEffect回用到
  return effectFn
}
export type effectFnType = ReturnType<typeof effect>

function cleanup(effectFn: effectFnType) {
  for (let i = 0; i < effectFn.deps.length; i++) effectFn.deps[i].delete(effectFn)

  effectFn.deps.length = 0
}
export function track(target, type, key) {
  if (!activeEffect || !shouldTrack)
    return
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
  if (!deps)
    deps = createDep()
  depsMap.set(key, deps)
  trackEffects(deps) // 标记依赖
}

function trackEffects(deps) {
  let shouldTrack = false
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(deps)) {
      // | 授权这个位置的effect 为新依赖
      deps.n |= trackOpBit 
      // 依赖已经被收集，则不需要再次收集
      shouldTrack = !wasTracked(deps)
    }
  }
  else {
    // 全部清理
    shouldTrack = !deps.has(activeEffect)
  }
  if (shouldTrack && activeEffect && !deps.has(activeEffect) ) {
    // 防止重复注册
    // 收集依赖  
    deps.add(activeEffect)
    activeEffect!.deps.push(deps)
  }
}


export function trigger(target, type, key, value = '') {
  // console.log(`触发 trigger -> target:  type:${type} key:${key}`)
  // 从targetMap中找到触发的函数，执行他
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // 没找到依赖
    return
  }
  const deps = depsMap.get(key)

  // set forEach里delete和add会死循环 ，新建一个set
  const depsToRun = new Set<effectFnType>([])
  deps && deps.forEach((effectFn) => {
    if (effectFn !== activeEffect)
      depsToRun.add(effectFn) // 过滤掉一个effct同时get和set的情况
  })

  if (type === 'add' || type === 'delete') {
    const itrateDeps = depsMap.get(ITERATE_KEY)
    // console.log('xx',itrateDeps)
    itrateDeps && itrateDeps.forEach((effectFn) => {
      if (effectFn !== activeEffect)
        depsToRun.add(effectFn)
    })
  }
  if (type === 'add' && Array.isArray(target)) {
    const lengthEffects = depsMap.get('length')
    lengthEffects && lengthEffects.forEach((effectFn) => {
      if (effectFn !== activeEffect)
        depsToRun.add(effectFn)
    })
  }

  // 修改数组的时候，只需要更新比value长的数据，
  if (Array.isArray(target) && key === 'length') {
    depsMap.forEach((effects, key) => {
      if (key >= value) {
        effects.forEach((effectFn) => {
          if (effectFn !== activeEffect)
            depsToRun.add(effectFn)
        })
      }
    })
  }

  depsToRun.forEach((effectFn) => {
    // 调度器
    if (effectFn.options.scheduler)
      effectFn.options.scheduler(effectFn)

    else effectFn()
  })
}