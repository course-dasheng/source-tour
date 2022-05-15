import {  ReactiveFlags, } from './reactive'
import { track, trigger  } from './effect'
import {ITERATE_KEY} from  './baseHandlers'
import {  hasOwn, toRawType  } from '@shengxj/utils'


// function createH
export const collectionHandlers = {
  get(target,key){
    if (key === ReactiveFlags.RAW) return target
    if(key=='size'){
      track(target, 'col-size',ITERATE_KEY)
      return Reflect.get(target, key, target)
    }
    return mutableInstrumentations[key]
  }
}
const mutableInstrumentations = {
  add(key) {
    const target = this[ReactiveFlags.RAW]
    const hadKey = target.has(key)
    const res = target.add(key)
    if (!hadKey) {
      trigger(target,'add', key, 'add')
    }
    return res
  },
  delete(key) {
    const target = this[ReactiveFlags.RAW]
    const res = target.delete(key)
    trigger(target, 'delete',key, 'delete')
    return res
  },
  has(key){
    const target = this[ReactiveFlags.RAW]
    const res = target.has(key)
    track(target, 'col-has', key)
    return res
  }
}

// export const shallowCollectionHandlers = {

// }