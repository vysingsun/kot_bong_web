<template>
    <svg :width="size" :height="size" class="app-icon">
        <use :href="`#${name}`" />
    </svg>
</template>

<script setup>
    defineProps({
        name: { type: String, required: true },
        size: { type: [String, Number], default: 24 },
    })
</script>

<style scoped>
    .app-icon {
        display: inline-block;
        vertical-align: middle;
        /* both fill and stroke inherit from parent color */
        fill: currentColor;
        stroke: currentColor;
    }
</style>
