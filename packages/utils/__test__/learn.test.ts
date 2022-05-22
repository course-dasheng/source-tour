import { describe, expect, it } from 'vitest'


describe('测试一些语法和基础', () => {

  it('位运算',()=>{
    // 每个权限可以用一个二进制位表达
    let role0 = 1 << 0   // 0001
    let role1 = 1 << 1   // 0010
    let role2 = 1 << 2   // 0100
    let role3 = 1 << 3   // 1000
    let user1 = 0 // 啥也没有

    // 用 | 授权，用& 检查全新啊，用& ~ 撤销授权
    user1 |= role1
    user1 |= role2
    expect(user1 & role0).toBeFalsy() 
    expect(user1 & role1).toBeTruthy()
    expect(user1 & role2).toBeTruthy()
    expect(user1 & role3).toBeFalsy()
    user1 &=  ~role1 //删除 role1 全部位置翻转，然后&，相当于删除了role1的权限
    expect(user1 & role0).toBeFalsy() 
    expect(user1 & role1).toBeFalsy()
  })
})