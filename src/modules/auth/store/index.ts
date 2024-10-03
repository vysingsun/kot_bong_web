import { defineStore } from 'pinia'
import { authService } from '@/modules/auth/services/api.service'
import router from '@/router'
import { removeAll, setCache } from '@/composables/useCache'

export const useAuthStore = defineStore('authStore', () => {
    const login = async (payload: object) => {
        await authService
            .login(payload)
            .then(res => {
                if (res.data.success) {
                    setCache('token', res.data.data.token)
                    router.push('/')
                } else {
                    alert(res.data.error)
                }
            })
            .catch(error => {
                alert(error)
            })
    }
    const logout = async () => {
        await authService.logout().then(res => {
            if (res.data.success) {
                removeAll()
                router.push('/auth/login')
            }
        })
    }
    return {
        login,
        logout,
    }
})
