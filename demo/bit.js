



// 1. 涉及到权限判断的，都可以考虑用位运算
// 0001
// 0010
// 0100
// 1000
// vue和react中，就会用位运算，判断一个组件是不是component 还是div这种标签，
// 位运算本质就是更快，所以比较受框架喜欢
let read = 1
let write = 1<<1
let remove = 1<<2
let admin = 1<<3
let dasheng = 1<< 4


// |= 授权
// & 判断权限
// &= ~删除权限
let role = read | write //授权
console.log(!!(role & read))
console.log(!!(role & write))
console.log(!!(role & remove))
console.log(!!(role & admin))
console.log('---')
role |= read|remove
console.log(!!(role & read))
console.log(!!(role & write))
console.log(!!(role & remove))
console.log(!!(role & admin))

