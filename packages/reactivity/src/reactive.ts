
import {track,trigger} from './effect'
import { isObject,toRawType } from '@shengxj/utils'
import {baseHandlers,shadowReactiveHandlers} from './baseHandlers'
import {collectionHandlers} from './collectionHandlers'

export const COL_KEY =Symbol('collection')
const enum TargetType{
  INVALID = 0,
  COMMON = 1, // 普通对象
  COLLECTION = 2 // set map（weak)
}

export const ReactiveFlags = {
  RAW:"__v_raw",
  IS_REACTIVE:"__is_reactive"
}

export function isReactive(val:any){
  return val[ReactiveFlags.IS_REACTIVE]
}
function targetTypeMap(type:string){
  switch(type){
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeaksET':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}


export function shadowReactive(obj:any){
  const handlers = targetTypeMap(toRawType(obj))==TargetType.COMMON?shadowReactiveHandlers:collectionHandlers
  return new Proxy(obj,handlers)
}

export function reactive(obj:any){
  const handlers = targetTypeMap(toRawType(obj))==TargetType.COMMON?baseHandlers:collectionHandlers
  return new Proxy(obj,handlers)
}