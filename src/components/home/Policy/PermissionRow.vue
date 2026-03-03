<script setup lang="ts">
    /**
     * A compact row used to show if a specific permission
     * or feature is granted, with an optional "Pro" badge.
     */
    defineProps({
        allowed: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            required: true,
        },
        pro: {
            type: Boolean,
            default: false,
        },
    })
</script>

<template>
    <div class="flex items-center gap-3 py-1.5 group transition-all">
        <div
            class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
            :class="allowed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'"
        >
            <svg
                v-if="allowed"
                class="w-3 h-3 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>

            <svg
                v-else
                class="w-3 h-3 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>

        <span class="text-gray-700 dark:text-gray-300 text-xs font-medium">
            {{ label }}
        </span>

        <span
            v-if="pro"
            class="ml-auto text-[10px] uppercase tracking-wider bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-100 dark:border-blue-800"
        >
            Pro
        </span>
    </div>
</template>
