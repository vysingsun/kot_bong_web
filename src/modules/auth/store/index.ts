import { defineStore } from 'pinia'
import { authService } from '@/modules/auth/services/api.service'
import router from '@/router'
import { removeAll, setCache } from '@/composables/useCache'
import { ref } from 'vue'
import type {
    RegisterPayload,
    SendOTPPayload,
    SendOTPtoSMSPayload,
    VerifyOTPPayload,
} from '@/modules/auth/interfaces/index'

export const useAuthStore = defineStore('authStore', () => {
    const user = ref(null)
    const isAuthenticated = ref(false)
    const loading = ref(false)
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
        } catch (error) {
            console.error('Error handling Google callback:', error)
            throw error
        }
    }

    const handleFacebookCallback = async (token: string) => {
        try {
            // Store the token
            setCache('token', token)
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
    const sendOTP = async (payload: SendOTPPayload) => {
        loading.value = true
        try {
            const response = await authService.sendOTP(payload)
            return response.data
        } catch (error) {
            throw error
        } finally {
            loading.value = false
        }
    }

    const sendOTPtoSMS = async (payload: SendOTPtoSMSPayload) => {
        loading.value = true
        try {
            const response = await authService.sendOTPtoSMS(payload)
            return response.data
        } catch (error) {
            throw error
        } finally {
            loading.value = false
        }
    }

    const verifyOTP = async (payload: VerifyOTPPayload) => {
        loading.value = true
        try {
            const response = await authService.verifyOTP(payload)
            return response.data
        } catch (error) {
            throw error
        } finally {
            loading.value = false
        }
    }

    const register = async (payload: RegisterPayload) => {
        loading.value = true
        try {
            const response = await authService.register(payload)
            user.value = response.data.user
            isAuthenticated.value = true
            return response.data
        } catch (error) {
            throw error
        } finally {
            loading.value = false
        }
    }

    const registerBySMS = async (payload: RegisterPayload) => {
        loading.value = true
        try {
            const response = await authService.registerBySMS(payload)
            user.value = response.data.user
            isAuthenticated.value = true
            return response.data
        } catch (error) {
            throw error
        } finally {
            loading.value = false
        }
    }

    // Forgot Password - Send OTP (Email)
    const sendForgotPasswordOTP = async (payload: { email: string }) => {
        try {
            const response = await authService.sendForgotPasswordOTP(payload)
            return response.data
        } catch (error) {
            throw error
        }
    }

    // Forgot Password - Send OTP (SMS)
    const sendForgotPasswordOTPSMS = async (payload: { phone: string }) => {
        try {
            const response = await authService.sendForgotPasswordOTPSMS(payload)
            return response.data
        } catch (error) {
            throw error
        }
    }

    // Verify OTP
    const verifyForgotPasswordOTP = async (payload: { identifier: string; otp: string }) => {
        try {
            const response = await authService.verifyForgotPasswordOTP(payload)
            return response.data
        } catch (error) {
            throw error
        }
    }

    // Reset Password
    const resetPassword = async (payload: { identifier: string; newPassword: string; confirmPassword: string }) => {
        try {
            const response = await authService.resetPassword(payload)
            return response.data
        } catch (error) {
            throw error
        }
    }
    return {
        login,
        logout,
        sendOTP,
        sendOTPtoSMS,
        verifyOTP,
        register,
        registerBySMS,
        googleOAuth,
        facebookOAuth,
        handleGoogleCallback,
        handleFacebookCallback,
        sendForgotPasswordOTP,
        sendForgotPasswordOTPSMS,
        verifyForgotPasswordOTP,
        resetPassword,
    }
})
