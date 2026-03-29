<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { getFromCache } from '@/composables/useCache'
    import { userService } from '@/modules/app/services/api.service'

    const { locale } = useI18n()
    const isOpen = ref(false)
    const isLoading = ref(false)
    const dropdownRef = ref<HTMLElement | null>(null)

    const languages = [
        {
            code: 'EN',
            name: 'English',
            flag: 'https://flagcdn.com/w20/us.png',
            locale: 'en',
        },
        {
            code: 'KH',
            name: 'ខ្មែរ',
            flag: 'https://flagcdn.com/w20/kh.png',
            locale: 'kh',
        },
    ]

    const currentLanguage = ref(languages[0])

    const changeLanguage = async (lang: (typeof languages)[0]) => {
        if (currentLanguage.value.code === lang.code || isLoading.value) return

        isLoading.value = true
        try {
            const appData = getFromCache('app_data')?.value
            const userId = appData?._id || appData?.data?._id

            if (userId) {
                await userService.update(userId, { language: lang.locale })
            }

            // Update only language key in app_data localStorage
            const raw = localStorage.getItem('app_data')
            if (raw) {
                const parsed = JSON.parse(raw)
                if (parsed?.value) {
                    parsed.value.language = lang.locale
                }
                localStorage.setItem('app_data', JSON.stringify(parsed))
            }
            locale.value = lang.locale
            currentLanguage.value = lang
            localStorage.setItem('locale', lang.locale)
            isOpen.value = false
        } catch (error) {
            console.error('Failed to update language:', error)
        } finally {
            isLoading.value = false
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
            isOpen.value = false
        }
    }

    onMounted(() => {
        const appData = getFromCache('app_data')?.value
        const savedLanguage = appData?.language || appData?.data?.language || localStorage.getItem('locale')
        const matched = languages.find(lang => lang.locale === savedLanguage)
        currentLanguage.value = matched || languages[0]
        locale.value = currentLanguage.value.locale
        document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside)
    })
</script>

<template>
    <div class="relative" ref="dropdownRef">
        <!-- Trigger Button -->
        <button
            @click="isOpen = !isOpen"
            type="button"
            :disabled="isLoading"
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg transition-all glass-card hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed"
        >
            <!-- Spinner or Flag -->
            <span v-if="isLoading" class="w-5 h-4 flex items-center justify-center">
                <svg class="animate-spin w-4 h-4 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            </span>
            <img
                v-else
                :src="currentLanguage.flag"
                :alt="currentLanguage.name"
                class="w-5 h-4 object-cover rounded-sm"
            />

            <span class="font-semibold">{{ currentLanguage.code }}</span>
            <svg
                class="w-3 h-3 transition-transform"
                :class="{ 'rotate-180': isOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <!-- Dropdown -->
        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <div v-if="isOpen" class="absolute right-0 z-10 mt-2 w-44 rounded-lg overflow-hidden glass-card">
                <ul class="py-1">
                    <li
                        v-for="lang in languages"
                        :key="lang.code"
                        @click="changeLanguage(lang)"
                        class="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors hover:bg-white/30 dark:hover:bg-white/10"
                        :class="{
                            'bg-white/40 dark:bg-white/10': currentLanguage.code === lang.code,
                        }"
                    >
                        <img :src="lang.flag" :alt="lang.name" class="w-5 h-4 object-cover rounded-sm" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ lang.code }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 flex-1">{{ lang.name }}</span>

                        <!-- Spinner for loading state on selected item -->
                        <svg
                            v-if="
                                isLoading &&
                                currentLanguage.code !== lang.code &&
                                languages.find(l => l.code === lang.code)
                            "
                            class="animate-spin w-3.5 h-3.5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>

                        <!-- Checkmark for active language -->
                        <svg
                            v-else-if="currentLanguage.code === lang.code"
                            class="w-4 h-4 text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </li>
                </ul>
            </div>
        </transition>
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
</style>
