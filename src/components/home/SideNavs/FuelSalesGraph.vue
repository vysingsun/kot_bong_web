<template>
    <FuelSalesChart :response="apiResponse" :loading="loading" @fetch="fetchFuelSales" />
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import type { IUser } from '@/data/constants'
    import { getFromCache } from '@/composables/useCache'
    import { initFlowbite } from 'flowbite'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import FuelSalesChart from '@/components/home/FuelSalesChart.vue'

    const user = ref<IUser>()
    const loading = ref(false)
    const apiResponse = ref(null)

    onMounted(async () => {
        initFlowbite()
        const appData = getFromCache('app_data')?.value
        user.value = appData
        await fetchFuelSales()
    })

    const fetchFuelSales = async (params: Record<string, string> = {}) => {
        if (!user.value?.stations?.[0]?._id) return
        loading.value = true
        try {
            const response = await lookupService.getFuelSales(
                user.value.stations[0]._id,
                Object.keys(params).length ? params : undefined,
            )
            apiResponse.value = response.data
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }
</script>
