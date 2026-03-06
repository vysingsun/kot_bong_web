<template>
    <div class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[88%] max-w-lg">
        <div
            class="relative h-16 rounded-full px-2 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
            <div class="grid h-full grid-cols-5">
                <!-- Home -->
                <RouterLink
                    to="/"
                    class="inline-flex flex-col items-center justify-center rounded-full transition-colors group"
                    :class="
                        isActive('/') && route.path === '/' ? 'text-primary' : 'text-gray-500/80 dark:text-gray-400/80'
                    "
                >
                    <svg
                        class="w-5 h-5 transition-transform group-active:scale-90"
                        :class="isActive('/') && route.path === '/' ? 'text-primary' : 'group-hover:text-primary'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
                        />
                    </svg>
                    <span v-if="isActive('/') && route.path === '/'" class="mt-0.5 w-1 h-1 rounded-full bg-primary" />
                </RouterLink>

                <!-- Wallet -->
                <button
                    type="button"
                    class="inline-flex flex-col items-center justify-center rounded-full transition-colors group text-gray-500/80 dark:text-gray-400/80"
                >
                    <svg
                        class="w-5 h-5 transition-transform group-active:scale-90 group-hover:text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z"
                        />
                        <path
                            d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z"
                        />
                    </svg>
                </button>

                <!-- FAB center -->
                <div class="flex items-center justify-center">
                    <RouterLink
                        to="/fuel-sold/create"
                        class="inline-flex items-center justify-center w-11 h-11 bg-primary rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-95 transition-transform"
                    >
                        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 18 18">
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 1v16M1 9h16"
                            />
                        </svg>
                    </RouterLink>
                </div>

                <!-- Settings -->
                <RouterLink
                    to="/onboarding"
                    class="inline-flex flex-col items-center justify-center rounded-full transition-colors group"
                    :class="isActive('/onboarding') ? 'text-primary' : 'text-gray-500/80 dark:text-gray-400/80'"
                >
                    <svg
                        class="w-5 h-5 transition-transform group-active:scale-90"
                        :class="isActive('/onboarding') ? 'text-primary' : 'group-hover:text-primary'"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
                        />
                    </svg>
                    <span v-if="isActive('/onboarding')" class="mt-0.5 w-1 h-1 rounded-full bg-primary" />
                </RouterLink>

                <!-- Profile -->
                <RouterLink
                    to="/profile"
                    class="inline-flex flex-col items-center justify-center rounded-full transition-colors group"
                    :class="isActive('/profile') ? 'text-primary' : 'text-gray-500/80 dark:text-gray-400/80'"
                >
                    <svg
                        class="w-5 h-5 transition-transform group-active:scale-90"
                        :class="isActive('/profile') ? 'text-primary' : 'group-hover:text-primary'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"
                        />
                    </svg>
                    <span v-if="isActive('/profile')" class="mt-0.5 w-1 h-1 rounded-full bg-primary" />
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router'
    import { useI18n } from 'vue-i18n'

    const route = useRoute()
    const { t } = useI18n()

    const isActive = (path: string) => {
        return route.path === path || route.path.startsWith(path + '/')
    }
</script>
