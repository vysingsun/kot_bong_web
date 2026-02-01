// Auth Interfaces
export interface RegisterPayload {
    username: string
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

export interface VerifyOTPPayload {
    email: string
    otp: string
}

export interface AuthResponse {
    success: boolean
    message: string
    data?: any
}
