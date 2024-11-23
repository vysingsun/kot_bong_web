<template>
    <BaseForm
        title="Fuel Sold"
        :is-loading="loadingFrom"
        :editing-id="fuel_sold_id"
        :form-data="store.formData"
        :api-service="fuel_soldService"
        @on-save="handleSaveLoading"
    >
        <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Fuel Type </label>
            <select
                v-model="selectedFuelId"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                :disabled="mode === 'view'"
                @click="getFuelService"
            >
                <option v-if="loading">Loading...</option>
                <option v-for="item in store.fuels" :key="item?._id" :value="item._id">
                    {{ item.fuel_name }}
                </option>
            </select>
        </div>
        <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Quantity Sold as Liter </label>
            <input
                v-model="store.formData.quantity_sold_liter"
                type="number"
                step="0.01"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                :disabled="mode === 'view'"
            />
        </div>
        <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Amount per Liter (KHR) </label>
            <input
                id="error"
                v-model="store.formData.amount_per_liter_khr"
                type="number"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
                :disabled="mode === 'view'"
            />
        </div>
        <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Exchange Rate </label>
            <input
                v-model="store.formData.exchange_rate"
                type="number"
                step="0.01"
                :disabled="mode === 'view'"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
        </div>
    </BaseForm>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
    import { useRoute, onBeforeRouteUpdate } from 'vue-router'
    import { fuel_soldService } from '@/modules/fuel-sold/services/api.service'
    import { useFuelSoldStore } from '@/modules/fuel-sold/store/index'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { getFromCache } from '@/composables/useCache'

    const store = useFuelSoldStore()
    const route = useRoute()
    const mode = ref(route.params.mode)
    const loading = ref(false)
    const loadingFrom = ref(true)
    const stationId = ref('')
    const fuel_sold_id = route.path.split('/').pop()

    const getFuelService = async () => {
        loading.value = true
        const response = await lookupService.getFuelByStationId(stationId.value)
        const result = response?.data
        store.fuels = result?.data
        loading.value = false
    }

    const selectedFuelId = computed({
        get() {
            return typeof store.formData.fuel_id === 'object' ? store.formData.fuel_id?._id : store.formData.fuel_id
        },
        set(value) {
            store.formData.fuel_id = value
        },
    })

    const handleSaveLoading = (isLoading: boolean) => {
        loadingFrom.value = isLoading
        console.log(loadingFrom.value)
    }

    onMounted(async () => {
        let appData = getFromCache('app_data')
        stationId.value = appData.value.stations[0]._id
        store.formData.station_id = stationId.value
        if (mode.value !== 'create') {
            await store.readDataFromApi(fuel_sold_id)
            loadingFrom.value = false
        }
    })

    onBeforeUnmount(() => {
        store.resetData()
    })

    onBeforeRouteUpdate((to, from, next) => {
        mode.value = to.params.mode
        next()
    })
</script>

<style scoped></style>
