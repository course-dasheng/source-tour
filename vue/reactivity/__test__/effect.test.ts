import { describe, expect, it,vi } from 'vitest'
import { effect,reactive,ref } from '../src/'

describe('effect',()=>{
  it('effect嵌套',()=>{

    const data = {foo:1, bar:2}
    const obj = reactive(data)
    let tmp1, tmp2
    let fn1 = vi.fn(()=>{}) // vi.fn包裹之后，就可以测试这个函数执行了多少次
    let fn2 = vi.fn(()=>{}) 

    effect(()=>{
      fn1()
      effect(()=>{
        fn2()
        tmp2 = obj.bar
      })
      tmp1 = obj.foo
    })

    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
    expect(tmp1).toBe(1)
    expect(tmp2).toBe(2)

    obj.foo = 3
    expect(fn1).toBeCalledTimes(2)
    // expect(fn2).toBeCalledTimes(1)
  })
})