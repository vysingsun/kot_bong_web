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
        <button
            data-modal-target="stock-modal"
            data-modal-toggle="stock-modal"
            type="button"
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
        </button>
    </div>
    <!-- Main modal -->
    <div
        id="stock-modal"
        tabindex="-1"
        aria-hidden="true"
        class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
        <div class="relative p-4 w-full max-w-md max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Stock Input</h3>
                    <button
                        type="button"
                        class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="stock-modal"
                    >
                        <svg
                            class="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-4 md:p-5">
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fuel Type</label>
                        <select
                            v-model="fuelStockStore.formData.fuel_id"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option v-for="(item, index) in fuels" :key="item?._id" :value="item._id">
                                {{ item.fuel_name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Quantity as Liter</label
                        >
                        <input
                            v-model="fuelStockStore.formData.quantity_liter"
                            type="number"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Amount as Ton</label
                        >
                        <input
                            v-model="fuelStockStore.formData.amount_ton"
                            type="number"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Supplier Name</label
                        >
                        <input
                            v-model="fuelStockStore.formData.supplier_name"
                            type="text"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Exchange Rate</label
                        >
                        <input
                            v-model="fuelStockStore.formData.exchange_rate"
                            type="number"
                            step="0.01"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div
                        class="bottom-0 left-0 flex justify-center w-full py-4 mt-4 space-x-4 sm:absolute sm:px-4 sm:mt-0"
                    >
                        <button
                            type="button"
                            @click="onSave()"
                            class="w-full justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            data-modal-hide="stock-modal"
                            class="w-full justify-center text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                        >
                            <svg
                                class="w-5 h-5 mr-1.5 -ml-1"
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
                                    stroke-width="2"
                                    d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <BaseModal
        :isVisible="isVisible"
        type="success"
        title="Add Stock Successfully"
        confirmLabel="Done"
        @confirm="handleConfirm"
    />
</template>

<script setup lang="ts">
    import { onMounted, ref, nextTick } from 'vue'
    import { initFlowbite } from 'flowbite'
    import ApexCharts from 'apexcharts'
    import { useCurrentStockStore } from '@/modules/current-stock/store'
    import { current_stockService } from '@/modules/current-stock/services/api.service'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { useFuelStockStore } from '@/modules/fuel-stock/store'
    import { useModal } from '@/composables/useModal'
    import { getFromCache } from '@/composables/useCache'

    const { isVisible, showModal, closeModal } = useModal()
    const store = useCurrentStockStore()
    const fuelStockStore = useFuelStockStore()
    const fuelStocks = ref<any[]>([])
    const loading = ref(false)
    const fuels = ref<any[]>([])
    const stationId = ref('')

    const onSelect = async () => {
        let appData = getFromCache('app_data')
        stationId.value = appData.value.stations[0]._id
        const response = await lookupService.getFuelByStationId(stationId.value)
        const result = response?.data
        fuels.value = result?.data
    }
    const onSave = async () => {
        loading.value = true
        fuelStockStore.formData.station_id = stationId.value
        await fuelStockStore.saveFuelStock()
        if (fuelStockStore.isCreatedSuccess) {
            const modal = document.getElementById('stock-modal')
            modal?.classList.add('hidden')
            loading.value = false
            showModal()
        } else {
            alert('Unsuccessfully!')
            handleConfirm()
        }
    }

    const handleConfirm = () => {
        location.reload()
    }

    onMounted(async () => {
        onSelect()
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
        initFlowbite()
    })
</script>

<style lang="scss" scoped></style>
