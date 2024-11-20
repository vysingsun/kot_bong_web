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
        <RouterLink
            to="/fuel-sold/create"
            class="mt-4 w-full px-3 py-2 text-xs font-medium text-center inline-flex items-center justify-center text-white bg-blue-600 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
        </RouterLink>
    </div>
    <TablePaging
        :key="table_key"
        name="Fuel Sold"
        :params="filterParams"
        :headers="store.headers"
        column-no
        :api-service="fuel_soldService"
        get-service-key="getFuelSoldByStationId"
        is-global-search
        clickable-row
        @row-click="getRow"
    />
</template>

<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue'
    import { initFlowbite } from 'flowbite'
    import { fuel_soldService } from '@/modules/fuel-sold/services/api.service'
    import { useFuelSoldStore } from '@/modules/fuel-sold/store/index'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { getFromCache } from '@/composables/useCache'
    import { useRouter } from 'vue-router'

    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import moment from 'moment'

    const router = useRouter()
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

    const getRow = (item: any) => {
        router.push(`/fuel-sold/view/${item._id}`)
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
