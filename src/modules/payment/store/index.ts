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

    const isLoadingStation = ref(false)
    const isInitiatingPayment = ref(false)
    const isPolling = ref(false)
    const error = ref<string | null>(null)

    let pollInterval: ReturnType<typeof setInterval> | null = null

    // ── Getters ────────────────────────────────────────────
    const currentPlan = computed(() => subscription.value?.plan ?? null)

    const trialDaysLeft = computed(() => {
        if (!subscription.value?.trialEndDate) return 0
        const diff = new Date(subscription.value.trialEndDate).getTime() - Date.now()
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
    })

    const nextBillingDate = computed(() => {
        if (!subscription.value?.proNextBillingDate) return null
        return new Date(subscription.value.proNextBillingDate)
    })

    const isQrExpired = computed(() => {
        if (!currentPayment.value?.expiresAt) return true
        return new Date() >= new Date(currentPayment.value.expiresAt)
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
            const res = await paymentService.initiate({ subscriptionId })
            currentPayment.value = res.data.data
            paymentSessionStatus.value = 'pending'
            startPolling(res.data.data.md5)
        } catch (err: any) {
            error.value = err?.response?.data?.message ?? 'Failed to generate QR'
        } finally {
            isInitiatingPayment.value = false
        }
    }

    function startPolling(md5: string) {
        stopPolling()
        isPolling.value = true

        pollInterval = setInterval(async () => {
            try {
                const res = await paymentService.getStatus(md5)
                const { resolved, data } = res.data

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
        }, 3000)
    }

    function stopPolling() {
        if (pollInterval) {
            clearInterval(pollInterval)
            pollInterval = null
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
        isLoadingStation,
        isInitiatingPayment,
        isPolling,
        error,
        currentPlan,
        trialDaysLeft,
        nextBillingDate,
        isQrExpired,
        fetchStation,
        fetchHistory,
        initiatePayment,
        cancelPayment,
        resetPayment,
        stopPolling,
    }
})
