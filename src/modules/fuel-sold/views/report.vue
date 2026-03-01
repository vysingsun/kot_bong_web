<template>
    <BaseLoading v-if="loading" />
    <div class="max-w-[400px] px-4 pt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('filter.date_range') }}
        </label>
        <VueDatePicker
            v-model="date_range"
            class="DatePicker pb-4"
            range
            auto-apply
            :placeholder="t('filter.date_range_placeholder')"
            :partial-range="false"
            :enable-time-picker="false"
            @update:model-value="onChangeDateRange"
        />
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('fuel_sold.fuel_type') }}
        </label>
        <div class="relative">
            <select
                v-model="fuel_type"
                class="border border-gray-200 text-gray-400 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary"
                @change="onChangeFuelType"
            >
                <option value="" class="text-gray-100" disabled selected hidden>{{ t('fuel_stock.fuel_type') }}</option>
                <option v-for="item in fuels" :key="item?._id" :value="item._id">{{ item.fuel_name }}</option>
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
        :clickable-row="false"
        :is-action="false"
    >
        <!-- Custom slot for fuel.fuel_name -->
        <template #fuel="{ item }">
            <div class="flex items-center gap-2">
                <!-- <span class="text-gray-900 dark:text-white">
                        {{ item.fuel?.fuel_name || '-' }}
                    </span> -->
                <AppFuel :fuel="item.fuel" size="sm" />
            </div>
        </template>
        <!-- Custom slot for createdBy -->
        <template #createdBy="{ item }">
            <div class="flex items-center gap-2">
                <span
                    ><AppAvatar :user="item.createdBy" size="md">
                        <template #title />
                        <template #subtitle /> </AppAvatar
                ></span>
            </div>
        </template>

        <!-- Custom slot for quantity_sold_liter -->
        <template #quantity_sold_liter="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.quantity_sold_liter ? item.quantity_sold_liter.toLocaleString() : '0' }} L
                </span>
            </div>
        </template>

        <!-- Custom slot for quantity_sold_ton -->
        <template #quantity_sold_ton="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.quantity_sold_ton ? item.quantity_sold_ton.toLocaleString() : '0' }} T
                </span>
            </div>
        </template>

        <!-- Custom slot for amount_per_liter_khr -->
        <template #amount_per_liter_khr="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.amount_per_liter_khr ? item.amount_per_liter_khr.toLocaleString() : '0' }} ៛
                </span>
            </div>
        </template>

        <!-- Custom slot for amount_per_liter_us -->
        <template #amount_per_liter_us="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.amount_per_liter_us ? item.amount_per_liter_us.toLocaleString() : '0' }} $
                </span>
            </div>
        </template>

        <!-- Custom slot for exchange_rate -->
        <template #exchange_rate="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.exchange_rate ? item.exchange_rate.toLocaleString() : '0' }} ៛
                </span>
            </div>
        </template>

        <!-- Custom slot for total_amount_khr -->
        <template #total_amount_khr="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.total_amount_khr ? item.total_amount_khr.toLocaleString() : '0' }} ៛
                </span>
            </div>
        </template>

        <!-- Custom slot for total_amount_us -->
        <template #total_amount_us="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.total_amount_us ? item.total_amount_us.toLocaleString() : '0' }} $
                </span>
            </div>
        </template>

        <!-- Custom slot for createdAt -->
        <template #createdAt="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.createdAt ? formatDate(item.createdAt) : '-' }}
                </span>
            </div>
        </template>
    </TablePaging>
</template>
<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue'
    import { initFlowbite } from 'flowbite'
    import { useI18n } from 'vue-i18n'
    import { fuel_soldService } from '@/modules/fuel-sold/services/api.service'
    import { useFuelSoldStore } from '@/modules/fuel-sold/store/index'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { getFromCache } from '@/composables/useCache'
    import { useRouter } from 'vue-router'

    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import moment from 'moment'
    import { useFormatDate } from '@/composables/useFormatDate'

    const { formatDate } = useFormatDate()
    const { t } = useI18n()
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

    :deep(.dp__input::placeholder) {
        font-family: 'Kantumruy Pro', sans-serif;
    }
</style>
