
import {describe, it, expect} from 'vitest'
import {isObject,isOn} from '../src'

describe('测试工具库',()=>{
  it('测试isObject函数',()=>{
    expect(1+2).toBe(3)
    expect(isObject({})).toBe(true)
    expect(isObject(1)).toBe(false)
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject('')).toBe(false)
    expect(isObject([])).toBe(true)
  })
  it('测试isOn函数',()=>{
    expect(isOn('onClick')).toBe(true)
    expect(isOn('click')).toBe(false)
  })
  it('位运算科普',()=>{
    // 010  //2 二进制的一些运算
    // & | !
    // & 两个位置都是1，结果才是1，否则就是0
    // | 两个位置只要有一个是1，结果就是1，否则就是0
    // 性能高
    
    const role1 = 1     // 0001
    const role2 = 1<<1  // 0010    1101
    const role3 = 1<<2  // 0100
    const role4 = 1<<1  // 1000
    // 按位或 就是授权
    let action = role1 | role3
    action |= role3
    // 按位置与 ，就校验权限
    expect(!!(action&role1)).toBe(true)
    expect(!!(action&role2)).toBe(false)
    expect(!!(action&role3)).toBe(true)
    expect(!!(action&role4)).toBe(false)

    action &= ~role3
    // // 权限的删除
    expect(!!(action&role1)).toBe(true)
    expect(!!(action&role2)).toBe(false)
    expect(!!(action&role3)).toBe(false)


  })
  // it('测试')
})