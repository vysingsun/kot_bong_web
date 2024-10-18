<template>
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
        <select
            v-model="fuel_type"
            class="border border-gray-200 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            @change="onChangeFuelType"
        >
            <option value="" class="text-gray-100" disabled selected hidden>Fuel Type</option>
            <option v-for="(item, index) in fuels" :key="item?._id" :value="item._id">
                {{ item.fuel_name }}
            </option>
        </select>
    </div>
    <TablePaging
        :key="table_key"
        name="Fuel Income"
        :params="filterParams"
        :headers="store.headers"
        column-no
        :api-service="fuel_stockService"
        get-service-key="get"
        is-global-search
    />
</template>

<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue'
    import { initFlowbite } from 'flowbite'
    import { fuel_stockService } from '@/modules/fuel-stock/services/api.service'
    import { useFuelStockStore } from '@/modules/fuel-stock/store/index'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { getFromCache } from '@/composables/useCache'
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import moment from 'moment'

    const table_key = ref(0)
    const store = useFuelStockStore()
    const date_range = ref([])
    const fuels = ref<any[]>([])
    const fuel_type = ref('')
    const stationId = ref('')
    const params = ref<any>({})
    const filterParams = computed(() => params.value)

    const onSelect = async () => {
        let appData = getFromCache('app_data')
        stationId.value = appData.value.stations[0]._id
        const response = await lookupService.getFuelByStationId(stationId.value)
        const result = response?.data
        fuels.value = result?.data
    }

    function prepareFilterParams() {
        params.value = store.prepareFuelStockParams()
        // for refresh data
        table_key.value += 1
    }

    onMounted(() => {
        initFlowbite()
        onSelect()
    })

    const onChangeDateRange = () => {
        store.filterForm.date_range = {
            start: moment(date_range.value[0]).format('YYYY-MM-DD'),
            end: moment(date_range.value[1]).format('YYYY-MM-DD'),
        }
        prepareFilterParams()
    }

    const onChangeFuelType = () => {
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
