import {effect} from './effect'

// watch本质也是一个effect，配合scheduler监听变化



export function watch(source, cb, options = {}) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } 
  let newValue,oldValue
  const effectFn = effect(
    // 执行 getter
    getter,
    {
      lazy: true,
      scheduler: () => {
        newValue = effectFn()
        console.log(234,newValue,oldValue)
        cb(newValue, oldValue)
        oldValue = newValue
      }
    }
  )
  oldValue = effectFn()
  // console.log(123,oldValue)

}
