import {createAppAPI} from './apiCreateApp'
import {isSameType} from './vnode'


export function createRenderer(){
  // n1是上一次渲染的vnode，n2是这次渲染的vnode
  function patch(n1,n2,container){
    if(n1===n2){
      // 两次vnode都一样，啥也不勇敢
      return
    }

    if(n1 && isSameType(n1,n2)){
      // 节点类型一样，自身的更新
    }
    const {type, shapeFlag} = n2 //新的vnode的类型和子节点类型
    // 执行渲染逻辑了，到底是mount还是update交给子函数
    // @todo
    switch(type){
      case Text:
        // 处理文本
        break
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){
          // html标签
          processElement(n1,n2,container)
        }else{
          // 组件
          processComponent(n1,n2,container)
        }
    }
  }
  function processElement(){

  }
  function processComponent(){
    
  }
  function unmount(vnode){

  }
  function render(vnode, container){
    // 执行mout的时候执行的代码
    const preVnode = container._vnode
    if(vnode==null){
      if(preVnode){
        // 卸载
        unmount(preVnode)
      }
    }else{
      // vnode是一个对象，我们需要渲染
      patch(preVnode, vnode, container)
    }
    container._vnode = vnode
  }
  return {
    createApp: createAppAPI(render)
  }
}