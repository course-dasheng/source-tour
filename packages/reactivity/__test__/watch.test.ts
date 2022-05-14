
import { effect,reactive,watch } from '../src'
import {describe,it,expect,vi,afterEach, beforeEach} from 'vitest'


describe('测试watch监听器',()=>{
  beforeEach(()=>{
    vi.useFakeTimers()
  })
  it('watch基本使用',()=>{
    let data = {age:1}
    let obj = reactive(data)
    let fn = vi.fn((a1,a2)=>{
      // console.log(a1,a2)
    })
    watch(()=>obj.age,(newValue,oldValue)=>{
      fn(newValue,oldValue)
    })
    expect(fn).toHaveBeenCalledTimes(0)
    obj.age++
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(2,1)
  })

  it('watch对象',async ()=>{
    let data = {age:1,name:'大圣'}
    let obj = reactive(data)
    let fn = vi.fn((a1,a2)=>{
    })
    watch(obj,(oldValue,newValue)=>{
      fn(oldValue,newValue)
    },{
      immediate:true,
      flush:'post'
    })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(
      {age:1,name:'大圣'},
      undefined
    )
    obj.age++
    expect(fn).toHaveBeenCalledTimes(1)
    await vi.runAllTicks()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

