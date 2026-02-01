<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import { ref, onMounted, onBeforeUnmount } from 'vue'

    const { locale } = useI18n()
    const isOpen = ref(false)
    const dropdownRef = ref<HTMLElement | null>(null)

    const languages = [
        {
            code: 'EN',
            name: 'English',
            flag: 'https://flagcdn.com/w20/us.png',
            flagLarge: 'https://flagcdn.com/w40/us.png',
            locale: 'en',
        },
        {
            code: 'KH',
            name: 'ខ្មែរ',
            flag: 'https://flagcdn.com/w20/kh.png',
            flagLarge: 'https://flagcdn.com/w40/kh.png',
            locale: 'kh',
        },
    ]

    const currentLanguage = ref(languages.find(lang => lang.locale === locale.value) || languages[0])

    const changeLanguage = (lang: (typeof languages)[0]) => {
        locale.value = lang.locale
        currentLanguage.value = lang
        localStorage.setItem('locale', lang.locale)
        isOpen.value = false
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
            isOpen.value = false
        }
    }

    onMounted(() => {
        currentLanguage.value = languages.find(lang => lang.locale === locale.value) || languages[0]
        document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside)
    })
</script>

<template>
    <div class="relative" ref="dropdownRef">
        <button
            @click="isOpen = !isOpen"
            type="button"
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:outline-none focus:ring-yellow-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-all"
        >
            <img :src="currentLanguage.flag" :alt="currentLanguage.name" class="w-5 h-4 object-cover rounded-sm" />
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
            <div
                v-if="isOpen"
                class="absolute right-0 z-10 mt-2 w-40 bg-white rounded-lg shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
                <ul class="py-1">
                    <li
                        v-for="lang in languages"
                        :key="lang.code"
                        @click="changeLanguage(lang)"
                        class="flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        :class="{
                            'bg-yellow-50 dark:bg-gray-700': currentLanguage.code === lang.code,
                        }"
                    >
                        <img :src="lang.flag" :alt="lang.name" class="w-5 h-4 object-cover rounded-sm" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ lang.code }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 flex-1">{{ lang.name }}</span>
                        <svg
                            v-if="currentLanguage.code === lang.code"
                            class="w-4 h-4 text-yellow-400"
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
