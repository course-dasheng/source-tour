import {describe,it,expect,vi,afterEach, beforeEach} from 'vitest'

import { effect,ref,isRef } from '../src'

describe('ref测试',()=>{
  it('ref基本使用',()=>{
    const r = ref(0)
    let val
    effect(() => {
      val = r.value
    })
    expect(val).toBe(0)
    r.value++
    expect(val).toBe(1)
    expect(isRef(r)).toBe(true)
  })

  it('ref复杂数据，其实也是用了reactive',()=>{
    const r = ref({name:'玩转Vue3'})
    let val
    effect(() => {
      val = r.value.name
    })
    expect(val).toBe('玩转Vue3')
    r.value.name = '重学前端'
    expect(val).toBe('重学前端')
  })

  
})