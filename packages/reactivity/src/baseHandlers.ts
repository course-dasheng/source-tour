import { hasOwn, isObject } from '@shengxj/utils'
import { track, trigger,startTrack,stopTrack } from './effect'
import {
  ReactiveFlags,
  reactive,
  reactiveMap,
  shallowReactiveMap,
} from './reactive'
const get = createGetter(false)
const set = createSetter()
const shallowReactiveGet = createGetter(true)


const arrayInstrumentations = {}

;['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrayInstrumentations[method] = function(...args) {
    // this 是代理对象，先在代理对象中查找，将结果存储到 res 中
    let res = originMethod.apply(this, args)
    if (res === false) {
      // res 为 false 说明没找到，在通过 this.raw 拿到原始数组，再去原始数组中查找，并更新 res 值
      res = originMethod.apply(this[ReactiveFlags.RAW], args)
    }
    // 返回最终的结果
    return res
  }
})
;['push','pop','shift','unshift'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrayInstrumentations[method] = function(...args) {
    stopTrack()
    let res = originMethod.apply(this, args)
    startTrack()
    return res
  }
})

function createGetter(shallow: boolean) {
  return function get(target: object, key: string, receiver) {
    // 是不是已经存在两个map中，实际还会更多 还有readonly啥乱遭的
    const isExistMap = () =>
      key === ReactiveFlags.RAW
      && (receiver === reactiveMap.get(target) || receiver === shallowReactiveMap.get(target))

    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    else if (isExistMap()) {
      // 已经存在缓存里
      return target
    }

    if (Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }


    // const res = target[key]
    // receiver有点像代理的this
    const res = Reflect.get(target, key, receiver)
    track(target, 'get', key)

    if (isObject(res)) {
      // 值也是对象的话，需要嵌套调用reactive
      // res就是target[key]
      // 浅层代理，不需要嵌套
      return shallow ? res : reactive(res)
    }
    return res
  }
}

function createSetter() {
  return function set(target, key, value, receiver) {
    let oldValue = target[key]

    const type = Array.isArray(target) 
                  ?Number(key)<target.length ?'set':'add' //越界标记为add
                  :target.hasOwnProperty(key) ? 'set' : 'add'
    const result = Reflect.set(target, key, value, receiver)
    // const result = Reflect.set(target, key, value, receiver)
    // 在触发 set 的时候进行触发依赖
    if(oldValue !== value ) { 
      // @todo 考虑NaN的情况
      trigger(target, type, key,value)
    }
    return result
  }
}
function has(target, key) {
  const res = Reflect.has(target, key)
  track(target, 'has', key)
  return res
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key)
  const result = Reflect.deleteProperty(target, key)
  if (result && hadKey){
    trigger(target, 'delete', key)
  }
  return result
}
export const ITERATE_KEY = Symbol('iterate')
// - Object.getOwnPropertyNames()
// - Object.getOwnPropertySymbols()
// - Object.keys()
// - for…in循环
function ownKeys(target) {
  let key = Array.isArray(target) ?'length':ITERATE_KEY
  track(target, 'ownKeys',key)
  return Reflect.ownKeys(target)
}

export const mutableHandlers = {
  get,
  set,
  has,
  ownKeys,
  deleteProperty,
}

export const shallowReactiveHandlers = {
  get: shallowReactiveGet,
  set,
  has,
  ownKeys,
  deleteProperty,
}
