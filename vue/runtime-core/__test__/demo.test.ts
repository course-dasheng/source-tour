import { expect, test } from 'vitest'
import { effect, ref } from '@shengxj/reactivity'
//test jsdom 
test('window is not undefined', () => {
  expect(window).toBeDefined()
})

test('test dom', () => {
  let dom = document.createElement('div')
  function renderer(domString, container) {
    container.innerHTML = domString
  }
  const count = ref(1)
  effect(() => {
    renderer(`<h1>${count.value}</h1>`, dom)
  })
  count.value++
  expect(dom.innerHTML).toBe('<h1>2</h1>')
})




