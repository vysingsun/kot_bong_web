<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import { RouterLink } from 'vue-router'

    const { t } = useI18n()

    interface QuickAction {
        id: string
        path: string
        stroke: boolean
        label: string
        to?: string
        color: string
        bg: string
    }

    interface Props {
        onLogout?: () => void
    }

    const props = defineProps<Props>()

    const actions: QuickAction[] = [
        {
            id: 'sales',
            label: 'home.sales',
            to: '/fuel-sold',
            color: '#3b82f6',
            bg: 'rgba(59,130,246,0.15)',
            // Receipt icon
            path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 8H13V3.5zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h3v1.5H8V10z',
            stroke: false,
        },
        {
            id: 'users',
            label: 'home.staff',
            to: '/staff',
            color: '#8b5cf6',
            bg: 'rgba(139,92,246,0.15)',
            // People icon
            path: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
            stroke: false,
        },
        {
            id: 'stocks',
            label: 'home.stocks',
            to: '/current-stock',
            color: '#14b8a6',
            bg: 'rgba(20,184,166,0.15)',
            // Tank/cylinder icon
            path: 'M12 2C7.58 2 4 3.79 4 6v12c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4zm6 16c0 .9-2.43 2-6 2s-6-1.1-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V18zm0-5c0 .9-2.43 2-6 2s-6-1.1-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V13zm-6-3C8.43 10 6 8.9 6 8s2.43-2 6-2 6 1.1 6 2-2.43 2-6 2z',
            stroke: false,
        },
        {
            id: 'settings',
            label: 'home.settings',
            to: '/setting',
            color: '#6b7280',
            bg: 'rgba(107,114,128,0.15)',
            // Gear icon
            path: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
            stroke: false,
        },
        {
            id: 'products',
            label: 'home.products',
            to: '/fuel',
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.15)',
            // Droplet — same as your fuel icon
            path: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
            stroke: false,
        },
    ]
</script>

<template>
    <div class="grid grid-cols-3 gap-3">
        <template v-for="action in actions" :key="action.id">
            <RouterLink
                v-if="action.to"
                :to="action.to"
                class="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl transition-all duration-200 hover:brightness-110 active:scale-95"
                :style="{
                    background: `linear-gradient(135deg, ${action.bg}, transparent)`,
                    border: `1px solid rgba(255,255,255,0.45)`,
                    backdropFilter: 'blur(12px)',
                }"
            >
                <div
                    class="w-11 h-11 rounded-xl flex items-center justify-center"
                    :style="{
                        background: action.bg,
                        border: `1px solid rgba(255,255,255,0.5)`,
                    }"
                >
                    <!-- inside RouterLink -->
                    <svg
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        :fill="action.stroke ? 'none' : action.color"
                        :stroke="action.stroke ? action.color : 'none'"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path :d="action.path" />
                    </svg>
                </div>
                <span class="text-xs font-semibold text-gray-900 dark:text-white">
                    {{ t(action.label) }}
                </span>
            </RouterLink>
        </template>

        <!-- Logout -->
        <button
            @click="onLogout"
            class="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl transition-all duration-200 hover:brightness-110 active:scale-95"
            style="
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), transparent);
                border: 1px solid rgba(255, 255, 255, 0.45);
                backdrop-filter: blur(12px);
            "
        >
            <div
                class="w-11 h-11 rounded-xl flex items-center justify-center"
                style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(255, 255, 255, 0.5)"
            >
                <svg
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
            </div>
            <span class="text-xs font-semibold text-red-500">{{ t('home.logout') }}</span>
        </button>
    </div>
</template>
