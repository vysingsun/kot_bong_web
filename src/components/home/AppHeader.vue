<script setup lang="ts">
    import { computed, inject } from 'vue'
    import { useThemeStore } from '@/stores/theme'
    import { useI18n } from 'vue-i18n'
    import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
    import { AuthKey } from '@/composables/useAuth'

    const { isAdmin } = inject(AuthKey)!

    interface User {
        _id: string
        firstName: string
        lastName: string
        phone?: string
        email?: string
        role?: { role_name: string }
        language?: string
    }

    interface Props {
        user?: User
        userName?: string
        userEmail?: string
        onLogout?: () => void
    }

    const props = defineProps<Props>()
    const { t } = useI18n()
    const themeStore = useThemeStore()

    // Get company logo based on current theme
    const companyLogo = computed(() => {
        return themeStore.currentTheme.logo || '/src/assets/images/tela_logo_landscape.png'
    })

    const userInitials = computed(() => {
        if (!props.userName) return 'U'
        const parts = props.userName.split(' ')
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        }
        return props.userName.substring(0, 2).toUpperCase()
    })
</script>

<template>
    <nav
        class="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50"
    >
        <div class="flex flex-wrap justify-between items-center">
            <div class="flex justify-start items-center">
                <button
                    data-drawer-target="drawer-navigation"
                    data-drawer-toggle="drawer-navigation"
                    class="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fill-rule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>

                <!-- Dynamic Company Logo -->
                <img :src="companyLogo" class="h-9 object-contain" :alt="`${themeStore.currentTheme.name} Logo`" />
            </div>

            <div class="flex items-center lg:order-2 gap-2">
                <!-- User Menu -->
                <button id="user-menu-button" type="button" data-dropdown-toggle="dropdown">
                    <AppAvatar :user="props.user" size="md" />
                </button>

                <!-- Dropdown menu -->
                <div
                    id="dropdown"
                    class="glass-card hidden z-50 my-4 w-56 text-base list-none divide-y divide-gray-100 shadow dark:divide-gray-600 rounded-xl"
                >
                    <div class="py-3 px-4">
                        <span class="block text-sm font-semibold text-gray-900 dark:text-white">{{ userName }}</span>
                        <span class="block text-sm text-gray-500 truncate dark:text-gray-400">{{ userEmail }}</span>
                    </div>
                    <!-- <ul class="py-1 text-gray-700 dark:text-gray-300">
                        <li>
                            <a
                                href="#"
                                class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                {{ t('home.my_profile') }}
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                {{ t('home.account_settings') }}
                            </a>
                        </li>
                    </ul> -->
                    <ul class="py-1 text-gray-700 dark:text-gray-300">
                        <li class="px-4">
                            <LanguageSwitcher />
                        </li>
                        <li v-if="isAdmin">
                            <RouterLink
                                to="/subscription"
                                class="flex justify-between items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <span class="flex items-center">
                                    <svg
                                        aria-hidden="true"
                                        class="mr-2 w-5 h-5 text-blue-600 dark:text-blue-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                            clip-rule="evenodd"
                                        ></path>
                                    </svg>
                                    Pro version
                                </span>
                                <svg
                                    aria-hidden="true"
                                    class="w-5 h-5 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </RouterLink>
                        </li>
                    </ul>
                    <ul class="py-1 text-gray-700 dark:text-gray-300">
                        <li @click="onLogout">
                            <button
                                class="flex justify-between items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <span class="flex items-center gap-2">
                                    <svg
                                        class="mx-auto w-5 h-5 text-red-500 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-300 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    <span class="mb-[3px]">{{ t('home.sign_out') }}</span>
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
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
