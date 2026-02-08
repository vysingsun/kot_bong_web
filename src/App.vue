<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import { useAppStore } from '@/modules/app/store/index'
    const appStore = useAppStore()
</script>

<template>
    <RouterView />
    <BaseLoading v-if="appStore.loading" />
</template>
