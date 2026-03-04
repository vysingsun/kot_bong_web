<script setup lang="ts">
    /**
     * A wrapper component for grouping related features
     * with a category title.
     */
    defineProps({
        title: {
            type: String,
            required: true,
        },
    })
</script>

<template>
    <div class="mb-6 last:mb-0">
        <h3 class="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-3 px-1 border-l-4 border-blue-500 pl-3">
            {{ title }}
        </h3>

        <div class="overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
            <table class="w-full text-left border-collapse">
                <slot />
            </table>
        </div>
    </div>
</template>
