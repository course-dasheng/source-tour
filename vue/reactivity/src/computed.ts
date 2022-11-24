import { effect, track, trigger } from './effect'

export type ComputedGetter<T> = (...args: any[]) => T

export function computed<T>(getter: ComputedGetter<T>) {
  let value: T
  let dirty = true // 防止重复计算

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true
        trigger(obj, 'computed', 'value')
      }
    },
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      // 其他effcct中使用computed.value，也需要收集依赖

      track(obj, 'computed', 'value')
      return value
    },
  }
  return obj
}
