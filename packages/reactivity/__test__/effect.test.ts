

import { effect,reactive, shallowReactive } from '../src'
import {describe,it,expect,vi,afterEach, beforeEach} from 'vitest'

describe('测试effect', () => {
  beforeEach(()=>{
    vi.useFakeTimers()
  })
  afterEach(()=>{
    vi.restoreAllMocks()
  })

  it('reactive基本使用', () => {
    const ret = reactive({ num: 0 })
    let val
    effect(() => {
      val = ret.num
    })
    expect(val).toBe(0)
    ret.num++
    expect(val).toBe(1)
    ret.num = 10
    expect(val).toBe(10)
  })

  it('一个reactive对象的属性在多个effect中使用', () => {
    const ret = reactive({ num: 0 })
    let val, val2
    effect(() => {
      val = ret.num
    })
    effect(() => {
      val2 = ret.num
    })
    expect(val).toBe(0)
    expect(val2).toBe(0)
    ret.num++
    expect(val).toBe(1)
    expect(val2).toBe(1)
    ret.num = 10
    expect(val).toBe(10)
    expect(val2).toBe(10)
  })

  it('shalldowReactive基本使用', () => {
    const ret = shallowReactive({ num: 0 })
    let val
    effect(() => {
      val = ret.num
    })
    expect(val).toBe(0)
    ret.num++
    expect(val).toBe(1)
    ret.num = 10
    expect(val).toBe(10)
  })

  it('reactive 嵌套', () => {
    const ret = reactive({
      name: '玩转Vue3',
      info: {
        price: 129,
        type: 'f2e'
      }
    })
    let price
    effect(() => {
      price = ret.info.price
    })
    expect(price).toBe(129)
    ret.info.price++
    expect(price).toBe(130)
  })
  it('shalldowReactive 浅层响应式', () => {
    const ret = shallowReactive({
      name: '玩转Vue3',
      info: {
        price: 129,
        type: 'f2e'
      }
    })
    let price
    effect(() => {
      price = ret.info.price
    })
    expect(price).toBe(129)
    ret.info.price++
    expect(price).toBe(129) // 嵌套的没有响应式效果
  })
  it('分支切换',()=>{
    const data = {
      ok:true,
      text:'大圣'
    }
    let message = ''
    const obj = reactive(data)
    let fn = vi.fn(()=>{
      message = obj.ok?obj.text:'没有'
    })
    effect(fn)

    // data
    //   ok =>effectFn
    //   text=?effectFn
    expect(fn).toHaveBeenCalledTimes(1)
    expect(message).toBe('大圣') //合理
    obj.ok = false
    expect(message).toBe('没有') //合理
    expect(fn).toHaveBeenCalledTimes(2)
    obj.text = '其他字符' // 已经和message无关了
    expect(fn).toHaveBeenCalledTimes(2) // 现在还会执行一次 需要清理依赖
  
  })
  it('set遍历中删除的缺陷',()=>{
    let fn = ()=>{
      const set = new Set([1])
      let n = 1
      set.forEach(v => {
        set.delete(1)
        set.add(1)
        n+=1
        if(n>99){
          throw new Error('死循环')
        }
      })
    }
    expect(()=>fn()).toThrowError('死循环')
  })
  it('effect嵌套',()=>{
    // 原始数据
    const data = { foo: true, bar: true }
    // 对原始数据的代理
    const obj = reactive(data)
    let temp1, temp2
    let fn1 = vi.fn(()=>{})
    let fn2 = vi.fn(()=>{})
    effect(function effectFn1() {
      fn1()
      effect(function effectFn2() {
        fn2()
        temp2 = obj.bar
      })
      temp1 = obj.foo
    })
    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
    obj.foo = false
    expect(fn1).toHaveBeenCalledTimes(2)
    // expect(fn2).toHaveBeenCalledTimes(1)
  })
  it('prxy的无限递归问题',()=>{
    const testFn = vi.fn(()=>{
      const data = {age:1}
      const obj = reactive(data)
      effect(()=>{
        obj.age++
      })
    })
    // expect(()=>testFn()).toThrowError('Maximum call stack size exceeded')
    expect(()=>testFn()).not.toThrowError('Maximum call stack size exceeded')
  })
  it('effect的调度逻辑',async ()=>{

    const data = { age: 1}
    // 对原始数据的代理
    const obj = reactive(data)
    let arr1 = []
    effect(()=>{
      arr1.push(obj.age)
    })

    let arr = []
    effect(() => {
      arr.push(obj.age)
    }, {
      scheduler(fn) {
        setTimeout(fn) // 下一个任务循环
      }
    })
    obj.age++
    arr.push('end')
    arr1.push('end')
    // set
    await vi.runAllTimers()
    expect(arr.join(',')).toBe('1,end,2')
    expect(arr1.join(',')).toBe('1,2,end')
  })
  it('手动停止',()=>{
    let data = reactive({
      name:'大圣'
    })
    let fn = vi.fn((...args)=>{})
    let effectFn = effect(()=>{
      fn(data.name)
    })
    data.name = '小圣'
    expect(fn).toHaveBeenCalledTimes(2)
    effectFn.stop()
    data.name = '大圣'
    expect(fn).toHaveBeenCalledTimes(2)
  })
  it('基于调度功能的性能优化,一次事件循环中修改多次，vue渲染的优化',async ()=>{
    const data = { age: 1}
    // 对原始数据的代理
    const obj = reactive(data)
    const jobQueue = new Set()
    // 微任务队列
    const p = Promise.resolve()
    
    let isFlushing = false
    function flushJob() {
      if (isFlushing) return
      isFlushing = true
      p.then(() => {
        jobQueue.forEach(job => job())
      }).finally(() => {
        isFlushing = false
      })
    }
    let fnOb = {
      count(n){
        // console.log(n)
        return n
      }
    }
    let fn = vi.spyOn(fnOb,'count')

    effect(() => {
      fnOb.count(obj.age)
    }, {
      scheduler(fn) {
        jobQueue.add(fn)
        flushJob()
      }
    })
    
    obj.age++
    obj.age++
    obj.age++

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1)
    await vi.runAllTicks() // vue的微任务优化
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledWith(4)
  })

})