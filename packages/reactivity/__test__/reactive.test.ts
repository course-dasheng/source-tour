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

  it('for 循环',()=>{
    let obj =reactive({ name:'大圣1'})
    let forFn = vi.fn((arg)=>{})
    effect(()=>{
      // console.log(Object.keys(obj))
      // 还有for in 都和ownkeys息息相关
      forFn(Object.keys(obj))
      // console.log('age' in obj)
    })
    expect(forFn).toHaveBeenCalledTimes(1)
    expect(forFn).toHaveBeenCalledWith(['name'])
    obj.agexx = 1
    // obj.demo = '1'
    expect(forFn).toHaveBeenCalledTimes(2)
    // expect(forFn).toHaveBeenCalledWith(['name','age'])

    // delete obj.name
    // expect(forFn).toHaveBeenCalledWith(false)
    // expect(forFn).toHaveBeenCalledTimes(4)
  })
  it('数据不变不触发更新',()=>{
    let obj =reactive({ age:1})
    let fn = vi.fn((arg1)=>{})
    effect(()=>{
      fn(obj.name)
    })
    obj.age = 1 //没变
    expect(fn).toHaveBeenCalledTimes(1)
  })
  it('测试数组响应式',()=>{
    let arr = reactive(['大圣'])
    let fn = vi.fn((arg1)=>{})
    effect(()=>{
      fn(arr[0])
    })
    arr[0] = 1
    expect(fn).toHaveBeenCalledTimes(2) //自动就有这个功能，数组本质也是对象
  })
  //数组的常见读操作
  // arr[0], arr.length, for in ,for of
  // concat,join,every,find,some,等方法
  // 数组常见写操作
  // arr[0] =1 ,arr.length = 0
  // push,pop,shift,unshift,splice,sort,reverse,fill
  it('数组越界修改length',()=>{
    let arr = reactive(['大圣'])
    let fn = vi.fn((arg1)=>{})
    effect(()=>{
      fn(arr.length)
    })
    arr[1] = 2 // 越界没检测到 本质上其实修改了length
    // expect(fn).toHaveBeenCalledWith(1) 
    expect(fn).toHaveBeenCalledTimes(2) 
  })
  it('数组修改length更新数组',()=>{
    let arr = reactive(['大圣','小圣'])
    let fn = vi.fn((arg1)=>{})
    let fn1 = vi.fn((arg1)=>{})
    effect(()=>{
      fn(arr[0])
    })
    effect(()=>{
      fn1(arr[1])
    })
    expect(fn).toHaveBeenCalledWith('大圣')
    expect(fn1).toHaveBeenCalledWith('小圣')

    arr.length = 1 //触发修改
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn1).toHaveBeenCalledTimes(2)
  })

  
})

