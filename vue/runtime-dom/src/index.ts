


import {createRenderer} from '@shengxj/runtime-core'

let renderer = null
function ensureRenderer() {
  return renderer || (renderer = createRenderer())
}

export const createApp = (...args)=>{
    const app = createRenderer(...args)
    return app
}