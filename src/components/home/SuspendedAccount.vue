<template>
    <section class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div class="w-full max-w-sm">
            <!-- Card -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <!-- Top red banner -->
                <div class="bg-[#f00317] px-6 py-8 flex flex-col items-center text-center">
                    <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m0-10v4m-6.364 7.364A9 9 0 1118.364 5.636 9 9 0 015.636 18.364z"
                            />
                        </svg>
                    </div>
                    <h1 class="text-xl font-bold text-white">
                        {{ t('suspended.title') }}
                    </h1>
                    <p class="text-red-100 text-sm mt-1">
                        {{ t('suspended.subtitle') }}
                    </p>
                </div>

                <!-- Body -->
                <div class="px-6 py-6 space-y-4">
                    <!-- Info box -->
                    <div
                        class="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-4"
                    >
                        <div class="flex items-start gap-3">
                            <svg
                                class="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
                                />
                            </svg>
                            <p class="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
                                {{ t('suspended.reason') }}
                            </p>
                        </div>
                    </div>

                    <!-- What to do -->
                    <div>
                        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            {{ t('suspended.what_to_do') }}
                        </p>
                        <div class="space-y-3">
                            <!-- Step 1 -->
                            <div class="flex items-start gap-3">
                                <div
                                    class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5"
                                >
                                    <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">1</span>
                                </div>
                                <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {{ t('suspended.step1') }}
                                </p>
                            </div>

                            <!-- Step 2 -->
                            <div class="flex items-start gap-3">
                                <div
                                    class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5"
                                >
                                    <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">2</span>
                                </div>
                                <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {{ t('suspended.step2') }}
                                </p>
                            </div>

                            <!-- Step 3 -->
                            <div class="flex items-start gap-3">
                                <div
                                    class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5"
                                >
                                    <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">3</span>
                                </div>
                                <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    {{ t('suspended.step3') }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-gray-100 dark:border-gray-700"></div>

                    <!-- Contact owner card -->
                    <div
                        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-400 dark:border-blue-800 rounded-xl p-4"
                    >
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <span class="text-blue-700 dark:text-blue-300 text-sm font-semibold">
                                {{ t('suspended.contact_owner_label') }}
                            </span>
                        </div>
                        <p class="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                            {{ t('suspended.contact_owner_desc') }}
                        </p>
                    </div>
                    <!-- Back to login button -->
                    <button
                        class="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl text-sm px-5 py-3 transition-colors"
                        @click="onLogout"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        {{ t('suspended.back_to_login') }}
                    </button>
                </div>
            </div>

            <!-- Footer note -->
            <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                {{ t('suspended.footer_note') }}
            </p>
        </div>
    </section>
</template>

<script setup>
    import { useI18n } from 'vue-i18n'
    import { useAuthStore } from '@/modules/auth/store/index'

    const { t } = useI18n()
    const authStore = useAuthStore()
    const onLogout = async () => {
        await authStore.logout()
    }
</script>
