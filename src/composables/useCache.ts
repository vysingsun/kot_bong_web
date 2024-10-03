/**
 * Set cache in localStorage
 */
export function setCache(key: string,
  value: string | object | [] | number | boolean,
  expirationTime?: never) {
  const item = {
    value,
    expiresAt: expirationTime ? Date.now() + expirationTime : Date.now(),
  }
  localStorage.setItem(key, JSON.stringify(item))
}

export function getFromCache(key: string) {
  const item = localStorage.getItem(key)

  return item ? JSON.parse(item) : null
}

export function isCacheExpired(key: string) {
  const item = getFromCache(key)

  return item && item.expiresAt < Date.now()
}

export function removeCache(key: string) {
  localStorage.removeItem(key)
}

export function removeCaches(keys: Array<string>) {
  keys.forEach((key: string) => localStorage.removeItem(key))
}

export function removeAll() {
  localStorage.clear()
}
