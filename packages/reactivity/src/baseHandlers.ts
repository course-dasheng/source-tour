

import {track,trigger} from './effect'
import { reactive ,ReactiveFlags} from './reactive'
import { isObject } from '@shengxj/utils'

function createGetter(isShadow:boolean){
  return function get(target,key,receiver){
    // 缓存 proxy=>obj ,obj=>proxy
    // 收集依赖关系 
    // const val = target[key]
    if(key===ReactiveFlags.IS_REACTIVE){
      return true
    }
    const val = Reflect.get(target,key,receiver)
    track(target,'get', key)
    if(isObject(val)){
      return isShadow? val : reactive(val)
    }
    return val;
  }
}

function set(target,key,val,receiver){
  const ret =  Reflect.set(target,key,val,receiver)
  trigger(target,'set',key)
  return ret
}

function deleteProperty(target,key,receiver){
  Reflect.deleteProperty(target,key,receiver)
  // delete target[key]
  trigger(target,'delete',key)
  return true
}
export const baseHandlers = {
  get:createGetter(false),
  set,
  deleteProperty

  // deleteProperty  ,delete obj.count触发

  // has
  // ownKeys,,
}
export const shadowReactiveHandlers = {
  get:createGetter(true),
  set,
  deleteProperty
}
