<template>
    <svg :width="size" :height="size" class="app-icon">
        <use :href="`${baseUrl}icon-set.svg#${name}`" />
    </svg>
</template>

<script setup lang="ts">
    defineProps({
        name: { type: String, required: true },
        size: { type: [String, Number], default: 24 },
    })

    const baseUrl = import.meta.env.VITE_APP_BASE_URL
</script>
