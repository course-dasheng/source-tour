import {effect} from './effect'

// watch本质也是一个effect，配合scheduler监听变化

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value)
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}
interface watchOptions{
  deep?:boolean,
  immediate?:boolean,
  flush?:'post'|'sync'|'pre'
}
export function watch(source, cb, options:watchOptions = {}) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    // source是对象，就需要多次修改合并更新
    getter = () => traverse(source)
  }
  let newValue,oldValue
  const job = () => {
    newValue = effectFn()
    cb(newValue,oldValue)
    oldValue = newValue
  }
  const effectFn = effect(
    // 执行 getter
    () => getter(),
    {
      lazy: true,
      scheduler: () => {
        if (options.flush === 'post') {
          const p = Promise.resolve()
          p.then(job)
        } else {
          job()
        }
      }
    }
  )
  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
  // console.log(123,oldValue)

}
