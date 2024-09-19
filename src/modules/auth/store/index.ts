import { defineStore } from 'pinia'
import { authService } from '@/modules/auth/services/api.service'

interface IAuthStore {}

export const useAuthStore = defineStore('authStore', () => {
  const login = async (payload: object) => {
    await authService
      .login(payload)
      .then((res) => {
        console.log(res.data, 'log')
        alert(res)
      })
      .catch((error) => {
        alert(error.message)
      })
  }
  return {
    login
  }
})
