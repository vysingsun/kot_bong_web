import axios from 'axios'

export interface InitiatePaymentPayload {
    subscriptionId: string
}

export interface PaymentInitiateResponse {
    md5: string
    qr: string
    amount: number
    currency: string
    expiresAt: string
    // Returned so the frontend can poll Bakong directly
    // (server is CloudFront-blocked, browser is not)
    bakongToken: string
    bakongApiUrl: string
}

export interface PaymentStatusResponse {
    resolved: boolean
    data: {
        status: 'pending' | 'success' | 'failed' | 'expired'
        paidAt?: string | null
        bakongFromAccountId?: string | null
        bakongTransactionHash?: string | null
        billingPeriodStart?: string | null
        billingPeriodEnd?: string | null
    }
}

export interface PaymentHistoryItem {
    _id: string
    amount: number
    currency: string
    status: 'pending' | 'success' | 'failed' | 'expired' | 'refunded'
    paymentGateway: string
    paidAt: string | null
    billingPeriodStart: string | null
    billingPeriodEnd: string | null
    bakongFromAccountId: string | null
    bakongTransactionHash: string | null
    createdAt: string
    subscription?: { plan: string; pricePerMonth: number }
    station?: { name: string }
}

export interface Subscription {
    _id: string
    station: string
    owner: string
    plan: 'trial' | 'pro' | 'free'
    trialStartDate: string
    trialEndDate: string
    trialDurationMonths: number
    proStartDate: string | null
    proNextBillingDate: string | null
    proExpiryDate: string | null
    pricePerMonth: number
    isActive: boolean
    staffSuspendedAt: string | null
    staffRestoredAt: string | null
    createdAt: string
    updatedAt: string
    isTrialActive: boolean
    hasProAccess: boolean
    canManageStaff: boolean
    canExportExcel: boolean
    id: string
}

export interface StationUser {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    isSuspended: boolean
    createdAt: string
}

export interface BakongTransaction {
    hash: string
    fromAccountId: string
    toAccountId: string
    currency: string
    amount: number
    description?: string
}

export const paymentService = {
    initiate: async (data: InitiatePaymentPayload) => {
        return axios.post<{ success: boolean; data: PaymentInitiateResponse }>('/payments/initiate', data)
    },

    // getStatus: async (md5: string) => {
    //     return axios.get<{ success: boolean } & PaymentStatusResponse>(`/payments/status/${md5}`)
    // },

    // Called after frontend detects success from Bakong
    confirm: async (md5: string, transaction: BakongTransaction) => {
        return axios.post<{ success: boolean; data: PaymentHistoryItem }>('/payments/confirm', { md5, transaction })
    },

    // Proxy call — browser → your server → Bakong (avoids CORS + CloudFront)
    checkMd5: async (md5: string) => {
        return axios.post<any>('/payments/check-md5', { md5 })
    },

    // Called after frontend detects failure from Bakong
    recordFailed: async (md5: string) => {
        return axios.post('/payments/failed', { md5 })
    },

    cancelSession: async (md5: string) => {
        return axios.delete(`/payments/session/${md5}`)
    },

    getHistory: async () => {
        return axios.get<{ success: boolean; data: PaymentHistoryItem[] }>('/payments/history')
    },
}
