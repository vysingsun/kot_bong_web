import { computed } from 'vue'
import type { InjectionKey } from 'vue'
import { cacheVersion } from '@/composables/useCache'

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
    // localStorage reads aren't tracked by Vue, so without depending on
    // cacheVersion this would cache the role from the first access forever —
    // e.g. still reporting "Admin" after logging out and back in as "User".
    const userRole = computed<string>(() => {
        void cacheVersion.value // dependency: forces re-evaluation on cache writes
        const item = localStorage.getItem('app_data')
        if (!item) return ''
        try {
            return JSON.parse(item)?.value?.role?.role_name ?? ''
        } catch {
            return ''
        }
    })

    const isAdmin = computed(() => userRole.value === 'Admin' || userRole.value === 'Super_Admin')
    const isSuperAdmin = computed(() => userRole.value === 'Super_Admin')
    const isUser = computed(() => userRole.value === 'User')

    function hasRole(roles: string | string[]): boolean {
        const allowed = Array.isArray(roles) ? roles : [roles]
        return allowed.includes(userRole.value)
    }

    return { userRole, isAdmin, isSuperAdmin, isUser, hasRole }
}
