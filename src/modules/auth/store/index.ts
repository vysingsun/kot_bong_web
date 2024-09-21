import { defineStore } from 'pinia'
import { authService } from '@/modules/auth/services/api.service'
import router from '@/router'

export const useAuthStore = defineStore('authStore', () => {
  const login = async (payload: object) => {
    await authService
      .login(payload).then(res => {
        if (res.data.success) {
          router.push('/')
        } else {
          alert(res.data.error)
        }
      }).catch(error => {
        alert(error)
      })
  }
  return {
    login
  }
})
