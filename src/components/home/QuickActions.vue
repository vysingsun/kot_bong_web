<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import { RouterLink } from 'vue-router'

    const { t } = useI18n()

    interface QuickAction {
        id: string
        icon: string
        label: string
        to?: string
        onClick?: () => void
    }

    interface Props {
        onLogout?: () => void
    }

    const props = defineProps<Props>()

    const actions: QuickAction[] = [
        {
            id: 'sales',
            icon: 'M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z',
            label: 'home.sales',
            to: '/fuel-sold',
        },
        {
            id: 'users',
            icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z',
            label: 'home.staff',
            to: '/staff',
        },
        {
            id: 'stocks',
            icon: 'M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z',
            label: 'home.stocks',
            to: '/current-stock',
        },
        {
            id: 'settings',
            icon: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z',
            label: 'home.settings',
            to: '/comingsoon',
        },
        {
            id: 'products',
            icon: 'M4 3a2 2 0 100 4h12a2 2 0 100-4H4z M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z',
            label: 'home.products',
            to: '/fuel',
        },
    ]

    const handleAction = (action: QuickAction) => {
        if (action.id === 'logout' && props.onLogout) {
            props.onLogout()
        }
    }
</script>

<template>
    <div class="grid grid-cols-3 gap-4">
        <template v-for="action in actions" :key="action.id">
            <RouterLink
                v-if="action.to"
                :to="action.to"
                class="block p-4 text-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 group transition-colors"
            >
                <svg
                    class="mx-auto mb-1 w-7 h-7 text-gray-400 group-hover:text-secondary dark:text-gray-400 dark:group-hover:text-secondary transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path :d="action.icon" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
                <div
                    class="text-sm text-gray-900 dark:text-white group-hover:text-secondary dark:group-hover:text-secondary transition-colors"
                >
                    {{ t(action.label) }}
                </div>
            </RouterLink>

            <button
                v-else
                @click="handleAction(action)"
                class="block p-4 text-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 group transition-colors"
            >
                <svg
                    class="mx-auto mb-1 w-7 h-7 text-gray-400 group-hover:text-secondary dark:text-gray-400 dark:group-hover:text-secondary transition-colors"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path :d="action.icon" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
                <div
                    class="text-sm text-gray-900 dark:text-white group-hover:text-secondary dark:group-hover:text-secondary transition-colors"
                >
                    {{ t(action.label) }}
                </div>
            </button>
        </template>

        <!-- Logout Button -->
        <button
            @click="onLogout"
            class="block p-4 text-center rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 group transition-colors"
        >
            <svg
                class="mx-auto mb-1 w-7 h-7 text-red-500 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-300 transition-colors"
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
            <div class="text-sm text-red-600 dark:text-red-400">{{ t('home.logout') }}</div>
        </button>
    </div>
</template>
