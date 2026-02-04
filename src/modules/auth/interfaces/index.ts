// Auth Interfaces
export interface RegisterPayload {
    email?: string
    phone?: string
    password: string
    repeat_password: string
    firstName: string
    lastName: string
    station_name: string
    owner: string
    language: string
}

export interface SendOTPPayload {
    email: string
    firstName: string
}

export interface SendOTPtoSMSPayload {
    phone: string
    firstName: string
}

export interface VerifyOTPPayload {
    identifier: string
    otp: string
}

export interface AuthResponse {
    success: boolean
    message: string
    data?: any
}
