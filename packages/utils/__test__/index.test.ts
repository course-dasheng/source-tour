
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
  // it('测试')
})