
import {track,trigger} from './effect'
import { isObject,toRawType } from '@shengxj/utils'


export const COL_KEY =Symbol('collection')
const enum TargetType{
  INVALID = 0,
  COMMON = 1, // 普通对象
  COLLECTION = 2 // set map（weak)
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

const baseHandlers = {
  get(target,key,receiver){
    // 收集依赖关系 
    // const val = target[key]
    const val = Reflect.get(target,key,receiver)
    
    track(target,'get', key)
    return isObject(val) ? reactive(val):val;
  },
  set(target,key,val,receiver){
    // let oldVal = target[key]
    // target[key] = val
    
    const ret =  Reflect.set(target,key,val,receiver)
    trigger(target,'set',key)
    return ret

    // trigger()
  //  修改数据，执行副作用函数 
  },
  // deleteProperty  ,delete obj.count触发
  deleteProperty(target,key,receiver){
    Reflect.deleteProperty(target,key,receiver)
    // delete target[key]
    trigger(target,'delete',key)
    return true
  }
  // has
  // ownKeys,,
}

//获取target，获取key
const collectionHandlers = {
  get(target,key,receiver){
    if(key==='__reactive_raw') return target
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
const collectionActions = {
  add(key){
    const target = this['__reactive_raw']
    // console.log('__reactive_raw',target)
    const ret = target.add(key)
    trigger(target,'collection-add',key)
    return ret
  },
  delete(){},
  has(){}
}


export function reactive(obj:any){
  const handlers = targetTypeMap(toRawType(obj))==TargetType.COMMON?baseHandlers:collectionHandlers
  return new Proxy(obj,handlers)

  // new Proxy(obj,{
  //   get,
  //   set
  // })
}