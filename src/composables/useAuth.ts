import { computed } from 'vue'
import { getFromCache } from '@/composables/useCache'
import type { InjectionKey } from 'vue'

export type AuthReturn = ReturnType<typeof useAuth>
export const AuthKey: InjectionKey<AuthReturn> = Symbol('auth')

// ✅ Standalone function - usable OUTSIDE components (router guards, route files)
export function getRoleName(): string {
    const appData = getFromCache('app_data')
    return appData.value?.role?.role_name ?? ''
}

export function useAuth() {
    const appData = getFromCache('app_data')

    const userRole = computed(() => appData?.value?.role?.role_name ?? '')
    const isAdmin = computed(() => userRole?.value === 'Admin')
    const isUser = computed(() => userRole?.value === 'User')

    function hasRole(roles: string | string[]): boolean {
        const allowed = Array.isArray(roles) ? roles : [roles]
        return allowed.includes(userRole.value)
    }

    return { userRole, isAdmin, isUser, hasRole }
}
