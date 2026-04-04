<template>
    <div class="p-4 bg-gray-50 min-h-screen">
        <!-- Header -->
        <div class="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div>
                <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
                    {{ t('fuel_stock_chart.title') }}
                </h1>
                <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {{ data?.date?.label || t('fuel_stock_chart.title') }}
                </p>
            </div>
            <div class="flex flex-wrap gap-2" v-if="data">
                <div class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {{ t('fuel_stock_chart.total_liters') }}
                    </p>
                    <p class="text-lg font-extrabold text-gray-900 tabular-nums">
                        {{ formatLiter(data.grand_totals.total_quantity_liter) }}
                    </p>
                </div>
                <div class="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                        {{ t('fuel_stock_chart.total_amount_us') }}
                    </p>
                    <p class="text-lg font-extrabold text-blue-700 tabular-nums">
                        {{ formatUSD(data.grand_totals.total_amount_us) }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white border border-gray-200 rounded-2xl p-4 mb-5 shadow-sm flex flex-wrap items-end gap-4">
            <!-- Period Tabs -->
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {{ t('fuel_stock_chart.period') }}
                </label>
                <div class="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                    <button
                        v-for="p in periods"
                        :key="p.value"
                        @click="selectPeriod(p.value)"
                        :class="[
                            'px-3.5 py-1.5 text-sm font-semibold transition-colors',
                            filter.mode === 'period' && filter.period === p.value
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50',
                        ]"
                    >
                        {{ t(`fuel_stock_chart.${p.value}`) }}
                    </button>
                </div>
            </div>

            <!-- Amount stepper -->
            <div v-if="filter.mode === 'period'" class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {{ t('fuel_stock_chart.amount') }}
                </label>
                <div class="flex items-center gap-2">
                    <button
                        @click="changeAmount(-1)"
                        :disabled="filter.amount <= 1"
                        class="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 font-bold text-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        −
                    </button>
                    <span class="w-8 text-center font-extrabold text-gray-900 tabular-nums">{{ filter.amount }}</span>
                    <button
                        @click="changeAmount(1)"
                        class="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 font-bold text-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            <!-- Date range picker -->
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {{ t('fuel_stock_chart.custom_range') }}
                </label>
                <VueDatePicker
                    v-model="dateRange"
                    class="DatePicker"
                    range
                    auto-apply
                    :placeholder="t('fuel_stock_chart.date_range_placeholder')"
                    :partial-range="false"
                    :enable-time-picker="false"
                    @update:model-value="onChangeDateRange"
                />
            </div>

            <!-- Actions -->
            <div class="flex gap-2 ml-auto">
                <button
                    @click="resetFilter"
                    class="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                    {{ t('fuel_stock_chart.reset') }}
                </button>
                <button
                    @click="applyFilter"
                    :disabled="loading"
                    class="px-5 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {{ t('fuel_stock_chart.apply') }}
                </button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <svg class="animate-spin w-8 h-8 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p class="text-gray-400 font-medium">{{ t('fuel_stock_chart.loading') }}</p>
        </div>

        <!-- No data -->
        <div v-else-if="!data" class="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <p class="text-gray-400 font-medium">{{ t('fuel_stock_chart.no_data') }}</p>
        </div>

        <!-- Charts -->
        <template v-else>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <!-- Liter Bar -->
                <div
                    class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div class="flex items-center gap-3 mb-4">
                        <div
                            class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                {{ t('fuel_stock_chart.volume_stocked') }}
                            </p>
                            <h3 class="font-extrabold text-gray-900">{{ t('fuel_stock_chart.quantity_liters') }}</h3>
                        </div>
                    </div>
                    <apexchart type="bar" height="260" :options="literChartOptions" :series="literSeries" />
                </div>

                <!-- USD Bar -->
                <div
                    class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div class="flex items-center gap-3 mb-4">
                        <div
                            class="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-500 shrink-0"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12h8M12 8v8" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                {{ t('fuel_stock_chart.amount_spent') }}
                            </p>
                            <h3 class="font-extrabold text-gray-900">{{ t('fuel_stock_chart.amount_usd') }}</h3>
                        </div>
                    </div>
                    <apexchart type="bar" height="260" :options="usdChartOptions" :series="usdSeries" />
                </div>

                <!-- Donut Liter -->
                <div
                    class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div class="flex items-center gap-3 mb-4">
                        <div
                            class="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500 shrink-0"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="4" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                {{ t('fuel_stock_chart.distribution') }}
                            </p>
                            <h3 class="font-extrabold text-gray-900">{{ t('fuel_stock_chart.liter_share') }}</h3>
                        </div>
                    </div>
                    <apexchart type="donut" height="240" :options="donutLiterOptions" :series="donutLiterSeries" />
                </div>

                <!-- Donut USD -->
                <div
                    class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div class="flex items-center gap-3 mb-4">
                        <div
                            class="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="4" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                {{ t('fuel_stock_chart.distribution') }}
                            </p>
                            <h3 class="font-extrabold text-gray-900">{{ t('fuel_stock_chart.amount_share') }}</h3>
                        </div>
                    </div>
                    <apexchart type="donut" height="240" :options="donutUsdOptions" :series="donutUsdSeries" />
                </div>
            </div>

            <!-- Fuel Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                    v-for="fuel in data.stocks_by_fuel"
                    :key="fuel.fuel_id"
                    class="bg-white border border-gray-200 rounded-xl overflow-hidden flex hover:shadow-md transition-shadow"
                    :style="{ '--fuel-color': fuel.fuel_color }"
                >
                    <div class="w-1.5 shrink-0" :style="{ backgroundColor: fuel.fuel_color }"></div>
                    <div class="p-4 flex-1">
                        <p class="font-extrabold text-gray-900 text-base tracking-tight">{{ fuel.fuel_name }}</p>
                        <div class="flex items-center gap-4 mt-2">
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {{ t('fuel_stock_chart.liters') }}
                                </p>
                                <p class="font-bold text-gray-700 tabular-nums">
                                    {{ formatLiter(fuel.total_quantity_liter) }}
                                </p>
                            </div>
                            <div class="w-px h-7 bg-gray-100"></div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {{ t('fuel_stock_chart.usd') }}
                                </p>
                                <p class="font-bold text-gray-700 tabular-nums">
                                    {{ formatUSD(fuel.total_amount_us) }}
                                </p>
                            </div>
                            <div class="w-px h-7 bg-gray-100"></div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {{ t('fuel_stock_chart.records') }}
                                </p>
                                <p class="font-bold text-gray-700 tabular-nums">{{ fuel.record_count }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, reactive, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'
    import VueApexCharts from 'vue3-apexcharts'
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'

    const apexchart = VueApexCharts
    const { t } = useI18n()

    // ── Types ─────────────────────────────────────────────────────────────────────
    interface FuelStock {
        fuel_id: string
        fuel_name: string
        fuel_color: string
        coefficient_value: number
        total_quantity_ton: number
        total_quantity_liter: number
        total_amount_us: number
        avg_amount_per_ton: number
        avg_amount_per_liter_us: number
        avg_amount_per_liter_khr: number
        record_count: number
        latest_exchange_rate: number
        suppliers: string[]
    }

    interface ApiResponse {
        success: boolean
        data: {
            date: { label: string; start: string; end: string }
            stocks_by_fuel: FuelStock[]
            grand_totals: {
                total_quantity_ton: number
                total_quantity_liter: number
                total_amount_us: number
                total_records: number
            }
        }
    }

    // ── Props & Emits ─────────────────────────────────────────────────────────────
    const props = defineProps<{ response: ApiResponse | null; loading?: boolean }>()
    const emit = defineEmits<{ (e: 'fetch', params: Record<string, string>): void }>()

    // ── Filter state ──────────────────────────────────────────────────────────────
    const periods = [{ value: 'day' }, { value: 'week' }, { value: 'month' }, { value: 'year' }]

    const filter = reactive({
        mode: 'period' as 'none' | 'period' | 'range',
        period: 'week',
        amount: 1,
    })

    const dateRange = ref<Date[] | null>(null)

    onMounted(async () => {
        emit('fetch', { period: 'week', amount: '1' })
    })

    const selectPeriod = (p: string) => {
        filter.mode = 'period'
        filter.period = p
        dateRange.value = null
    }

    const changeAmount = (delta: number) => {
        filter.amount = Math.max(1, filter.amount + delta)
    }

    const onChangeDateRange = (val: Date[] | null) => {
        if (val && val.length === 2) filter.mode = 'range'
    }

    const applyFilter = () => {
        const params: Record<string, string> = {}
        if (filter.mode === 'period') {
            params.period = filter.period
            params.amount = String(filter.amount)
        } else if (filter.mode === 'range' && dateRange.value?.length === 2) {
            params.startDate = dateRange.value[0].toISOString().split('T')[0]
            params.endDate = dateRange.value[1].toISOString().split('T')[0]
        }
        emit('fetch', params)
    }

    const resetFilter = () => {
        filter.mode = 'none'
        filter.period = 'day'
        filter.amount = 1
        dateRange.value = null
        emit('fetch', {})
    }

    // ── Data ──────────────────────────────────────────────────────────────────────
    const data = computed(() => props.response?.data ?? null)
    const fuels = computed(() => data.value?.stocks_by_fuel ?? [])
    const fuelNames = computed(() => fuels.value.map(f => f.fuel_name))
    const fuelColors = computed(() => fuels.value.map(f => f.fuel_color))

    // ── Formatters ────────────────────────────────────────────────────────────────
    const formatLiter = (v: number) => `${v.toLocaleString('en-US', { maximumFractionDigits: 1 })} L`
    const formatUSD = (v: number) =>
        `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    // ── Charts ────────────────────────────────────────────────────────────────────
    const baseBar = (colors: string[], yFormatter: (v: number) => string) => ({
        chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Kantumruy Pro, sans-serif' },
        plotOptions: { bar: { borderRadius: 6, columnWidth: '52%', distributed: true } },
        dataLabels: {
            enabled: true,
            formatter: yFormatter,
            style: { fontSize: '11px', fontWeight: '700', colors: ['#fff'] },
            offsetY: -2,
            background: { enabled: false },
        },
        colors,
        xaxis: {
            categories: fuelNames.value,
            labels: { style: { colors: '#6b7280', fontSize: '12px', fontWeight: '600' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { labels: { formatter: yFormatter, style: { colors: '#9ca3af', fontSize: '11px' } } },
        grid: { borderColor: '#f3f4f6', strokeDashArray: 4, xaxis: { lines: { show: false } } },
        legend: { show: false },
        tooltip: { theme: 'light', y: { formatter: yFormatter } },
    })

    const literChartOptions = computed(() => baseBar(fuelColors.value, (v: number) => `${v.toLocaleString()} L`))
    const literSeries = computed(() => [
        { name: t('fuel_stock_chart.quantity_liters'), data: fuels.value.map(f => f.total_quantity_liter) },
    ])

    const usdChartOptions = computed(() => baseBar(fuelColors.value, (v: number) => `$${(v / 1000).toFixed(1)}K`))
    const usdSeries = computed(() => [
        { name: t('fuel_stock_chart.amount_usd'), data: fuels.value.map(f => f.total_amount_us) },
    ])

    const baseDonut = (colors: string[], formatter: (v: number) => string) => ({
        chart: { background: 'transparent', fontFamily: 'Kantumruy Pro, sans-serif' },
        colors,
        labels: fuelNames.value,
        dataLabels: { enabled: false },
        legend: { position: 'bottom' as const, labels: { colors: '#6b7280' }, fontSize: '13px' },
        plotOptions: {
            pie: {
                donut: {
                    size: '68%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#9ca3af',
                            fontSize: '13px',
                            formatter: (w: { globals: { seriesTotals: number[] } }) =>
                                formatter(w.globals.seriesTotals.reduce((a, b) => a + b, 0)),
                        },
                    },
                },
            },
        },
        stroke: { width: 3, colors: ['#ffffff'] },
        tooltip: { theme: 'light', y: { formatter } },
    })

    const donutLiterOptions = computed(() => baseDonut(fuelColors.value, (v: number) => `${v.toLocaleString()} L`))
    const donutLiterSeries = computed(() => fuels.value.map(f => f.total_quantity_liter))
    const donutUsdOptions = computed(() => baseDonut(fuelColors.value, (v: number) => `$${(v / 1000).toFixed(1)}K`))
    const donutUsdSeries = computed(() => fuels.value.map(f => f.total_amount_us))
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
