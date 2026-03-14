<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { storeToRefs } from 'pinia'
    import { usePaymentStore } from '../store/index'
    import { getFromCache } from '@/composables/useCache'
    import QrcodeVue from 'qrcode.vue'
    import bakongLogo from '@/assets/images/bakong-logo.png'
    import BottomNavigation from '@/components/home/BottomNavigation.vue'

    const { t } = useI18n()
    const router = useRouter()
    const store = usePaymentStore()
    const { station, subscription, currentPayment, paymentSessionStatus, isInitiatingPayment } = storeToRefs(store)

    // ── Countdown ──────────────────────────────────────────────
    const countdown = ref(600)
    let countdownTimer: ReturnType<typeof setInterval> | null = null

    const timerLabel = computed(() => {
        const m = Math.floor(countdown.value / 60)
        const s = countdown.value % 60
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    })

    const RING_R = 22
    const RING_CIRC = 2 * Math.PI * RING_R
    const ringOffset = computed(() => RING_CIRC * (1 - countdown.value / 600))
    const timerColor = computed(() =>
        countdown.value > 300 ? '#16a34a' : countdown.value > 60 ? '#d97706' : '#dc2626',
    )

    function startCountdown() {
        stopCountdown()
        countdown.value = 600
        countdownTimer = setInterval(() => {
            countdown.value = Math.max(0, countdown.value - 1)
            if (countdown.value === 0) stopCountdown()
        }, 1000)
    }
    function stopCountdown() {
        if (countdownTimer) {
            clearInterval(countdownTimer)
            countdownTimer = null
        }
    }

    const showSuccessAnim = ref(false)

    async function generate() {
        if (!subscription.value?._id) return
        store.resetPayment()
        stopCountdown()
        await store.initiatePayment(subscription.value._id)
        if (currentPayment.value) startCountdown()
    }

    async function handleCancel() {
        await store.cancelPayment()
        stopCountdown()
        router.push('/subscription')
    }

    async function handleRetry() {
        showSuccessAnim.value = false
        await generate()
    }

    watch(paymentSessionStatus, val => {
        if (val === 'success') {
            stopCountdown()
            showSuccessAnim.value = true
        }
        if (val === 'failed' || val === 'expired') stopCountdown()
    })

    onMounted(async () => {
        const appData = getFromCache('app_data')
        const stationId = appData.value?.stations?.[0]?._id
        if (stationId && !subscription.value) await store.fetchStation(stationId)
        await generate()
    })

    onUnmounted(() => {
        store.stopPolling()
        stopCountdown()
    })
</script>

<template>
    <div
        class="min-h-screen bg-slate-100 flex items-start justify-center px-4 py-8"
        style="font-family: 'Hanuman', 'DM Sans', sans-serif"
    >
        <component :is="'style'">
            @import
            url('https://fonts.googleapis.com/css2?family=Hanuman:wght@300;400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
            @keyframes draw-check { to { stroke-dashoffset: 0; } } @keyframes pop-circle {
            0%{transform:scale(0);opacity:0} 60%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} } @keyframes
            fade-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} } @keyframes
            ripple-out { from{transform:scale(1);opacity:.5} to{transform:scale(2.4);opacity:0} } .anim-circle {
            animation: pop-circle 0.45s cubic-bezier(.34,1.56,.64,1) both; } .anim-check {
            stroke-dasharray:60;stroke-dashoffset:60;animation:draw-check .4s .35s ease-out forwards; } .anim-text {
            opacity:0;animation:fade-up .4s .6s ease-out forwards; } .anim-ripple { animation:ripple-out 1.4s .2s
            ease-out infinite; }
        </component>

        <!-- ══════════════════════════════════════════ -->
        <!--  SUCCESS SCREEN                           -->
        <!-- ══════════════════════════════════════════ -->
        <div v-if="showSuccessAnim" class="w-full max-w-sm flex flex-col items-center gap-0 anim-card">
            <!-- Floating icon — sits above the card, overlapping top edge -->
            <div class="relative z-10 mb-[-36px]">
                <!-- Glow rings -->
                <div
                    class="absolute inset-0 rounded-full animate-glow-ring"
                    style="background: rgba(58, 162, 70, 0.25)"
                ></div>
                <div
                    class="absolute inset-0 rounded-full animate-glow-ring"
                    style="animation-delay: 0.6s; background: rgba(58, 162, 70, 0.15)"
                ></div>
                <!-- Icon circle -->
                <div
                    class="w-20 h-20 rounded-full flex items-center justify-center animate-icon-pop relative"
                    style="
                        background: linear-gradient(145deg, #3aa246, #277a30);
                        box-shadow:
                            0 8px 32px rgba(58, 162, 70, 0.45),
                            0 2px 8px rgba(0, 0, 0, 0.12);
                    "
                >
                    <svg class="w-10 h-10 animate-check" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.8" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            <!-- Receipt card -->
            <div
                class="w-full bg-white rounded-3xl shadow-xl overflow-hidden"
                style="box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1)"
            >
                <!-- Top section -->
                <div class="pt-14 pb-6 px-6 text-center border-b border-slate-100">
                    <p class="text-sm font-semibold mb-1" style="color: #3aa246">
                        {{ t('payment.successLabel') ?? 'Great!' }}
                    </p>
                    <h2 class="text-2xl font-black text-slate-900">
                        {{ t('payment.success.title') }}
                    </h2>
                </div>

                <!-- Receipt rows -->
                <div class="px-6 py-5 space-y-3.5">
                    <div class="flex items-center justify-between anim-row-1">
                        <span class="text-sm text-slate-400">{{ t('payment.to') }}</span>
                        <span class="text-sm font-semibold text-slate-800">Kot Preng</span>
                    </div>
                    <div class="flex items-center justify-between anim-row-2">
                        <span class="text-sm text-slate-400">{{ t('payment.amount') }}</span>
                        <span class="text-sm font-semibold text-slate-800">
                            ${{ subscription?.pricePerMonth?.toFixed(2) ?? '10.00' }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between anim-row-3">
                        <span class="text-sm text-slate-400">{{ t('payment.payDate') ?? 'Pay Date' }}</span>
                        <span class="text-sm font-bold text-slate-800">
                            {{
                                new Date().toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })
                            }}
                        </span>
                    </div>
                </div>

                <!-- Dashed separator with notch circles -->
                <div class="mx-0 relative">
                    <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100"></div>
                    <div class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100"></div>
                    <div class="mx-6 border-t-2 border-dashed border-slate-200"></div>
                </div>

                <!-- Total -->
                <div class="px-6 py-5 text-center anim-total">
                    <p class="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
                        {{ t('payment.totalPay') ?? 'Total Pay' }}
                    </p>
                    <p class="text-4xl font-black" style="color: #3aa246">
                        ${{ subscription?.pricePerMonth?.toFixed(2) ?? '10.00' }}
                    </p>
                </div>

                <!-- CTA button -->
                <div class="px-5 pb-6 anim-btn">
                    <button
                        @click="router.push('/subscription')"
                        class="w-full py-4 font-bold rounded-2xl text-base text-white active:scale-95 transition-transform"
                        style="
                            background: linear-gradient(135deg, #3aa246 0%, #277a30 100%);
                            box-shadow: 0 4px 18px rgba(58, 162, 70, 0.35);
                        "
                    >
                        {{ t('payment.closeBtn') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════════ -->
        <!--  KHQR PAYMENT CARD                        -->
        <!-- ══════════════════════════════════════════ -->
        <div v-else class="w-full max-w-sm space-y-4">
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
                <!-- Red header: KHQR logo CENTERED, corner chip bottom-left pointing down -->
                <div class="bg-[#E1232E] px-5 py-3 relative flex items-center justify-center">
                    <!-- Bottom-left corner chip (clip points downward into card body) -->
                    <!-- <div
                        class="absolute bottom-0 left-0 w-12 h-12 bg-white"
                        style="clip-path: polygon(0 0, 0 100%, 100% 100%)"
                    ></div> -->

                    <!-- KHQR logo centered -->
                    <svg
                        viewBox="0 0 312 129"
                        class="h-10 w-auto relative z-10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M287.106 63.6618H277.284C277.284 51.4356 267.714 41.4444 256.004 41.4444C246.686 41.4444 238.501 47.7546 235.731 56.9571C235.102 59.192 234.724 61.4269 234.724 63.6618V96.2648H234.472C229.183 96.2648 224.902 91.7951 224.902 86.2736V63.6618H225.028C225.028 54.7222 228.554 46.1771 234.85 39.9983C240.642 34.3453 248.197 31.1902 256.13 31.1902C273.255 31.1902 287.106 45.7827 287.106 63.6618Z"
                            fill="white"
                        />
                        <path
                            d="M288.063 97.0867L274.153 97.2218L270.739 93.574L263.151 85.4678L252.655 74.2543H266.565L288.063 97.0867Z"
                            fill="white"
                        />
                        <path
                            d="M195.236 55.8845V76.1683H175.764C173.767 76.1683 172.269 74.478 172.269 72.5276V55.8845C172.269 53.8041 173.892 52.2438 175.764 52.2438H191.616C193.738 52.2438 195.236 53.8041 195.236 55.8845Z"
                            fill="white"
                        />
                        <path
                            d="M198.745 86.1421H168.76C165.059 86.1421 162.125 83.1184 162.125 79.306V48.2805C162.125 44.468 165.059 41.4444 168.76 41.4444H198.745C202.445 41.4444 205.38 44.468 205.38 48.2805V79.1745L215.333 89.4287V41.1814C215.333 35.66 210.994 31.1902 205.635 31.1902H161.87C156.51 31.1902 152.172 35.66 152.172 41.1814V86.2736C152.172 91.7951 156.51 96.2648 161.87 96.2648H208.698L198.745 86.1421Z"
                            fill="white"
                        />
                        <path
                            d="M78.4845 97.2218H64.5628L35.4537 66.4692V97.2218H23.9367V31.1902H35.4537V60.6115L63.2972 31.1902H77.0924L46.7177 62.8747L78.4845 97.2218Z"
                            fill="white"
                        />
                        <path
                            d="M130.408 31.1902H141.645V97.2218H130.408V68.4661H98.3354V97.0887H87.0975V31.1902H98.3354V58.7477H130.408V31.1902Z"
                            fill="white"
                        />
                    </svg>
                </div>

                <!-- Merchant info — left aligned, kot preng + amount only -->
                <div class="px-6 pt-5 pb-3 relative">
                    <div
                        class="absolute top-[-1px] right-[-1px] w-8 h-8 bg-[#E1232E]"
                        style="clip-path: polygon(100% 0, 0 0, 100% 100%)"
                    ></div>
                    <!-- <p class="text-[11px] text-slate-400 uppercase tracking-widest font-medium mb-0.5">
                        {{ t('payment.kotPreng') }}
                    </p> -->
                    <p class="text-xl font-bold text-slate-900 leading-tight mb-2">Kot Preng</p>

                    <!-- <p class="text-[11px] text-slate-400 uppercase tracking-widest font-medium mt-4 mb-0.5">
                        {{ t('payment.amount') }}
                    </p> -->
                    <p class="text-2xl font-black text-slate-900 tracking-tight leading-none">
                        $&thinsp;{{ subscription?.pricePerMonth?.toFixed(2) ?? '10.00' }}
                    </p>
                </div>

                <!-- Dashed ticket separator with notch circles -->
                <div class="mx-6 my-3 border-t-2 border-dashed border-slate-200 relative">
                    <div class="absolute -left-9 -top-3 w-6 h-6 rounded-full bg-slate-100"></div>
                    <div class="absolute -right-9 -top-3 w-6 h-6 rounded-full bg-slate-100"></div>
                </div>

                <!-- QR area -->
                <div class="px-6 pb-6 pt-2 flex flex-col items-center">
                    <!-- Generating -->
                    <div v-if="isInitiatingPayment" class="w-56 h-56 flex flex-col items-center justify-center gap-3">
                        <div
                            class="w-10 h-10 border-4 border-[#E1232E] border-t-transparent rounded-full animate-spin"
                        ></div>
                        <p class="text-xs text-slate-400">{{ t('payment.generating') }}</p>
                    </div>

                    <!-- QR code with Bakong logo -->
                    <template v-else-if="currentPayment && paymentSessionStatus === 'pending'">
                        <div class="relative p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <QrcodeVue
                                :value="currentPayment.qr"
                                :size="210"
                                level="M"
                                render-as="svg"
                                foreground="#000000"
                                background="#ffffff"
                            />
                            <!-- Bakong logo — center of QR -->
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div
                                    class="w-10 h-10 rounded-full bg-white border-[3px] border-white shadow-md overflow-hidden"
                                >
                                    <img
                                        :src="bakongLogo"
                                        alt="Bakong"
                                        class="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Countdown row -->
                        <div class="mt-4 flex items-center justify-center gap-3 w-full">
                            <svg class="w-9 h-9 -rotate-90 flex-shrink-0" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="22" fill="none" stroke="#f1f5f9" stroke-width="4" />
                                <circle
                                    cx="28"
                                    cy="28"
                                    r="22"
                                    fill="none"
                                    :stroke="timerColor"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    :stroke-dasharray="RING_CIRC"
                                    :stroke-dashoffset="ringOffset"
                                    class="transition-all duration-1000"
                                />
                            </svg>
                            <div>
                                <p class="text-sm font-bold font-mono leading-none" :style="{ color: timerColor }">
                                    {{ timerLabel }}
                                </p>
                                <p class="text-xs text-slate-400 mt-0.5">{{ t('payment.expiresIn') }}</p>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="relative flex h-2 w-2">
                                    <span
                                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E1232E] opacity-60"
                                    ></span>
                                    <span class="relative inline-flex h-2 w-2 rounded-full bg-[#E1232E]"></span>
                                </span>
                                <span class="text-xs text-slate-500">{{ t('payment.waitingPayment') }}</span>
                            </div>
                        </div>
                    </template>

                    <!-- Failed -->
                    <div
                        v-else-if="paymentSessionStatus === 'failed'"
                        class="py-8 flex flex-col items-center gap-3 text-center"
                    >
                        <div class="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-rose-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2.5"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div>
                            <p class="font-bold text-slate-900">{{ t('payment.failed.title') }}</p>
                            <p class="text-sm text-slate-500 mt-1">{{ t('payment.failed.desc') }}</p>
                        </div>
                    </div>

                    <!-- Expired -->
                    <div
                        v-else-if="paymentSessionStatus === 'expired'"
                        class="py-8 flex flex-col items-center gap-3 text-center"
                    >
                        <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="1.5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p class="font-bold text-slate-900">{{ t('payment.expired.title') }}</p>
                            <p class="text-sm text-slate-500 mt-1">{{ t('payment.expired.desc') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- KHQR Digital Payment badge -->
            <div class="flex justify-center">
                <div class="bg-white rounded-2xl px-4 py-2 shadow-sm border border-slate-100 flex items-center gap-2.5">
                    <svg viewBox="0 0 312 129" class="h-5 w-auto" fill="none">
                        <rect width="312" height="128.412" rx="10" fill="#E1232E" />
                        <path
                            d="M287.106 63.6618H277.284C277.284 51.4356 267.714 41.4444 256.004 41.4444C246.686 41.4444 238.501 47.7546 235.731 56.9571C235.102 59.192 234.724 61.4269 234.724 63.6618V96.2648H234.472C229.183 96.2648 224.902 91.7951 224.902 86.2736V63.6618H225.028C225.028 54.7222 228.554 46.1771 234.85 39.9983C240.642 34.3453 248.197 31.1902 256.13 31.1902C273.255 31.1902 287.106 45.7827 287.106 63.6618Z"
                            fill="white"
                        />
                        <path
                            d="M288.063 97.0867L274.153 97.2218L270.739 93.574L263.151 85.4678L252.655 74.2543H266.565L288.063 97.0867Z"
                            fill="white"
                        />
                        <path
                            d="M195.236 55.8845V76.1683H175.764C173.767 76.1683 172.269 74.478 172.269 72.5276V55.8845C172.269 53.8041 173.892 52.2438 175.764 52.2438H191.616C193.738 52.2438 195.236 53.8041 195.236 55.8845Z"
                            fill="white"
                        />
                        <path
                            d="M198.745 86.1421H168.76C165.059 86.1421 162.125 83.1184 162.125 79.306V48.2805C162.125 44.468 165.059 41.4444 168.76 41.4444H198.745C202.445 41.4444 205.38 44.468 205.38 48.2805V79.1745L215.333 89.4287V41.1814C215.333 35.66 210.994 31.1902 205.635 31.1902H161.87C156.51 31.1902 152.172 35.66 152.172 41.1814V86.2736C152.172 91.7951 156.51 96.2648 161.87 96.2648H208.698L198.745 86.1421Z"
                            fill="white"
                        />
                        <path
                            d="M78.4845 97.2218H64.5628L35.4537 66.4692V97.2218H23.9367V31.1902H35.4537V60.6115L63.2972 31.1902H77.0924L46.7177 62.8747L78.4845 97.2218Z"
                            fill="white"
                        />
                        <path
                            d="M130.408 31.1902H141.645V97.2218H130.408V68.4661H98.3354V97.0887H87.0975V31.1902H98.3354V58.7477H130.408V31.1902Z"
                            fill="white"
                        />
                    </svg>
                    <span class="text-xs text-slate-400 font-medium">Digital Payment</span>
                </div>
            </div>

            <!-- Scan hint -->
            <p
                v-if="paymentSessionStatus === 'pending'"
                class="text-center text-xs text-slate-400 px-6 leading-relaxed"
            >
                {{ t('payment.scanHint') }}
            </p>

            <!-- Buttons -->
            <div class="space-y-2">
                <button
                    v-if="paymentSessionStatus === 'failed' || paymentSessionStatus === 'expired'"
                    @click="handleRetry"
                    class="w-full py-3.5 bg-[#E1232E] hover:bg-red-700 active:scale-95 text-white font-bold rounded-2xl transition-all text-sm"
                >
                    {{ t('payment.retryBtn') }}
                </button>
                <button
                    @click="handleCancel"
                    class="w-full py-3 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors"
                >
                    {{ paymentSessionStatus === 'pending' ? t('payment.cancelBtn') : t('payment.closeBtn') }}
                </button>
            </div>
        </div>
    </div>
    <BottomNavigation />
</template>
