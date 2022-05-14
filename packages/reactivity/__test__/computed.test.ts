
import { effect,reactive,computed } from '../src'
import {describe,it,expect,vi,afterEach, beforeEach} from 'vitest'

describe('计算属性',()=>{
  it('lazy属性',()=>{
    let data = {age:1}
    let obj = reactive(data)
    let fn = vi.fn((n)=>{})
    let effectFn = effect(()=>{
      fn(obj.age)
    },{lazy:true})
    expect(fn).toHaveBeenCalledTimes(0) //默认不执行
    effectFn() //手动执行
    expect(fn).toHaveBeenCalledTimes(1) //默认不执行

  })
  it('computed',()=>{
    let data = {age:1}
    let obj = reactive(data)
    let fn = vi.fn(()=>{})
    let double = computed(()=>{
      fn()
      return obj.age * 2
    })
    double.value // 缓存，只执行一次
    expect(double.value).toBe(2)
    expect(fn).toHaveBeenCalledTimes(1) 

    obj.age+=1
    expect(double.value).toBe(4)
    expect(fn).toHaveBeenCalledTimes(2) 
  })
  it('computed嵌套在effect中',()=>{
    let data = {age:10}
    let obj = reactive(data)
    let fn = vi.fn((n)=>{})
    let double = computed(()=>{
      return obj.age * 2
    })
    effect(()=>{
      fn(double.value)
    })
    expect(fn).toHaveBeenCalledTimes(1) //执行一次
    expect(fn).toHaveBeenCalledWith(20) //执行一次
    obj.age++ // double.value也得++
    expect(fn).toHaveBeenCalledTimes(2) //obj.age出发computed依赖
    expect(fn).toHaveBeenCalledWith(22) 
  })
})
