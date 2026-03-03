<template>
    <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
        <div
            class="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700"
        >
            <span
                class="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0"
            >
                {{ number }}
            </span>
            <h2 class="font-bold text-gray-800 dark:text-white text-base">{{ title }}</h2>
        </div>
        <div class="px-5 py-4 space-y-4">
            <slot />
        </div>
    </div>
</template>
<script setup lang="ts">
    defineProps<{
        number: string
        title: string
    }>()
</script>
