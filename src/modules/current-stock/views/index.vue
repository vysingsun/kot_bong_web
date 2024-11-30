<template>
    <BaseLoading v-if="loading" />
    <div
        v-for="(item, index) in fuelStocks"
        :key="item?._id"
        class="w-full flex px-2.5 mb-5 justify-between max-w-sm bg-white border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700"
    >
        <div :id="'radial-chart-do-' + index" class="w-[120px] bg-inherit pb-4"></div>
        <div class="flex items-center mr-3">
            <div
                class="text-xs font-semibold text-black bg-gray-300 bg-opacity-30 backdrop-blur-md backdrop-opacity-60 py-3 px-5 rounded-lg"
            >
                Total Stock: {{ item?.current_stock_liter.toFixed(2) }} L
            </div>
        </div>
    </div>
    <div class="w-100 flex justify-between">
        <RouterLink
            to="/fuel-stock"
            type="button"
            class="w-100 px-9 py-2.5 text-sm font-medium text-white inline-flex items-center bg-[#169c48] hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-center dark:bg-green-600 dark:hover:bg-green-600 dark:focus:ring-green-600"
        >
            <svg
                class="w-6 h-6 me-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.6"
                    d="M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                />
            </svg>
            All Records
        </RouterLink>
        <RouterLink
            to="/fuel-stock/create"
            class="w-100 px-9 py-2.5 text-sm font-medium text-white inline-flex items-center bg-[#faca15] hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 rounded-lg text-center dark:bg-yellow-400 dark:hover:bg-yellow-400 dark:focus:ring-yellow-400"
        >
            <svg
                class="w-6 h-6 me-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
            Add Stock
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, nextTick } from 'vue'
    import { initFlowbite } from 'flowbite'
    import ApexCharts from 'apexcharts'
    import { useCurrentStockStore } from '@/modules/current-stock/store'
    import { current_stockService } from '@/modules/current-stock/services/api.service'
    import { getFromCache } from '@/composables/useCache'

    const store = useCurrentStockStore()
    const fuelStocks = ref<any[]>([])
    const loading = ref(false)
    const stationId = ref('')

    onMounted(async () => {
        initFlowbite()
        let appData = getFromCache('app_data')
        stationId.value = appData.value.stations[0]._id
        loading.value = true
        const response = await current_stockService.getCurrentStock(stationId.value)
        const result = response?.data

        fuelStocks.value = result?.data

        await nextTick()
        loading.value = false
        fuelStocks.value.forEach((item: any, index: number) => {
            const chartElementId = `#radial-chart-do-${index}`
            const current_stock_as_percent = (100 * item?.current_stock_liter) / 5000
            if (document.querySelector(chartElementId)) {
                const chart = new ApexCharts(
                    document.querySelector(chartElementId),
                    store.getChartOptions(current_stock_as_percent, item?.fuel_id?.fuel_name, item?.fuel_id?.color),
                )
                chart.render()
            }
        })
    })
</script>

<style lang="scss" scoped></style>
