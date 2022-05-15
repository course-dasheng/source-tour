import { hasOwn, isObject } from '@shengxj/utils'
import { track, trigger } from './effect'
import {
  ReactiveFlags,
  reactive,
  reactiveMap,
  shallowReactiveMap,
} from './reactive'
const get = createGetter(false)
const set = createSetter()
const shallowReactiveGet = createGetter(true)

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
  track(target, 'ownKeys',ITERATE_KEY)
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
