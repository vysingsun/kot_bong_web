import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { lookupService } from '@/atoms/lookup/lookup.services'
import { paymentService } from '../services/api.service'
import type { Subscription } from '../services/api.service'
import type { Station } from '@/atoms/lookup/lookup.services'
import type { PaymentInitiateResponse, PaymentHistoryItem } from '../services/api.service'

export const usePaymentStore = defineStore('paymentStore', () => {
    // ── State ──────────────────────────────────────────────
    const station = ref<Station | null>(null)
    const subscription = ref<Subscription | null>(null)
    const paymentHistory = ref<PaymentHistoryItem[]>([])

    // Payment flow state
    const currentPayment = ref<PaymentInitiateResponse | null>(null)
    const paymentSessionStatus = ref<'idle' | 'pending' | 'success' | 'failed' | 'expired'>('idle')
    const targetPlan = ref<'pro' | 'pro_max'>('pro')

    const isLoadingStation = ref(false)
    const isInitiatingPayment = ref(false)
    const isPolling = ref(false)
    const error = ref<string | null>(null)

    let pollInterval: ReturnType<typeof setInterval> | null = null
    let pollTimeout: ReturnType<typeof setTimeout> | null = null

    // ── Getters ────────────────────────────────────────────
    const currentPlan = computed(() => subscription.value?.plan ?? null)

    const nextBillingDate = computed(() => {
        if (!subscription.value?.proNextBillingDate) return null
        return new Date(subscription.value.proNextBillingDate)
    })

    const isQrExpired = computed(() => {
        if (!currentPayment.value?.expiresAt) return true
        return new Date() >= new Date(currentPayment.value.expiresAt)
    })

    // Actual amount to display — comes from the backend payment session
    const paymentAmount = computed(() => {
        if (currentPayment.value?.amount) return currentPayment.value.amount
        return targetPlan.value === 'pro_max' ? 15 : 10
    })

    // ── Actions ────────────────────────────────────────────
    async function fetchStation(stationId: string) {
        isLoadingStation.value = true
        error.value = null
        try {
            const res = await lookupService.getStationById(stationId)
            station.value = res.data.data
            subscription.value = res.data.data.subscription
        } catch (err: any) {
            error.value = err?.response?.data?.message ?? 'Failed to load station'
        } finally {
            isLoadingStation.value = false
        }
    }

    async function fetchSubscriptionStatus() {
        try {
            const res = await paymentService.getSubscriptionStatus()
            if (res.data.success && subscription.value) {
                // Merge the fresh status fields into the existing subscription object
                const s = res.data.data
                subscription.value = {
                    ...subscription.value,
                    plan: s.plan,
                    hasProAccess: s.hasProAccess,
                    canManageStaff: s.canManageStaff,
                    canExportExcel: s.canExportExcel,
                    canViewOilEstimation: s.canViewOilEstimation,
                    maxStaff: s.maxStaff,
                    isTrialActive: s.isTrialActive,
                    trialEndDate: s.trialEndDate ?? subscription.value.trialEndDate,
                    proExpiryDate: s.proExpiryDate,
                    proNextBillingDate: s.proNextBillingDate,
                    pricePerMonth: s.pricePerMonth,
                }
            }
        } catch {}
    }

    async function fetchHistory() {
        try {
            const res = await paymentService.getHistory()
            paymentHistory.value = res.data.data
        } catch {}
    }

    async function initiatePayment(subscriptionId: string) {
        isInitiatingPayment.value = true
        error.value = null
        currentPayment.value = null
        paymentSessionStatus.value = 'idle'

        try {
            const res = await paymentService.initiate({ subscriptionId, targetPlan: targetPlan.value })
            currentPayment.value = res.data.data
            paymentSessionStatus.value = 'pending'
            startPolling(res.data.data.md5, res.data.data.expiresAt)
        } catch (err: any) {
            error.value = err?.response?.data?.message ?? 'Failed to generate QR'
        } finally {
            isInitiatingPayment.value = false
        }
    }

    function startPolling(md5: string, expiresAt: string) {
        stopPolling()
        isPolling.value = true

        pollInterval = setInterval(async () => {
            try {
                const res = await paymentService.getStatus(md5)
                const { resolved, data } = res.data

                // Gateway/infra error (rate limit, proxy down, etc). The backend
                // keeps the session alive so `resolved` stays false — stop polling
                // ourselves instead of waiting out the full TTL to "expired".
                if (!resolved && data.status === 'error') {
                    stopPolling()
                    paymentSessionStatus.value = 'failed'
                    error.value = data.errorMessage ?? null
                    return
                }

                if (resolved) {
                    stopPolling()
                    paymentSessionStatus.value = data.status as any
                    if (data.status === 'success') {
                        await fetchHistory()
                        // Refresh subscription to get updated plan
                        if (station.value?._id) await fetchStation(station.value._id)
                    }
                }
            } catch {}
        }, 4000)

        // Auto-stop once the QR's own expiry passes — driven by the server's
        // expiresAt rather than a hardcoded duration, so this can never drift
        // out of sync with the backend's actual session lifetime again.
        const msUntilExpiry = Math.max(0, new Date(expiresAt).getTime() - Date.now())
        pollTimeout = setTimeout(() => {
            stopPolling()
            if (paymentSessionStatus.value === 'pending') {
                paymentSessionStatus.value = 'expired'
            }
        }, msUntilExpiry)
    }

    function stopPolling() {
        if (pollInterval) {
            clearInterval(pollInterval)
            pollInterval = null
        }
        if (pollTimeout) {
            clearTimeout(pollTimeout)
            pollTimeout = null
        }
        isPolling.value = false
    }

    async function cancelPayment() {
        if (currentPayment.value?.md5) {
            try {
                await paymentService.cancelSession(currentPayment.value.md5)
            } catch {}
        }
        stopPolling()
        currentPayment.value = null
        paymentSessionStatus.value = 'idle'
    }

    function resetPayment() {
        stopPolling()
        currentPayment.value = null
        paymentSessionStatus.value = 'idle'
        error.value = null
    }

    return {
        station,
        subscription,
        paymentHistory,
        currentPayment,
        paymentSessionStatus,
        targetPlan,
        isLoadingStation,
        isInitiatingPayment,
        isPolling,
        error,
        currentPlan,
        nextBillingDate,
        isQrExpired,
        paymentAmount,
        fetchStation,
        fetchSubscriptionStatus,
        fetchHistory,
        initiatePayment,
        cancelPayment,
        resetPayment,
        stopPolling,
    }
})
