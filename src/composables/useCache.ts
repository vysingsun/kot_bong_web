import { ref } from 'vue'

/**
 * localStorage isn't reactive, so a Vue `computed` that reads it directly
 * (e.g. useAuth's role checks) caches its result forever after the first
 * access — it never re-runs just because localStorage changed underneath it.
 * Bumping this on every cache write gives such computeds something reactive
 * to depend on, so they correctly re-evaluate after login/logout.
 */
export const cacheVersion = ref(0)

/**
 * Set cache in localStorage
 */
export function setCache(key: string, value: string | object | [] | number | boolean, expirationTime?: never) {
    const item = {
        value,
        expiresAt: expirationTime ? Date.now() + expirationTime : Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(item))
    cacheVersion.value++
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
    cacheVersion.value++
}

export function removeCaches(keys: Array<string>) {
    keys.forEach((key: string) => localStorage.removeItem(key))
    cacheVersion.value++
}

export function removeAll() {
    localStorage.clear()
    cacheVersion.value++
}
