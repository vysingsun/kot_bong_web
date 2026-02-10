import axios from 'axios'
import { getFromCache } from '@/composables/useCache'
import type {
    RegisterPayload,
    SendOTPPayload,
    VerifyOTPPayload,
    SendOTPtoSMSPayload,
} from '@/modules/auth/interfaces/index'

const getToken = () => {
    const token = getFromCache('token')?.value
    return token && `Bearer ${token}`
}

export const authService = {
    login: async (payload: object) => {
        return axios.post('auth/login', payload, { withCredentials: true })
    },
    logout: async () => {
        return axios.post(
            'auth/logout',
            {},
            {
                headers: {
                    Authorization: getToken(),
                },
            },
        )
    },
    sendOTP: async (payload: SendOTPPayload) => {
        return axios.post('auth/send-otp', payload)
    },

    sendOTPtoSMS: async (payload: SendOTPtoSMSPayload) => {
        return axios.post('auth/send-otp-sms', payload)
    },

    verifyOTP: async (payload: VerifyOTPPayload) => {
        return axios.post('auth/verify-otp', payload)
    },

    register: async (payload: RegisterPayload) => {
        return axios.post('auth/register', payload, { withCredentials: true })
    },

    registerBySMS: async (payload: RegisterPayload) => {
        return axios.post('auth/register-phone', payload, { withCredentials: true })
    },

    // Forgot Password - Send OTP (Email)
    sendForgotPasswordOTP: async (payload: { email: string }) => {
        return axios.post('/auth/forgot-password', payload)
    },

    // Forgot Password - Send OTP (SMS)
    sendForgotPasswordOTPSMS: async (payload: { phone: string }) => {
        return axios.post('/auth/forgot-password-sms', payload)
    },

    // Verify OTP
    verifyForgotPasswordOTP: async (payload: { identifier: string; otp: string }) => {
        return axios.post('/auth/verify-otp', payload)
    },

    // Reset Password
    resetPassword: async (payload: { identifier: string; newPassword: string; confirmPassword: string }) => {
        return axios.post('/auth/reset-password', payload)
    },
}
