<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { useRouter } from 'vue-router'
    import { getFromCache } from '@/composables/useCache'
    import { userService } from '@/modules/app/services/api.service'
    import { useAuthStore } from '@/modules/auth/store/index'

    const { t } = useI18n()
    const router = useRouter()
    const authStore = useAuthStore()

    const isLoading = ref(false)
    const isRestored = ref(false)
    const errorMessage = ref('')

    const appData = getFromCache('app_data')?.value
    const userRole = computed(() => appData?.role?.role_name ?? '')
    const isAdmin = computed(() => userRole.value === 'Admin')
    const deletedAt = computed(() => (appData?.deletedAt ? new Date(appData.deletedAt) : null))

    // Calculate days remaining (30 day window)
    const daysRemaining = computed(() => {
        if (!deletedAt.value) return 30
        const now = new Date()
        const expiry = new Date(deletedAt.value.getTime() + 30 * 24 * 60 * 60 * 1000)
        const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return Math.max(0, diff)
    })

    const deletedDateFormatted = computed(() => {
        if (!deletedAt.value) return ''
        return deletedAt.value.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    })

    const progressPercent = computed(() => {
        return Math.round(((30 - daysRemaining.value) / 30) * 100)
    })

    const stationOwner = computed(() => appData?.stations?.[0]?.owner ?? '')
    const stationName = computed(() => appData?.stations?.[0]?.station_name ?? '')

    const restoreAccount = async () => {
        if (isLoading.value) return
        isLoading.value = true
        errorMessage.value = ''
        try {
            const userId = appData?._id
            await userService.update(userId, {
                deletedAt: null,
                isDeleted: false,
            })

            // Update localStorage
            const raw = localStorage.getItem('app_data')
            if (raw) {
                const parsed = JSON.parse(raw)
                if (parsed?.value) {
                    parsed.value.isDeleted = false
                    parsed.value.deletedAt = null
                }
                localStorage.setItem('app_data', JSON.stringify(parsed))
            }

            isRestored.value = true
            setTimeout(() => router.push('/'), 2000)
        } catch (err) {
            errorMessage.value = t('accountDeleted.restoreError')
        } finally {
            isLoading.value = false
        }
    }

    const logout = async () => {
        await authStore.logout()
    }
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
            <!-- Success State -->
            <transition name="fade">
                <div v-if="isRestored" class="text-center">
                    <div class="flex justify-center mb-6">
                        <div
                            class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"
                        >
                            <svg
                                class="w-10 h-10 text-primary-600 dark:text-primary-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        {{ $t('accountDeleted.restoreSuccess') }}
                    </h2>
                    <p class="text-gray-500 dark:text-gray-400">{{ $t('accountDeleted.redirecting') }}</p>
                    <div class="mt-4 flex justify-center">
                        <div
                            class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"
                        ></div>
                    </div>
                </div>
            </transition>

            <!-- Main Card -->
            <div v-if="!isRestored" class="glass-card rounded-2xl overflow-hidden">
                <!-- Top accent bar -->
                <div class="h-1 w-full bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>

                <div class="p-8">
                    <!-- Icon -->
                    <div class="flex justify-center mb-6">
                        <div class="relative">
                            <div
                                class="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                            >
                                <svg
                                    class="w-10 h-10 text-red-500 dark:text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                    />
                                </svg>
                            </div>
                            <!-- Days badge -->
                            <span
                                class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                            >
                                {{ daysRemaining }}d
                            </span>
                        </div>
                    </div>

                    <!-- Title -->
                    <h1 class="text-center text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        {{ $t('accountDeleted.title') }}
                    </h1>
                    <p class="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                        {{ $t('accountDeleted.deletedOn', { date: deletedDateFormatted }) }}
                    </p>

                    <!-- Progress bar -->
                    <div class="mb-6">
                        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                            <span>{{ $t('accountDeleted.deletionProgress') }}</span>
                            <span class="text-red-500 font-medium"
                                >{{ daysRemaining }} {{ $t('accountDeleted.daysLeft') }}</span
                            >
                        </div>
                        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                class="h-full rounded-full bg-gradient-to-r from-primary-400 to-red-500 transition-all duration-500"
                                :style="{ width: progressPercent + '%' }"
                            />
                        </div>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1.5 text-right">
                            {{ progressPercent }}% {{ $t('accountDeleted.elapsed') }}
                        </p>
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-gray-100 dark:border-gray-700 mb-6" />

                    <!-- ADMIN: Restore account -->
                    <template v-if="isAdmin">
                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                            {{ $t('accountDeleted.adminDescription') }}
                        </p>

                        <!-- Error -->
                        <div
                            v-if="errorMessage"
                            class="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400"
                        >
                            {{ errorMessage }}
                        </div>

                        <button
                            @click="restoreAccount"
                            :disabled="isLoading || daysRemaining === 0"
                            class="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg
                                v-if="!isLoading"
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            {{ isLoading ? $t('accountDeleted.restoring') : $t('accountDeleted.restoreButton') }}
                        </button>

                        <p v-if="daysRemaining === 0" class="text-xs text-red-500 text-center mt-2">
                            {{ $t('accountDeleted.expired') }}
                        </p>
                    </template>

                    <!-- USER: Contact message -->
                    <template v-else>
                        <div
                            class="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl p-4 mb-5"
                        >
                            <div class="flex gap-3">
                                <svg
                                    class="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                    />
                                </svg>
                                <div>
                                    <p class="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                                        {{ $t('accountDeleted.userContactTitle') }}
                                    </p>
                                    <p class="text-sm text-primary-600 dark:text-primary-400 leading-relaxed">
                                        {{ $t('accountDeleted.userContactDescription') }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Station info -->
                        <div
                            v-if="stationName || stationOwner"
                            class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-5"
                        >
                            <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                                {{ $t('accountDeleted.yourStation') }}
                            </p>
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"
                                >
                                    <svg
                                        class="w-5 h-5 text-primary-600 dark:text-primary-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {{ stationName }}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ $t('accountDeleted.owner') }}: {{ stationOwner }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Logout -->
                    <button
                        @click="logout"
                        class="w-full mt-3 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        {{ $t('accountDeleted.logout') }}
                    </button>
                </div>
            </div>

            <!-- Footer note -->
            <p v-if="!isRestored" class="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">
                {{ $t('accountDeleted.footerNote', { days: daysRemaining }) }}
            </p>
        </div>
    </div>
</template>

<style scoped>
    .glass-card {
        background: rgba(255, 255, 255, 0.36);
        backdrop-filter: blur(8px) saturate(200%) brightness(1.02);
        -webkit-backdrop-filter: blur(48px) saturate(200%) brightness(1.02);
        border: 1px solid rgba(255, 255, 255, 0.95);
        box-shadow:
            0 0 0 0.5px rgba(255, 255, 255, 0.5) inset,
            0 24px 56px rgba(0, 0, 0, 0.18),
            0 6px 18px rgba(0, 0, 0, 0.1);
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.4s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
