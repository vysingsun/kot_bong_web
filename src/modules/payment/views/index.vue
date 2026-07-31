<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { storeToRefs } from 'pinia'
    import { usePaymentStore } from '../store/index'
    import { getFromCache } from '@/composables/useCache'

    const { t } = useI18n()
    const router = useRouter()
    const store = usePaymentStore()
    const { subscription, paymentHistory, isLoadingStation } = storeToRefs(store)

    const showHistory = ref(false)

    function formatDate(d: string | null) {
        if (!d) return '—'
        return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    function getPlanName(plan: string) {
        if (plan === 'pro_max') return t('plans.pro_max.name')
        if (plan === 'pro') return t('plans.pro.name')
        return t('plans.free.name')
    }

    function navigateToPayment(plan: 'pro' | 'pro_max') {
        store.targetPlan = plan
        router.push({ name: 'payment' })
    }

    onMounted(async () => {
        const appData = getFromCache('app_data')
        const stationId = appData.value?.stations?.[0]?._id
        if (stationId) {
            await store.fetchStation(stationId)
            await store.fetchHistory()
        }
    })
</script>

<template>
    <div class="min-h-screen bg-slate-50" style="font-family: 'Hanuman', 'DM Sans', sans-serif">
        <component :is="'style'">
            @import
            url('https://fonts.googleapis.com/css2?family=Hanuman:wght@300;400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
            .slide-down-enter-active { transition: all .25s ease-out; } .slide-down-leave-active { transition: all .2s
            ease-in; } .slide-down-enter-from,.slide-down-leave-to { opacity:0; transform:translateY(-6px); }
        </component>

        <!-- Header -->
        <div class="sticky top-0 z-10 bg-white border-b border-slate-100 shadow-sm px-4 py-3.5">
            <h1 class="text-base font-bold text-slate-900">{{ t('subscription.title') }}</h1>
            <p class="text-xs text-slate-400 mt-0.5">{{ t('subscription.subtitle') }}</p>
        </div>

        <div class="max-w-md mx-auto px-4 py-5 space-y-3">
            <!-- Skeleton -->
            <template v-if="isLoadingStation">
                <div v-for="i in 4" :key="i" class="h-56 rounded-2xl bg-slate-200 animate-pulse" />
            </template>

            <template v-else-if="subscription">
                <!-- Status banner -->
                <div class="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
                    <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        :class="
                            subscription.plan === 'pro_max'
                                ? 'bg-blue-100'
                                : subscription.plan === 'pro'
                                  ? 'bg-lime-100'
                                  : 'bg-slate-100'
                        "
                    >
                        <!-- Pro Max icon -->
                        <svg v-if="subscription.plan === 'pro_max'" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        <!-- Pro icon -->
                        <svg v-else-if="subscription.plan === 'pro'" class="w-5 h-5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <!-- Free icon -->
                        <svg v-else class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs text-slate-400">{{ t('subscription.currentPlan') }}</p>
                        <p class="text-sm font-bold text-slate-900">{{ getPlanName(subscription.plan) }}</p>
                        <p v-if="(subscription.plan === 'pro' || subscription.plan === 'pro_max') && subscription.proNextBillingDate" class="text-xs text-slate-500">
                            {{ t('subscription.nextBilling') }}: {{ formatDate(subscription.proNextBillingDate) }}
                        </p>
                        <!-- Staff slot indicator for Pro -->
                        <!-- <p v-if="subscription.plan === 'pro' && subscription.maxStaff" class="text-xs text-slate-400 mt-0.5">
                            {{ t('subscription.staff_slots', { current: '?', max: subscription.maxStaff }) }}
                        </p> -->
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="text-xs text-emerald-600 font-semibold">{{ t('subscription.active') }}</span>
                    </div>
                </div>

                <!-- Pro Max card -->
                <div
                    :class="[
                        'rounded-2xl border-2 shadow-sm overflow-hidden',
                        subscription.plan === 'pro_max' ? 'border-blue-500 bg-white' : 'bg-white border-slate-200',
                    ]"
                >
                    <div class="p-5">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="font-bold text-slate-900 text-base">{{ t('plans.pro_max.name') }}</h3>
                            </div>
                            <div class="text-right ml-3 flex-shrink-0">
                                <p class="text-xl font-black text-slate-900">{{ t('plans.pro_max.price') }}</p>
                                <p class="text-xs text-slate-400">{{ t('plans.pro_max.period') }}</p>
                            </div>
                        </div>
                        <p class="text-sm text-slate-500 mb-3 leading-relaxed">{{ t('plans.pro_max.desc') }}</p>
                        <ul class="space-y-1.5 mb-5">
                            <li v-for="(f, i) in $tm('plans.pro_max.features')" :key="i" class="flex items-center gap-2 text-sm text-slate-700">
                                <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {{ $rt(f) }}
                            </li>
                        </ul>
                        <!-- Active Pro Max -->
                        <div v-if="subscription.plan === 'pro_max'" class="flex items-center justify-between">
                            <span class="text-sm font-semibold text-blue-600 flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ t('subscription.active') }}
                            </span>
                            <button @click="navigateToPayment('pro_max')" class="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors">
                                {{ t('plans.pro_max.ctaRenew') }}
                            </button>
                        </div>
                        <!-- Upgrade from Pro -->
                        <div v-else-if="subscription.plan === 'pro'" class="space-y-2">
                            <button @click="navigateToPayment('pro_max')" class="w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 text-white active:scale-95 bg-blue-600 hover:bg-blue-700">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                                {{ t('plans.pro_max.cta') }}
                            </button>
                            <p class="text-center text-xs text-slate-400">Remaining Pro days credited toward Pro Max</p>
                        </div>
                        <!-- Subscribe -->
                        <button v-else @click="navigateToPayment('pro_max')" class="w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 text-white active:scale-95 bg-blue-600 hover:bg-blue-700">
                            {{ t('plans.pro_max.cta') }}
                        </button>
                    </div>
                </div>

                <!-- Pro card -->
                <div
                    :class="[
                        'bg-white rounded-2xl border-2 shadow-sm overflow-hidden',
                        subscription.plan === 'pro' ? 'border-lime-400' : 'border-slate-200',
                    ]"
                >
                    <div class="p-5">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="font-bold text-slate-900 text-base">{{ t('plans.pro.name') }}</h3>
                            </div>
                            <div class="text-right ml-3 flex-shrink-0">
                                <p class="text-xl font-black text-slate-900">{{ t('plans.pro.price') }}</p>
                                <p class="text-xs text-slate-400">{{ t('plans.pro.period') }}</p>
                            </div>
                        </div>
                        <p class="text-sm text-slate-500 mb-3 leading-relaxed">{{ t('plans.pro.desc') }}</p>
                        <ul class="space-y-1.5 mb-5">
                            <li v-for="(f, i) in $tm('plans.pro.features')" :key="i" class="flex items-center gap-2 text-sm text-slate-700">
                                <svg class="w-4 h-4 text-lime-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {{ $rt(f) }}
                            </li>
                        </ul>
                        <!-- Active Pro -->
                        <div v-if="subscription.plan === 'pro'" class="flex items-center justify-between">
                            <span class="text-sm font-semibold text-lime-600 flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ t('subscription.active') }}
                            </span>
                            <button
                                class="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
                                @click="router.push({ name: 'payment' })"
                            >
                                {{ t('plans.pro.ctaRenew') }}
                            </button>
                        </div>
                        <button
                            v-else
                            class="w-full py-3 rounded-xl bg-lime-400 hover:bg-lime-300 active:scale-95 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                            @click="router.push({ name: 'payment' })"
                        >
                            {{ t('plans.pro.cta') }}
                        </button>
                    </div>
                </div>

                <!-- Free card -->
                <div
                    :class="[
                        'bg-white rounded-2xl border-2 shadow-sm overflow-hidden',
                        subscription.plan === 'free' ? 'border-slate-400' : 'border-slate-100 opacity-60',
                    ]"
                >
                    <div class="p-5">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <span class="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 mb-2">
                                    {{ t('subscription.freeBadge') }}
                                </span>
                                <h3 class="font-bold text-slate-600 text-base">{{ t('plans.free.name') }}</h3>
                            </div>
                            <div class="text-right ml-3 flex-shrink-0">
                                <p class="text-xl font-black text-slate-600">{{ t('plans.free.price') }}</p>
                                <p class="text-xs text-slate-400">{{ t('plans.free.period') }}</p>
                            </div>
                        </div>
                        <p class="text-sm text-slate-400 mb-3 leading-relaxed">{{ t('plans.free.desc') }}</p>
                        <ul class="space-y-1.5 mb-4">
                            <li v-for="(f, i) in $tm('plans.free.features')" :key="i" class="flex items-center gap-2 text-sm text-slate-400">
                                <svg class="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {{ $rt(f) }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- History toggle -->
                <button
                    class="w-full flex items-center justify-between px-4 py-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors"
                    @click="showHistory = !showHistory"
                >
                    <span class="text-sm font-semibold text-slate-700">{{ t('subscription.viewHistory') }}</span>
                    <svg :class="['w-4 h-4 text-slate-400 transition-transform duration-200', showHistory ? 'rotate-180' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

                <Transition name="slide-down">
                    <div v-if="showHistory" class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <p v-if="!paymentHistory.length" class="p-8 text-center text-sm text-slate-400">
                            {{ t('subscription.noHistory') }}
                        </p>
                        <div v-else>
                            <div
                                v-for="(item, i) in paymentHistory"
                                :key="item._id"
                                :class="['flex items-center gap-3 px-4 py-3.5', i < paymentHistory.length - 1 ? 'border-b border-slate-100' : '']"
                            >
                                <div
                                    :class="[
                                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0',
                                        item.status === 'success' ? 'bg-emerald-100 text-emerald-600' : item.status === 'failed' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400',
                                    ]"
                                >
                                    {{ item.status === 'success' ? '✓' : item.status === 'failed' ? '✕' : '○' }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-slate-800">
                                        {{ item.subscription?.plan === 'pro_max' ? t('plans.pro_max.name') : t('plans.pro.name') }}
                                    </p>
                                    <p class="text-xs text-slate-400">{{ formatDate(item.paidAt) }}</p>
                                </div>
                                <div class="text-right flex-shrink-0">
                                    <p class="text-sm font-bold text-slate-900">${{ item.amount.toFixed(2) }}</p>
                                    <span :class="['text-xs', item.status === 'success' ? 'text-emerald-600' : 'text-rose-500']">
                                        {{ t(`subscription.status.${item.status}`) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </template>
        </div>
    </div>
</template>
