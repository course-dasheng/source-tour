import { isObject } from '@shengxj/utils'
import {track, trigger} from './effect'
import {reactive} from './reactive'
// num.value  只会访问value这个属性，我们不需要Proxy

// 利用class的geeter和setter
export function isRef(val){
  return val.isRef
}

export function ref(val){
  return new RefImpl(val)
}

// interface ref{
//   _isRef: true
//   _val:any
// }
// ref本身 也可以是复杂数据类型
class RefImpl{
  isRef:boolean
  _val:any
  constructor(val){
    this.isRef = true
    this._val = convert(val)
  }
  get value(){
    track(this,'ref-get','value')
    return this._val
  }
  set value(newVal){
    if(newVal!==this._val){
      this._val = newVal
      trigger(this,'ref-set','value')
    }
  }
}
function convert(val){
  return isObject(val) ? reactive(val):val
}
// conssole.log(v.value） //相当于执行了value函数 