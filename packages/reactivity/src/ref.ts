


import {track,trigger} from './effect'
import {reactive} from './reactive'
import {isObject} from '@shengxj/utils'
export function ref(val) {
  if (isRef(val)) {
    return val
  }
  return new RefImpl(val)
}
export function isRef(val) {
  return !!(val && val.__isRef)
}


class RefImpl {
  constructor(val) {
    this.__isRef = true
    this._val = convert(val)
  }
  get value() {
    track(this, 'refget', 'value')
    return this._val
  }

  set value(val) {
    if (val !== this._val) {
      this._val = convert(val)
      trigger(this, 'refset', 'value')
    }
  }
}
function convert(val) {
  return isObject(val) ? reactive(val) : val
}
