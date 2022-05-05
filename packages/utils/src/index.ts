export function isObject(val: any) {
  return typeof val === 'object' && val !== null
}

export function hasOwn(val: object, key: string) {
  return Object.prototype.hasOwnProperty.call(val, key)
}

export function isOn(key: string) {
  return /^on[A-Z]/.test(key)
}
