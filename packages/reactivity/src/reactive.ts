import { toRawType } from '@shengxj/utils'
import {
  mutableHandlers,
  shallowReactiveHandlers,
} from './baseHandlers'
import {
  collectionHandlers,
} from './collectionHandlers'
export const reactiveMap = new WeakMap()
export const shallowReactiveMap = new WeakMap()

export const ReactiveFlags = {
  IS_REACTIVE: '__v_isReactive',
  RAW: '__v_raw',
}

const enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2,
}

export function reactive(target) {
  const handers = getTargetType(target) === TargetType.COMMON ? mutableHandlers : collectionHandlers
  return createReactiveObject(target, reactiveMap, handers)
}
export function shallowReactive(target) {
  // let handers = getTargetType(target) === TargetType.COMMON ? shallowReactiveHandlers: shallowCollectionHandlers
  // @todo
  return createReactiveObject(
    target,
    shallowReactiveMap,
    shallowReactiveHandlers,
  )
}

export function isReactive(value) {
  // 判断是不是有__isReactive属性
  return !!value[ReactiveFlags.IS_REACTIVE]
}

function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}

function getTargetType(value) {
  return targetTypeMap(toRawType(value))
}

function createReactiveObject(target, proxyMap, proxyHandlers) {
  if (typeof target !== 'object') {
    console.warn(`reactive  ${target} 必须是一个对象`)
    return target
  }

  // 通过proxy创建代理，不同的map存储不同类型的reactive依赖关系
  // 针对普通的对象和es6的map set等数据结构，需要使用不同的handlers
  // 不过这里没实现map等数据结构的collectionHandlers，有兴趣可以去vue源码中自己学习

  // 缓存找到了，直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy)
    return existingProxy

  // 执行代理
  const proxy = new Proxy(target, proxyHandlers)

  // 存个缓存
  proxyMap.set(target, proxy)
  return proxy
}
