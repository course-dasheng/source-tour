export function isObject(val: any) {
  return typeof val === 'object' && val !== null
}

export function isOn(key: string) {
  return key[0] === 'o' && key[1] === 'n'
}

// 获取一个变量的类型
export function toRawType(value:any){
    return Object.prototype.toString.call(value).slice(8,-1)
}
