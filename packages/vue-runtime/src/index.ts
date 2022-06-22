

import { createRenderer } from "./runtime-core"

// runtime-dom

let renderer

let nodeOps = {
  createElement:()=>{},
  createText:()=>{},
  setText:()=>{},
  patchProp:()=>{},
  insert:()=>{},
  remove:()=>{},
}
function ensureRenderer() {
  // 缓存
  return renderer || (renderer = createRenderer(nodeOps))
}

export const createApp = (...args) => {
  return ensureRenderer().createApp(...args);
};
