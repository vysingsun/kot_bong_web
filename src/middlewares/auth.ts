import { useAppStore } from '@/modules/app/store/index'
export function isAuthenticated(to: any, from: any, next: any) {
    const appStore = useAppStore()
    appStore
        .init()
        .then(() => {
            next()
        })
        .catch(() => {
            next({ name: 'Login' })
        })
}

export function isUnauthenticated(to: any, from: any, next: any) {
    const appStore = useAppStore()
    appStore
        .init()
        .then(() => {
            next({ path: '/' })
        })
        .catch(error => {
            if (error.response.status === 401) {
                next()
            }
        })
}
