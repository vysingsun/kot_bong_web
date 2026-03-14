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
    const { subscription, paymentHistory, isLoadingStation, trialDaysLeft } = storeToRefs(store)

    const showHistory = ref(false)

    function formatDate(d: string | null) {
        if (!d) return '—'
        return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
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
                <div v-for="i in 3" :key="i" class="h-56 rounded-2xl bg-slate-200 animate-pulse" />
            </template>

            <template v-else-if="subscription">
                <!-- Status banner -->
                <div class="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
                    <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        :class="
                            subscription.plan === 'pro'
                                ? 'bg-emerald-100'
                                : subscription.plan === 'trial'
                                  ? 'bg-sky-100'
                                  : 'bg-slate-100'
                        "
                    >
                        <svg
                            v-if="subscription.plan === 'pro'"
                            class="w-5 h-5 text-emerald-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <svg
                            v-else-if="subscription.plan === 'trial'"
                            class="w-5 h-5 text-sky-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <svg
                            v-else
                            class="w-5 h-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                            />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs text-slate-400">{{ t('subscription.currentPlan') }}</p>
                        <p class="text-sm font-bold text-slate-900">
                            {{
                                subscription.plan === 'pro'
                                    ? t('plans.pro.name')
                                    : subscription.plan === 'trial'
                                      ? t('plans.trial.name')
                                      : t('plans.free.name')
                            }}
                        </p>
                        <p v-if="subscription.plan === 'trial'" class="text-xs text-sky-600 font-medium">
                            {{ trialDaysLeft }} {{ t('subscription.trialDaysLeft') }}
                        </p>
                        <p
                            v-if="subscription.plan === 'pro' && subscription.proNextBillingDate"
                            class="text-xs text-slate-500"
                        >
                            {{ t('subscription.nextBilling') }}: {{ formatDate(subscription.proNextBillingDate) }}
                        </p>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="text-xs text-emerald-600 font-semibold">{{ t('subscription.active') }}</span>
                    </div>
                </div>

                <!-- Trial card -->
                <div
                    :class="[
                        'bg-white rounded-2xl border-2 shadow-sm overflow-hidden',
                        subscription.plan === 'trial' ? 'border-sky-400' : 'border-slate-200',
                    ]"
                >
                    <div class="p-5">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <span
                                    class="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 mb-2"
                                >
                                    {{ t('subscription.trialBadge') }}
                                </span>
                                <h3 class="font-bold text-slate-900 text-base">{{ t('plans.trial.name') }}</h3>
                            </div>
                            <div class="text-right ml-3 flex-shrink-0">
                                <p class="text-xl font-black text-slate-900">{{ t('plans.trial.price') }}</p>
                                <p class="text-xs text-slate-400">{{ t('plans.trial.period') }}</p>
                            </div>
                        </div>
                        <p class="text-sm text-slate-500 mb-3 leading-relaxed">{{ t('plans.trial.desc') }}</p>
                        <ul class="space-y-1.5 mb-4">
                            <li
                                v-for="(f, i) in $tm('plans.trial.features')"
                                :key="i"
                                class="flex items-center gap-2 text-sm text-slate-700"
                            >
                                <svg
                                    class="w-4 h-4 text-sky-500 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {{ $rt(f) }}
                            </li>
                        </ul>
                        <div
                            v-if="subscription.plan === 'trial'"
                            class="py-2.5 text-center rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-sm font-semibold"
                        >
                            ✓ {{ t('plans.trial.cta') }}
                        </div>
                    </div>
                </div>

                <!-- Pro card -->
                <div
                    :class="[
                        'bg-white rounded-2xl border-2 shadow-sm overflow-hidden',
                        subscription.plan === 'pro' ? 'border-green-500' : 'border-slate-200',
                    ]"
                >
                    <div class="p-5">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <span
                                    class="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 mb-2"
                                >
                                    ⭐ {{ t('subscription.popularBadge') }}
                                </span>
                                <h3 class="font-bold text-slate-900 text-base">{{ t('plans.pro.name') }}</h3>
                            </div>
                            <div class="text-right ml-3 flex-shrink-0">
                                <p class="text-xl font-black text-slate-900">{{ t('plans.pro.price') }}</p>
                                <p class="text-xs text-slate-400">{{ t('plans.pro.period') }}</p>
                            </div>
                        </div>
                        <p class="text-sm text-slate-500 mb-3 leading-relaxed">{{ t('plans.pro.desc') }}</p>
                        <ul class="space-y-1.5 mb-5">
                            <li
                                v-for="(f, i) in $tm('plans.pro.features')"
                                :key="i"
                                class="flex items-center gap-2 text-sm text-slate-700"
                            >
                                <svg
                                    class="w-4 h-4 text-emerald-500 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                {{ $rt(f) }}
                            </li>
                        </ul>
                        <div v-if="subscription.plan === 'pro'" class="flex items-center justify-between">
                            <span class="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                                <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {{ t('subscription.active') }}
                            </span>
                            <button
                                @click="router.push({ name: 'payment' })"
                                class="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
                            >
                                {{ t('plans.pro.ctaRenew') }}
                            </button>
                        </div>
                        <button
                            v-else
                            @click="router.push({ name: 'payment' })"
                            class="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                                />
                            </svg>
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
                                <span
                                    class="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 mb-2"
                                >
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
                            <li
                                v-for="(f, i) in $tm('plans.free.features')"
                                :key="i"
                                class="flex items-center gap-2 text-sm text-slate-400"
                            >
                                <svg
                                    class="w-4 h-4 text-slate-300 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {{ $rt(f) }}
                            </li>
                        </ul>
                        <button
                            v-if="subscription.plan === 'free'"
                            @click="router.push({ name: 'payment' })"
                            class="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
                        >
                            {{ t('plans.free.cta') }}
                        </button>
                        <p v-else class="text-center text-xs text-slate-400">
                            {{ t('subscription.appliesAfterTrial') }}
                        </p>
                    </div>
                </div>

                <!-- History toggle -->
                <button
                    @click="showHistory = !showHistory"
                    class="w-full flex items-center justify-between px-4 py-3.5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                    <span class="text-sm font-semibold text-slate-700">{{ t('subscription.viewHistory') }}</span>
                    <svg
                        :class="[
                            'w-4 h-4 text-slate-400 transition-transform duration-200',
                            showHistory ? 'rotate-180' : '',
                        ]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
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
                                :class="[
                                    'flex items-center gap-3 px-4 py-3.5',
                                    i < paymentHistory.length - 1 ? 'border-b border-slate-100' : '',
                                ]"
                            >
                                <div
                                    :class="[
                                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0',
                                        item.status === 'success'
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : item.status === 'failed'
                                              ? 'bg-rose-100 text-rose-600'
                                              : 'bg-slate-100 text-slate-400',
                                    ]"
                                >
                                    {{ item.status === 'success' ? '✓' : item.status === 'failed' ? '✕' : '○' }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-slate-800">Pro Plan</p>
                                    <p class="text-xs text-slate-400">{{ formatDate(item.paidAt) }}</p>
                                </div>
                                <div class="text-right flex-shrink-0">
                                    <p class="text-sm font-bold text-slate-900">${{ item.amount.toFixed(2) }}</p>
                                    <span
                                        :class="[
                                            'text-xs',
                                            item.status === 'success' ? 'text-emerald-600' : 'text-rose-500',
                                        ]"
                                    >
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
