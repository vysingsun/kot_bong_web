<template>
    <BaseLoading v-if="loading" />
    <div class="pb-4">
        <VueDatePicker
            v-model="date_range"
            class="DatePicker pb-4"
            range
            auto-apply
            placeholder="From Date-To Date"
            :partial-range="false"
            :enable-time-picker="false"
            @update:model-value="onChangeDateRange"
        />
        <div class="relative mb-4">
            <select
                v-model="fuel_type"
                class="border border-gray-200 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                @change="onChangeFuelType"
            >
                <option value="" class="text-gray-100" disabled selected hidden>Fuel Type</option>
                <option v-for="item in fuels" :key="item?._id" :value="item._id">
                    {{ item.fuel_name }}
                </option>
            </select>
            <button
                v-if="fuel_type"
                class="absolute right-8 top-1.5 text-gray-500 hover:text-gray-700"
                type="button"
                @click="clearSelection"
            >
                &times;
            </button>
        </div>
        <button
            type="button"
            data-modal-target="sold-modal"
            data-modal-toggle="sold-modal"
            class="w-full px-3 py-2 text-xs font-medium text-center inline-flex items-center justify-center text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            <svg
                class="w-5 h-5 text-white me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    fill-rule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                    clip-rule="evenodd"
                />
            </svg>

            Add Sold
        </button>
    </div>
    <!-- Main modal -->
    <div
        id="sold-modal"
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
                        data-modal-hide="sold-modal"
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
                <form class="p-4 md:p-5" @submit.prevent="onSave">
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Fuel Type </label>
                        <select
                            v-model="store.formData.fuel_id"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        >
                            <option v-for="item in fuels" :key="item?._id" :value="item._id">
                                {{ item.fuel_name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Quantity Sold as Liter
                        </label>
                        <input
                            v-model="store.formData.quantity_sold_liter"
                            type="number"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Amount per Liter (KHR)
                        </label>
                        <input
                            id="error"
                            v-model="store.formData.amount_per_liter_khr"
                            type="number"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Exchange Rate
                        </label>
                        <input
                            v-model="store.formData.exchange_rate"
                            type="number"
                            step="0.01"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>
                    <div
                        class="bottom-0 left-0 flex justify-center w-full py-4 mt-4 space-x-4 sm:absolute sm:px-4 sm:mt-0"
                    >
                        <button
                            type="submit"
                            class="w-full justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            data-modal-hide="sold-modal"
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
                </form>
            </div>
        </div>
    </div>
    <BaseModal
        :is-visible="isVisible"
        type="success"
        title="Add Stock Successfully"
        confirm-label="Done"
        @confirm="handleConfirm"
    />
    <TablePaging
        :key="table_key"
        name="Fuel Sold"
        :params="filterParams"
        :headers="store.headers"
        column-no
        :api-service="fuel_soldService"
        get-service-key="getFuelSoldByStationId"
        is-global-search
    />
</template>

<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue'
    import { initFlowbite } from 'flowbite'
    import { fuel_soldService } from '@/modules/fuel-sold/services/api.service'
    import { useFuelSoldStore } from '@/modules/fuel-sold/store/index'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { useModal } from '@/composables/useModal'
    import { getFromCache } from '@/composables/useCache'

    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import moment from 'moment'

    const { isVisible, showModal, closeModal } = useModal()
    const table_key = ref(0)
    const store = useFuelSoldStore()
    const date_range = ref([])
    const fuels = ref<any[]>([])
    const fuel_type = ref('')
    const stationId = ref('')
    const params = ref<any>({})
    const filterParams = computed(() => params.value)
    const loading = ref(false)

    const onSelect = async () => {
        let appData = getFromCache('app_data')
        stationId.value = appData.value.stations[0]._id
        const response = await lookupService.getFuelByStationId(stationId.value)
        const result = response?.data
        fuels.value = result?.data
    }

    const onSave = async () => {
        if (store.formData.fuel_id && store.formData.quantity_sold_liter && store.formData.amount_per_liter_khr) {
            loading.value = true
            store.formData.station_id = stationId.value
            await store.saveFuelSold()
            if (store.isCreatedSuccess) {
                const modal = document.getElementById('sold-modal')
                modal?.classList.add('hidden')
                loading.value = false
                showModal()
            } else {
                alert('Unsuccessfully!')
                handleConfirm()
            }
        }
    }

    const handleConfirm = () => {
        location.reload()
    }

    function prepareFilterParams() {
        params.value = store.prepareFuelSoldParams()
        // for refresh data
        table_key.value += 1
    }

    onMounted(() => {
        initFlowbite()
        onSelect()
    })

    const onChangeDateRange = () => {
        if (date_range.value?.length) {
            store.filterForm.date_range = {
                start: moment(date_range.value[0]).format('YYYY-MM-DD'),
                end: moment(date_range.value[1]).format('YYYY-MM-DD'),
            }
        } else {
            store.filterForm.date_range = {}
        }
        prepareFilterParams()
    }

    const onChangeFuelType = () => {
        store.filterForm.fuel_type = fuel_type.value
        prepareFilterParams()
    }

    const clearSelection = () => {
        fuel_type.value = ''
        store.filterForm.fuel_type = fuel_type.value
        prepareFilterParams()
    }
</script>

<style lang="scss" scoped>
    :deep(.DatePicker) {
        .dp__pointer {
            border-radius: 8px;
        }
    }
</style>
