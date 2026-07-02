import { computed } from 'vue'
import type { InjectionKey } from 'vue'

export type AuthReturn = ReturnType<typeof useAuth>
export const AuthKey: InjectionKey<AuthReturn> = Symbol('auth')

// ✅ Always reads fresh from localStorage - works in router guards too
export function getRoleName(): string {
    const item = localStorage.getItem('app_data')
    if (!item) return ''
    try {
        return JSON.parse(item)?.value?.role?.role_name ?? ''
    } catch {
        return ''
    }
}

export function useAuth() {
    // Each computed re-reads localStorage on every access — stays reactive after login
    const userRole = computed<string>(() => {
        const item = localStorage.getItem('app_data')
        if (!item) return ''
        try {
            return JSON.parse(item)?.value?.role?.role_name ?? ''
        } catch {
            return ''
        }
    })

    const isAdmin = computed(() => userRole.value === 'Admin')
    const isUser = computed(() => userRole.value === 'User')

    function hasRole(roles: string | string[]): boolean {
        const allowed = Array.isArray(roles) ? roles : [roles]
        return allowed.includes(userRole.value)
    }

    return { userRole, isAdmin, isUser, hasRole }
}
