import { beforeAll, beforeEach, describe, expect, it, test, vi } from 'vitest'
import { effect, isReactive, reactive, shallowReactive } from '../src'

describe('测试响应式', () => {
  beforeEach(()=>{
    vi.useFakeTimers()
  })
  it('响应式对象', () => {
    const original = { foo: 1, bar: { name: '大圣' } }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(isReactive(observed.foo)).toBe(false)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    // get
    expect(observed.foo).toBe(1)
    // has
    expect('foo' in observed).toBe(true)
    // ownKeys
    expect(Object.keys(observed)).toEqual(['foo', 'bar'])
    // delete
    delete observed.foo
    expect('foo' in observed).toBe(false)
    // deep reactive
    expect(observed.bar.name).toBe('大圣')
    expect(isReactive(observed.bar)).toBe(true)
  })
  it('浅层响应式', () => {
    const original = { foo: 1, bar: { name: '大圣' } }
    const observed = shallowReactive(original)
    expect(isReactive(observed.foo)).toBe(false)
    expect(isReactive(observed)).toBe(true)
    // getter
    expect(observed.bar.name).toBe('大圣')
  })
  it('为啥用WeakMap',()=>{
    const map = new Map()
    const weakmap = new WeakMap()
    //立即执行
    ~(function(){
      const foo = { name:'大圣' }
      const bar = { name:'小圣' }
      map.set(foo,'1')
      weakmap.set(bar,'小圣')
    }())
    expect(map.size).toEqual(1) 
    //weakmap会被回收
  })
  it('为啥用Reflect',async ()=>{

    const obj = {
      _age: 1,
      get age() {
        return this._age
      }
    }
    let p = reactive(obj)
    let fn = vi.fn((arg)=>{})
    effect(()=>{
      fn(p.age)
    })
    expect(fn).toHaveBeenCalledTimes(1)
    p._age++
    expect(fn).toHaveBeenCalledTimes(2) //不用Reflect不生效

  })
  it('删除属性',()=>{
    const data = { name:'大圣',age:18 }
    const obj =reactive(data)
    let deleteFn = vi.fn((arg)=>{})
    effect(()=>{
      deleteFn(obj.name)
    })
    expect(deleteFn).toHaveBeenCalledTimes(1)
    delete obj.name
    expect(deleteFn).toHaveBeenCalledTimes(2)
  })
  it('判断属性In',()=>{
    const data = { name:'大圣',age:18 }
    const obj =reactive(data)
    let hasFn = vi.fn((arg)=>{})
    effect(()=>{
      hasFn('name' in obj)
    })
    expect(hasFn).toHaveBeenCalledTimes(1)
    expect(hasFn).toHaveBeenCalledWith(true)
    delete obj.name
    expect(hasFn).toHaveBeenCalledWith(false)

    // expect(hasFn).toHaveBeenCalledTimes(2)
  })
  
})

