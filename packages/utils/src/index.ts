export function isObject(val: any) {
  return typeof val === 'object' && val !== null
}

export function hasOwn(val: object, key: string) {
  return Object.prototype.hasOwnProperty.call(val, key)
}

export function isOn(key: string) {
  return /^on[A-Z]/.test(key)
}

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}
