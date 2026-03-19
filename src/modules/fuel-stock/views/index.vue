<template>
    <div class="max-w-[400px] pt-4 px-4">
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
            {{ t('fuel_stock.fuel_type') }}
        </label>
        <div class="relative">
            <select
                v-model="fuel_type"
                class="border border-gray-200 text-gray-400 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary"
                @change="onChangeFuelType"
            >
                <option value="">{{ t('fuel_sold.all_fuels') }}</option>
                <option v-for="item in fuels" :key="item?._id" :value="item._id">
                    {{ item.fuel_name }}
                </option>
            </select>
        </div>
    </div>
    <TablePaging
        :key="table_key"
        name="Fuel Income"
        :params="filterParams"
        :headers="store.headers"
        column-no
        :api-service="fuel_stockService"
        get-service-key="getFuelStocksByStation"
        is-global-search
        :clickable-row="false"
        :is-action="false"
        :totals="totals"
        exportable
        @retrieve-result="onRetrieveResult"
    >
        <!-- Custom slot for fuel.fuel_name -->
        <template #fuel="{ item }">
            <div class="flex items-center gap-2">
                <AppFuel :fuel="item.fuel" size="sm" />
            </div>
        </template>

        <!-- Custom slot for createdBy -->
        <template #createdBy="{ item }">
            <div class="flex items-center gap-2">
                <span>
                    <AppAvatar :user="item.createdBy" size="md">
                        <template #title />
                        <template #subtitle />
                    </AppAvatar>
                </span>
            </div>
        </template>

        <!-- Custom slot for quantity_liter -->
        <template #quantity_liter="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.quantity_liter ? item.quantity_liter.toLocaleString() : '-' }} L
                </span>
            </div>
        </template>

        <!-- Custom slot for quantity_ton -->
        <template #quantity_ton="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.quantity_ton ? item.quantity_ton.toLocaleString() : '-' }} T
                </span>
            </div>
        </template>

        <!-- Custom slot for amount_ton -->
        <template #amount_ton="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.amount_ton ? item.amount_ton.toLocaleString() : '-' }} $ / Ton
                </span>
            </div>
        </template>

        <!-- Custom slot for amount_liter_us -->
        <template #amount_liter_us="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.amount_liter_us ? item.amount_liter_us.toLocaleString() : '-' }} $ / L
                </span>
            </div>
        </template>

        <!-- Custom slot for amount_liter_khr -->
        <template #amount_liter_khr="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.amount_liter_khr ? item.amount_liter_khr.toLocaleString() : '-' }} ៛ / L
                </span>
            </div>
        </template>

        <!-- Custom slot for exchange_rate -->
        <template #exchange_rate="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.exchange_rate ? item.exchange_rate.toLocaleString() : '-' }} ៛
                </span>
            </div>
        </template>

        <!-- Custom slot for total_amount_us -->
        <template #total_amount_us="{ item }">
            <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-white">
                    {{ item.total_amount_us ? item.total_amount_us.toLocaleString() : '-' }} $
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

        <template #dynamic-title-summary-bar>
            <!-- Dynamic Summary Title -->
            <div
                class="mt-4 p-4 rounded-xl border transition-all duration-300"
                :class="
                    hasActiveFilters
                        ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                        : 'bg-blue-50/30 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                "
            >
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 text-blue-600 dark:text-blue-400"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                        />
                    </svg>
                    {{ summaryTitle }}
                </h2>

                <!-- Active filters breakdown -->
                <div v-if="hasActiveFilters && activeFiltersList.length > 0" class="mt-2 space-y-1">
                    <div
                        v-for="(filter, index) in activeFiltersList"
                        :key="index"
                        class="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-4 h-4 mt-0.5 flex-shrink-0"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{{ filter }}</span>
                    </div>
                </div>

                <!-- No filters message -->
                <p v-else class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ t('fuel_sold.showing_all_data') }}
                </p>
            </div>
        </template>

        <template #summary-bar="{ totals }">
            <div
                v-if="totals"
                class="flex flex-wrap items-center gap-4 px-1 py-3 mt-2 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400"
            >
                <div class="flex items-center gap-1">
                    <span>{{ t('fuel_sold.total_quantity_liter') }}:</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                        {{ totals.quantity_liter.toLocaleString() }} L
                    </span>
                </div>
                <span class="text-gray-300 dark:text-gray-600">|</span>
                <div class="flex items-center gap-1">
                    <span>{{ t('fuel_sold.total_amount_us') }}:</span>
                    <span class="font-semibold text-gray-900 dark:text-white">
                        $ {{ totals.total_amount_us.toLocaleString() }}
                    </span>
                </div>
            </div>
        </template>
    </TablePaging>
</template>

<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue'
    import { initFlowbite } from 'flowbite'
    import { useI18n } from 'vue-i18n'
    import { fuel_stockService } from '@/modules/fuel-stock/services/api.service'
    import { useFuelStockStore } from '@/modules/fuel-stock/store/index'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { getFromCache } from '@/composables/useCache'
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import moment from 'moment'
    import { useRouter } from 'vue-router'
    import { useFormatDate } from '@/composables/useFormatDate'

    const { formatDate } = useFormatDate()
    const { t } = useI18n()
    const router = useRouter()
    const table_key = ref(0)
    const store = useFuelStockStore()
    const date_range = ref([])
    const fuels = ref<any[]>([])
    const fuel_type = ref('')
    const stationId = ref('')
    const params = ref<any>({})
    const filterParams = computed(() => params.value)
    const totals = ref(null)

    const onRetrieveResult = (result: any) => {
        totals.value = result.allData?.totals ?? null
    }

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

    const getRow = (item: any) => {
        router.push(`/fuel-stock/view/${item._id}`)
    }

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
        store.filters.fuel_type = fuel_type.value
        prepareFilterParams()
    }

    // Computed property for summary title
    const summaryTitle = computed(() => {
        if (hasActiveFilters.value) {
            return t('fuel_sold.filtered_summary')
        }
        return t('fuel_sold.total_summary')
    })

    // Check if any filters are active
    const hasActiveFilters = computed(() => {
        return !!(
            store.filters.search ||
            // store.filters.createdBy ||
            store.filters.fuel_type ||
            (date_range.value && date_range.value.length === 2)
        )
    })

    // Generate active filters as an array (breakdown line by line)
    const activeFiltersList = computed(() => {
        const filters: string[] = []

        if (store.filters.search) {
            filters.push(`${t('fuel_sold.search')}: "${store.filters.search}"`)
        }

        if (store.filters.fuel_type) {
            const fuel = fuels.value?.find(f => f._id === store.filters.fuel_type)
            if (fuel) {
                filters.push(`${t('fuel_sold.fuel_type')}: ${fuel.fuel_name}`)
            }
        }

        if (date_range.value && date_range.value.length === 2) {
            const [start, end] = date_range.value
            const startDate = new Date(start).toLocaleDateString()
            const endDate = new Date(end).toLocaleDateString()
            filters.push(`${t('fuel_sold.date_range')}: ${startDate} - ${endDate}`)
        }

        return filters
    })
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
