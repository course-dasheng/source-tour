
import { effect,reactive,watch } from '../src'
import {describe,it,expect,vi,afterEach, beforeEach} from 'vitest'


describe('测试watch监听器',()=>{
  beforeEach(()=>{
    vi.useFakeTimers()
  })
  it('watch基本使用',()=>{
    let data = {age:1}
    let obj = reactive(data)
    let fn = vi.fn((a1,a2)=>{})
    watch(()=>obj.age,(newValue,oldValue)=>{
      fn(newValue,oldValue)
    })
    expect(fn).toHaveBeenCalledTimes(0)
    obj.age++
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(2,1)
  })

})

