import { describe, expect, it,vi } from 'vitest'
import { effect,reactive,ref ,shadowReactive,isReactive,isRef} from '../src/'
// import {effect} from '../src/effect'
// import {reactive} from '../src/reactive'
describe('响应式',()=>{
  it('reactive基本功能',()=>{
    let obj = reactive({count:1})
    let val
    effect(()=>{
      val = obj.count
    })
    expect(val).toBe(1) // 过了

    obj.count++
    expect(val).toBe(2) // effect副作用执行了
  })
  it('reative支持嵌套',()=>{
    let obj = reactive({count:1, info:{name:'dasheng'}})
    let val
    effect(()=>{
      val = obj.info.name
    })
    expect(val).toBe('dasheng') // 过了
    obj.info.name = 'vue3'
    // obj.count++
    expect(val).toBe('vue3') // effect副作用执行了

  })
  it('响应式的清理',()=>{
    let obj = reactive({
      ok:true,
      name:'dasheng'
    })
    let val
    let fn = vi.fn(()=>{
      val = obj.ok ? obj.name : 'vue3'
    })
    effect(fn)
    expect(val).toBe('dasheng')
    expect(fn).toBeCalledTimes(1)

    obj.ok = false
    expect(val).toBe('vue3')
    expect(fn).toBeCalledTimes(2)

    obj.name = 'xiaosheng'
    expect(fn).toBeCalledTimes(2)


  })
  it('es6 set遍历的缺陷',()=>{
    let fn = ()=>{
      const set = new Set([1])
      let n = 1
      set.forEach(v=>{
        set.delete(1)
        set.add(1) //set没变化
        n+=1
        if(n>99){
          throw new Error("死循环");
        }
      })
    }
    expect(()=>fn()).toThrowError('死循环')
  })
  it('删除属性的响应式',()=>{
    let obj = reactive({name:'dasheng',count:1})
    let val
    effect(()=>{
      val = obj.name
    })
    expect(val).toBe('dasheng')
    delete obj.name
    expect(val).toBeUndefined()
  })

  it('why reflect',()=>{
    const obj = {
      _count:1,
      get count(){
        return this._count
      }
    }

    const ret = reactive(obj)
    const fn = vi.fn((arg)=>{})
    effect(()=>{
      fn(ret.count) // 触发的是count函数内部的this_count
    })

    expect(fn).toBeCalledTimes(1)
    ret._count++
    expect(fn).toBeCalledTimes(2)
  })
  it('工具函数',()=>{
    let val = ref(1)
    let val2 = reactive({name:'dasheng'})
    let val3 = shadowReactive({name:'dasheng'})
    expect(isRef(val)).toBe(true)
    expect(isReactive(val2)).toBe(true)
    expect(isReactive(val3)).toBe(true)

  })
  it('ref',()=>{
    let num = ref(1)
    let val
    effect(()=>{
      val = num.value
    })
    expect(val).toBe(1) // 过了

    num.value++
    expect(val).toBe(2) // effect副作用执行了
  })
  it('ref支持复杂数据类型',()=>{
    let num = ref({count:1})
    let val
    effect(()=>{
      val = num.value.count
    })
    expect(val).toBe(1) // 过了

    num.value.count++
    expect(val).toBe(2) // effect副作用执行了
  })


  // 每一个边缘处理case， 都需要一个测试
})
describe('浅层响应式',()=>{
  it('shadowReactive',()=>{
    let obj = shadowReactive({count:1, info:{name:'dasheng'}})
    let val1,val2
    effect(()=>{
      val1 = obj.info.name
    })
    effect(()=>{
      val2 = obj.count
    })
    
    expect(val1).toBe('dasheng') // 过了
    expect(val2).toBe(1) // 过了

    obj.info.name = 'vue3'
    obj.count++
    expect(val1).toBe('dasheng') // 深层的没有响应式
    expect(val2).toBe(2) // 过了

    // obj.count++
    // expect(val).toBe('vue3') // effect副作用执行了

  })
})
// {},[]   (Prixy, get,set)
// number,string  (ref)
// map set weakmap weakset (Proxy)
// let obj = {name:'dasheng'}
// obj.name   //get
// obj.name = 'xx'  //set
// let set = new Set([1]
// set.add(2)  // get ,key是add

describe('支持set/map',()=>{
  it('set',()=>{
    let set = reactive(new Set([1]))
    let val
    effect(()=>{
      val = set.size
    })
    expect(val).toBe(1)
    set.add(2)
    expect(val).toBe(2)
  })
  // @todo 作业
  it('set的删除',()=>{
    let set = reactive(new Set([1,2]))
    let val
    effect(()=>{
      val = set.size
    })
    expect(val).toBe(2)
    set.delete(2)
    expect(val).toBe(1)
  })
  it('set的hash',()=>{
    let set = reactive(new Set([1,2]))
    expect(set.has(1)).toBe(true)
    set.delete(1)
    expect(set.has(1)).toBe(false)
    // expect(val).toBe(1)
  })
})