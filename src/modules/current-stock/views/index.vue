<template>
    <BaseLoading v-if="loading" />
    <div class="w-full bg-gray-50 dark:bg-gray-900 p-4">
        <!-- Header -->
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {{ t('fuel_stock.title') }}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">
                        {{ store.totalCount }} {{ t('fuel_stock.records') }}
                    </p>
                </div>
                <button
                    @click="handleCreate"
                    class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg transition-colors shadow-md"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    {{ t('fuel_stock.add_stock') }}
                </button>
            </div>
        </div>

        <div
            v-for="(item, index) in fuelStocks"
            :key="item?._id"
            class="w-full md:mx-auto flex items-center px-2.5 justify-between max-w-sm bg-white border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700"
        >
            <div :id="'radial-chart-do-' + index" class="w-[120px] h-[120px] bg-inherit"></div>
            <div class="flex items-center mr-3">
                <div
                    class="text-xs font-semibold text-black bg-gray-300 bg-opacity-30 backdrop-blur-md backdrop-opacity-60 py-3 px-5 rounded-lg"
                >
                    {{ $t('total_stock') }} : {{ item?.current_stock_liter.toFixed(2) }} L
                </div>
            </div>
        </div>
    </div>

    <div class="md:mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 pb-4 px-4">
        <div class="flex-1 border-t border-gray-300 dark:border-gray-600 mb-3"></div>

        <div class="max-w-4xl mx-auto">
            <!-- Filters -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-3 border-t border-default">
                <button class="w-full flex items-center justify-between mb-4" @click="showFilters = !showFilters">
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                        {{ t('fuel_stock.filters') }}
                    </h3>
                    <button class="text-primary hover:text-primary-dark">
                        <svg
                            class="w-5 h-5 transition-transform"
                            :class="{ 'rotate-180': showFilters }"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </button>

                <transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('fuel_stock.search') }}
                            </label>
                            <input
                                v-model="store.filters.search"
                                type="text"
                                @input="handleSearch"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent"
                                :placeholder="t('fuel_stock.search_placeholder')"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('fuel_stock.fuel_type') }}
                            </label>
                            <select
                                v-model="store.filters.fuel_type"
                                @change="handleSearch"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent"
                            >
                                <option value="">{{ t('fuel_stock.all_fuels') }}</option>
                                <option v-for="fuel in fuels" :key="fuel._id" :value="fuel._id">
                                    {{ fuel.fuel_name }}
                                </option>
                            </select>
                        </div>

                        <div class="sm:col-span-2">
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
                        </div>

                        <div class="sm:col-span-2 flex justify-end">
                            <button
                                @click="handleResetFilters"
                                class="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                            >
                                {{ t('fuel_stock.reset_filters') }}
                            </button>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Grouped Stock List -->
            <div v-if="Object.keys(store.groupedByDate).length > 0" class="space-y-3 mb-5">
                <div v-for="(stocks, date) in store.groupedByDate" :key="date">
                    <div class="flex items-center gap-3">
                        <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-base font-bold text-gray-900 dark:text-white">{{ date }}</h2>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div
                            v-for="stock in stocks"
                            :key="stock._id"
                            @click="handleViewDetail(stock)"
                            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-700 p-4"
                        >
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                        class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        :style="{ backgroundColor: stock.fuel.color + '20' }"
                                    >
                                        <svg
                                            class="w-6 h-6"
                                            :style="{ color: stock.fuel.color }"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                        </svg>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h3 class="text-base font-bold text-gray-900 dark:text-white truncate">
                                            {{ stock.fuel.fuel_name }}
                                        </h3>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                                            {{ stock.supplier_name }}
                                        </p>
                                    </div>
                                </div>
                                <div class="text-right flex-shrink-0 ml-4">
                                    <div class="text-base font-bold text-[#149c49] dark:text-green-400">
                                        +{{ stock.quantity_liter.toLocaleString() }} L
                                    </div>
                                    <div class="text-xs text-blue-500 dark:text-blue-400">
                                        <span class="font-bold">{{ stock.amount_ton }}</span>
                                        {{ t('fuel_stock.dollar_ton') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center py-16">
                <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                        />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {{ t('fuel_stock.no_records') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                    {{ t('fuel_stock.no_records_desc') }}
                </p>
            </div>

            <!-- Load More -->
            <div v-if="hasMoreRecords" class="flex justify-center mb-6">
                <button
                    @click="loadMore"
                    :disabled="store.loading"
                    class="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span v-if="store.loading" class="flex items-center gap-2">
                        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        {{ t('fuel_stock.loading') }}
                    </span>
                    <span v-else>{{ t('fuel_stock.load_more') }}</span>
                </button>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-blue-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {{ t('fuel_stock.total_quantity_liter') }}
                            </p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                {{ store.totals.quantity_liter.toLocaleString() }} L
                            </p>
                        </div>
                        <div
                            class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
                        >
                            <svg
                                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-purple-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {{ t('fuel_stock.total_amount_us') }}
                            </p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                $ {{ formatCurrency(store.totals.total_amount_us) }}
                            </p>
                        </div>
                        <div
                            class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
                        >
                            <svg
                                class="w-6 h-6 text-purple-600 dark:text-purple-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                                />
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, nextTick, computed, onUnmounted } from 'vue'
    import { initFlowbite } from 'flowbite'
    import ApexCharts from 'apexcharts'
    import type { ApexOptions } from 'apexcharts'
    import { useCurrentStockStore } from '@/modules/current-stock/store'
    import { current_stockService } from '@/modules/current-stock/services/api.service'
    import { getFromCache } from '@/composables/useCache'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { useFuelStockStore } from '@/modules/fuel-stock/store'
    import type { IFuelStock, Ifuel } from '@/modules/fuel-stock/store'
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'

    const storeCurrentStock = useCurrentStockStore()
    const fuelStocks = ref<any[]>([])
    const loading = ref(false)
    const stationId = ref('')
    const router = useRouter()
    const { t } = useI18n()
    const store = useFuelStockStore()
    const fuels = ref<Ifuel[]>([])
    const showFilters = ref(false)
    const date_range = ref([])
    const chartInstances = ref<ApexCharts[]>([])

    // ── Chart options (moved from store into component) ───────────────────────
    const getChartOptions = (percent: number, fuelName: string, color: string): ApexOptions => {
        return {
            series: [percent],
            colors: [color],
            chart: {
                type: 'radialBar' as const,
                height: 120,
                width: 120,
                sparkline: { enabled: true },
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    track: {
                        background: '#e5e7eb',
                        strokeWidth: '97%',
                        margin: 2,
                    },
                    hollow: {
                        size: '55%',
                    },
                    dataLabels: {
                        name: {
                            show: true,
                            fontSize: '9px',
                            fontWeight: '700',
                            color: '#1f2937',
                            offsetY: 4,
                        },
                        value: {
                            show: false,
                        },
                    },
                },
            },
            stroke: {
                lineCap: 'round' as const,
            },
        }
    }

    // ── Render charts ─────────────────────────────────────────────────────────
    const renderCharts = async () => {
        chartInstances.value.forEach(c => c.destroy())
        chartInstances.value = []

        await nextTick()

        fuelStocks.value.forEach((item: any, index: number) => {
            const el = document.querySelector<HTMLElement>(`#radial-chart-do-${index}`)
            if (el) {
                const current_stock_as_percent = (100 * item?.current_stock_liter) / item?.fuel_tank_size
                const chart = new ApexCharts(
                    el,
                    storeCurrentStock.getChartOptions(
                        current_stock_as_percent,
                        item?.fuel?.fuel_name,
                        item?.fuel?.color,
                    ),
                )
                chart.render()
                chartInstances.value.push(chart)
            }
        })
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    onMounted(async () => {
        initFlowbite()
        const appData = getFromCache('app_data')

        if (appData?.value?.stations?.[0]?._id) {
            stationId.value = appData.value.stations[0]._id
            loading.value = true

            try {
                const [_, response] = await Promise.all([
                    store.getFuelStocks(),
                    current_stockService.getCurrentStock(stationId.value),
                ])
                const result = response?.data
                fuelStocks.value = result?.data ?? []
                fuels.value = result?.data?.map((item: IFuelStock) => item.fuel) ?? []
            } catch (e) {
                console.error(e)
            } finally {
                loading.value = false
            }

            await renderCharts()
        }
    })

    onUnmounted(() => {
        chartInstances.value.forEach(c => c.destroy())
    })

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleCreate = () => router.push('/current-stock/create')

    const handleViewDetail = (stock: IFuelStock) => router.push(`/current-stock/view/${stock._id}`)

    const handleSearch = async () => {
        store.filters.page_number = 1
        loading.value = true
        await store.getFuelStocks()
        loading.value = false
    }

    const onChangeDateRange = async (value: any) => {
        if (value?.[0] && value?.[1]) {
            store.filters.date_from = new Date(value[0]).toISOString().split('T')[0]
            store.filters.date_to = new Date(value[1]).toISOString().split('T')[0]
        } else {
            store.filters.date_from = ''
            store.filters.date_to = ''
        }
        await handleSearch()
    }

    const handleResetFilters = async () => {
        loading.value = true
        date_range.value = []
        store.resetFilters()
        await store.getFuelStocks()
        loading.value = false
    }

    const loadMore = async () => {
        store.filters.page_number++
        await store.getFuelStocks()
    }

    const hasMoreRecords = computed(() => store.fuelStocks.length < store.totalCount)

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
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
