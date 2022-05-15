import { beforeAll, beforeEach, describe, expect, it, test, vi } from 'vitest'
import { effect, isReactive, reactive, shallowReactive } from '../src'



describe('测试Set，Map等es6数据结构的响应式',()=>{
  beforeEach(()=>{
    vi.useFakeTimers()
  })
  it('和object的不同',()=>{
    let set = new Set()
    set.add(1)
    let getFn = vi.fn((...args)=>{})
    let setFn = vi.fn((...args)=>{})

    let data = new Proxy(set,{
      get(target,key){
        getFn(target,key)
      },
      set(target,key,value){
        setFn(target,key,value)
        return true
      }
    })
    expect(()=>data.add(2)).toThrowError()
    expect(getFn).toHaveBeenCalledTimes(1)
    expect(getFn).toHaveBeenCalledWith(set,'add')

    expect(data.size).toBe(undefined)
    expect(getFn).toHaveBeenCalledTimes(2)
    expect(getFn).toHaveBeenCalledWith(set,'size')
  })
  // get拦截的都是clear,delete,values,keys，entries，forEach,has size等方法
  // map还有set，get
  // set有add
  // 需要专门一个handler来管理
  it('set的测试',()=>{
    // let a = new Set([1,2])
    // a.delete(1)
    // console.log(a)

    let set = reactive(new Set([1]))
    let val
    effect(()=>{
      val = set.size
    })
    set.add(2)
    expect(val).toBe(2)
    set.delete(1)
    expect(val).toBe(1)
    expect(set.has(2)).toBe(true)

  })
  it('map的测试',()=>{
    let map = reactive(new Map([['a',1]]))
    let val
    effect(()=>{
      val = map.size
    })
    expect(val).toBe(1)
    map.set('b',2)
    expect(val).toBe(2)
    // map.delete('a')
    // expect(val).toBe(1)
    // expect(map.has('b')).toBe(true)
  })
})