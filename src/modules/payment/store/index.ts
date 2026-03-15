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

    // ── Payment ────────────────────────────────────────────
    async function initiatePayment(subscriptionId: string) {
        isInitiatingPayment.value = true
        error.value = null
        currentPayment.value = null
        paymentSessionStatus.value = 'idle'

        try {
            const res = await paymentService.initiate({ subscriptionId })
            currentPayment.value = res.data.data
            paymentSessionStatus.value = 'pending'

            // The browser polls Bakong directly using the token from the server.
            // This bypasses the CloudFront IP block that hits the server.
            startPolling(res.data.data)
        } catch (err: any) {
            error.value = err?.response?.data?.message ?? 'Failed to generate QR'
        } finally {
            isInitiatingPayment.value = false
        }
    }

    /**
     * Poll via your own server's /api/payments/check-md5 proxy.
     *
     * Why not call Bakong directly from the browser?
     *   - With Authorization header → CORS blocks it (Bakong doesn't allow the header cross-origin)
     *   - Without Authorization header → CloudFront still blocks some IPs
     * Solution: browser calls YOUR server (same origin = no CORS),
     * server forwards to Bakong server-side (no CORS restriction server-to-server).
     */
    function startPolling(payment: PaymentInitiateResponse) {
        stopPolling()
        isPolling.value = true
        const { md5, expiresAt } = payment

        pollInterval = setInterval(async () => {
            // Stop if QR expired
            if (new Date() >= new Date(expiresAt)) {
                stopPolling()
                paymentSessionStatus.value = 'expired'
                return
            }

            try {
                // Call YOUR server proxy — no CORS issue, token stays server-side
                const res = await paymentService.checkMd5(md5)
                const json = res.data

                if (json?.responseCode === 0 && json?.data) {
                    // ── SUCCESS ──────────────────────────────────
                    stopPolling()
                    paymentSessionStatus.value = 'success'

                    try {
                        await paymentService.confirm(md5, json.data)
                        if (station.value?._id) await fetchStation(station.value._id)
                        await fetchHistory()
                    } catch (confirmErr: any) {
                        console.error('[Payment] Confirm error:', confirmErr.message)
                        // Payment was real — don't revert status to failed
                    }
                } else if (json?.responseCode === 1 && json?.responseMessage?.toLowerCase().includes('failed')) {
                    // ── FAILED ───────────────────────────────────
                    stopPolling()
                    paymentSessionStatus.value = 'failed'
                    try {
                        await paymentService.recordFailed(md5)
                    } catch {}
                } else if (res.data?.cloudfront) {
                    // ── SERVER IS CLOUDFRONT BLOCKED ─────────────
                    // Stop polling — nothing will work until NBC whitelists the IP
                    stopPolling()
                    paymentSessionStatus.value = 'failed'
                    console.error('[Payment] Server IP is blocked by Bakong CloudFront')
                }
                // "not found" → keep polling
            } catch (err) {
                // Network error — keep polling until expiry
                console.warn('[Payment] Poll error:', err)
            }
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
