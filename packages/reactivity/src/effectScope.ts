import {effectFnType} from './effect'
//设计有点类似effect, active记录当前的effectscope
let activeEffectScope: EffectScope | undefined
// 可能轮询调用，记录栈
const effectScopeStack: EffectScope[] = []

export class EffectScope {
  // 是否可用
  active = true
  // effects
  effects: effectFnType[] = []
  scopes: EffectScope[] =[]
  // 当前scope在父级中的位置
  index: number | undefined
  constructor() {
    if (activeEffectScope) {
      // 记住在父级中的位置
      this.index = activeEffectScope.scopes.push(this)-1
    }
  }

  // 用户执行操作
  run<T>(fn: () => T): T | undefined {
    if (this.active) {
      try {
        // effect收集
        this.on()
        // 执行
        return fn()
      } finally {
        this.off()
      }
    }
  }
  on() {
    // 将当前scope入栈，并设置为当前effect
    effectScopeStack.push(this)
    activeEffectScope = this
  }

  // 关闭收集
  off() {
    // effectScope嵌套的时候 逻辑和effect类似
    effectScopeStack.pop()
    activeEffectScope = effectScopeStack[effectScopeStack.length - 1]
  }

  stop() {
    // 停止所有监听 调用effect自己的stop
    this.effects.forEach(e => e.stop())
    // 停止子级scope
    if (this.scopes) { 
      this.scopes.forEach(e => e.stop())
    }
    // @todo stop的时候从父scope中删除
  }
}

// 创建effect作用域对象
export function effectScope() {
  return new EffectScope()
}

export function getCurrentScope(){
  return activeEffectScope
}

export function recordEffectScope(
  effect: effectFnType,
  scope?: EffectScope | null
) {
  // 统计effect
  scope = scope || activeEffectScope
  if (scope) {
    // 记录
    scope.effects.push(effect)
  }
}
