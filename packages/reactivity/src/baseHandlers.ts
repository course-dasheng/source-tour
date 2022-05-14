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
    const result = Reflect.set(target, key, value, receiver)
    // const result = Reflect.set(target, key, value, receiver)
    // 在触发 set 的时候进行触发依赖
    trigger(target, 'set', key)
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
  console.log(1,result,hadKey)
  if (result && hadKey){
    trigger(target, 'delete', key)
  }
  return result
}

// @next ownKeys

export const mutableHandlers = {
  get,
  set,
  has,
  deleteProperty,
}

export const shallowReactiveHandlers = {
  get: shallowReactiveGet,
  set,
  has,
  deleteProperty,
}
