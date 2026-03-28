<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div class="max-w-md w-full text-center">
            <!-- Icon -->
            <div class="flex justify-center mb-6">
                <div class="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg
                        class="w-12 h-12 text-[#f00317] dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>
            </div>

            <!-- Error Code -->
            <p class="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-2">{{ displayNumber }}</p>

            <!-- Title -->
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                {{ $t('unauthorized.title') }}
            </h1>

            <!-- Description -->
            <p class="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                {{ $t('unauthorized.description') }}
            </p>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    @click="goBack"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    {{ $t('unauthorized.goBack') }}
                </button>

                <RouterLink
                    to="/"
                    class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                    {{ $t('unauthorized.goHome') }}
                </RouterLink>
            </div>

            <!-- Role hint -->
            <p class="mt-8 text-xs text-gray-400 dark:text-gray-600">
                {{ $t('unauthorized.roleHint') }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { inject, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { AuthKey } from '@/composables/useAuth'

    const router = useRouter()
    const auth = inject(AuthKey)!
    const { userRole } = auth

    const displayNumber = ref(0)

    onMounted(() => {
        const target = 403
        const duration = 1000
        const step = target / (duration / 16)
        const timer = setInterval(() => {
            displayNumber.value = Math.min(Math.round(displayNumber.value + step), target)
            if (displayNumber.value >= target) clearInterval(timer)
        }, 16)
    })
    function goBack() {
        router.back()
    }
</script>
