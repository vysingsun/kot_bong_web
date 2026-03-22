<template>
    <FuelSoldNozzleForm v-if="isNozzle" />
    <FuelSoldForm v-else />
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { getFromCache } from '@/composables/useCache'
    import FuelSoldForm from './form.vue'
    import FuelSoldNozzleForm from './FuelSoldNozzleForm.vue'

    const appData = getFromCache('app_data')
    const isNozzle = computed(() => appData.value?.stations?.[0]?.isNozzle ?? false)
</script>
