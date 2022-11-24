import { effect,reactive, computed,effectScope } from '../src'
import {describe,it,expect,vi,afterEach, beforeEach} from 'vitest'


describe('effectScope',()=>{
  it('effectScope使用',()=>{
    const data = reactive({ num: 1 })
    let scope = effectScope()
    let num
    scope.run(()=>{
      effect(() => (num = data.num))
    })
    expect(num).toBe(1)
    data.num++
    expect(num).toBe(2)
    scope.stop()
    data.num++
    expect(num).toBe(2)
  })
  it('effectScope + computed',()=>{
    const data = reactive({ num: 1 })
    let scope = effectScope()
    let double
    scope.run(()=>{
      double = computed(()=>data.num * 2)
    })
    expect(double.value).toBe(2)
    data.num++
    expect(double.value).toBe(4)
    scope.stop()
    data.num++
    expect(double.value).toBe(4)
  })

  it('effectScope嵌套',()=>{
    const data = reactive({ num: 1 })
    let double,triple,fourble
    let scope1 = effectScope()
    let scope2
    let scope3
    scope1.run(()=>{
      effect(()=> {
        double = data.num*2
      })
      scope2 = effectScope()
      scope2.run(()=>{
        effect(()=>{
          triple = data.num*3
        })
        scope3 = effectScope()
        scope3.run(()=>{
          effect(()=>{
            fourble = data.num*4
          })
        })
      })
    })
    expect(double).toBe(2)
    expect(triple).toBe(3)
    expect(fourble).toBe(4)
    
    data.num++ //2
    expect(double).toBe(4)
    expect(triple).toBe(6)
    expect(fourble).toBe(8)

    scope3.stop() //最里层的终止了
    data.num++ // 3
    expect(double).toBe(6)
    expect(triple).toBe(9)
    expect(fourble).toBe(8)

    scope1.stop() //最外层的stop了，scope2也要终止
    data.num++
    expect(double).toBe(6)
    expect(triple).toBe(9)
    expect(fourble).toBe(8)
  })
})