import { defineStore } from 'pinia'
import { authService } from '@/modules/auth/services/api.service'
import router from '@/router'
import { removeAll, setCache } from '@/composables/useCache'

export const useAuthStore = defineStore('authStore', () => {
    // Get your backend API URL from environment or config
    const backendUrl = import.meta.env.VITE_API_BASE_URL || ''
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
    const googleOAuth = async () => {
        try {
            // Redirect to backend Google OAuth route
            window.location.href = `${backendUrl}/auth/google`
        } catch (error) {
            console.error('Google OAuth error:', error)
            alert('Failed to initialize Google login')
        }
    }

    const facebookOAuth = async () => {
        try {
            // Redirect to backend Google OAuth route
            window.location.href = `${backendUrl}/auth/facebook`
        } catch (error) {
            console.error('Google OAuth error:', error)
            alert('Failed to initialize Google login')
        }
    }

    const handleGoogleCallback = async (token: string) => {
        try {
            // Store the token
            setCache('token', token)
            // Redirect to home page
            router.push('/')
        } catch (error) {
            console.error('Error handling Google callback:', error)
            throw error
        }
    }

    const handleFacebookCallback = async (token: string) => {
        try {
            // Store the token
            setCache('token', token)
            // Redirect to home page
            router.push('/')
        } catch (error) {
            console.error('Error handling Google callback:', error)
            throw error
        }
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
        googleOAuth,
        facebookOAuth,
        handleGoogleCallback,
        handleFacebookCallback,
    }
})
