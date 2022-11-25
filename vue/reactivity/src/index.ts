// @todo
// vue的响应式实现
import { isObject } from '@shengxj/utils'
import { effect } from './effect'

export const ret = isObject({})
// console.log(ret)


export { reactive,shadowReactive,isReactive } from './reactive'
export { effect ,trigger,track} from './effect'
export { ref,isRef } from './ref'


// <组件1>
//   <组件2>
// createApp（组件）
//   创建组件  （组件内部的数据, reavtive一下， script setup中直接调用的ref或者reactive
//     effect(()=>{
//       组件的更新逻辑
//     })
//   组件mount
