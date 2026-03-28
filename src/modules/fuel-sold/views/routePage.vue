<template>
    <BaseLoading v-if="loading" />
    <template v-else>
        <FuelSoldNozzleForm v-if="isNozzle" :fuels="fuels" />
        <FuelSoldForm v-else :fuels="fuels" />
    </template>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { setCache, getFromCache } from '@/composables/useCache'
    import { userService } from '@/modules/app/services/api.service'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import FuelSoldForm from './form.vue'
    import FuelSoldNozzleForm from './FuelSoldNozzleForm.vue'

    const isNozzle = ref(false)
    const fuels = ref<any[]>([])
    const loading = ref(true)

    onMounted(async () => {
        // Check if we already have app_data in cache to get stationId immediately
        const cached = getFromCache('app_data')
        const stationId = cached.value?.stations?.[0]?._id ?? ''

        if (stationId) {
            // stationId known from cache → fire both in parallel
            const [userRes, fuelRes] = await Promise.all([
                userService.get(),
                lookupService.getFuelByStationId(stationId),
            ])

            const appData = userRes.data.data
            isNozzle.value = appData.stations?.[0]?.isNozzle ?? false
            setCache('app_data', appData)
            fuels.value = fuelRes?.data?.data ?? []
        } else {
            // No cache yet → must get user first to know stationId
            const userRes = await userService.get()
            const appData = userRes.data.data
            const sid = appData.stations?.[0]?._id ?? ''

            isNozzle.value = appData.stations?.[0]?.isNozzle ?? false
            setCache('app_data', appData)

            if (sid) {
                const fuelRes = await lookupService.getFuelByStationId(sid)
                fuels.value = fuelRes?.data?.data ?? []
            }
        }

        loading.value = false
    })
</script>
