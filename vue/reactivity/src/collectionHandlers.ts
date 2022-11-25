

import {track,trigger} from './effect'
import {ReactiveFlags, COL_KEY} from './reactive'


//获取target，获取key
export const collectionHandlers = {
  get(target,key,receiver){
    if(key===ReactiveFlags.RAW) return target
      // set.add
      // 有一些边缘case
    if(key==='size'){
      // size的响应式监听
      track(target,'collection-size',COL_KEY)
      // console.log('set .size trigger')
      return Reflect.get(target,key)
    }
    return collectionActions[key]
      // set.delete
      // set.has
  }
}


// set map
export const collectionActions = {
  add(key){
    const target = this[ReactiveFlags.RAW]
    // console.log(ReactiveFlags.RAW,target)
    const ret = target.add(key)
    trigger(target,'collection-add',key)
    return ret
  },
  delete(key){
    const target = this[ReactiveFlags.RAW]
    const ret =  target.delete(key)
    trigger(target, 'collection-delete',key)
    return ret
  },
  has(key){
    const target = this[ReactiveFlags.RAW]
    const ret =  target.has(key)
    trigger(target, 'collection-has',key)
    return ret
  }
}
