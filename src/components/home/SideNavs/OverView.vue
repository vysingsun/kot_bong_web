<template>
    <div class="bg-white border p-4">
        <!-- Header -->
        <h3 class="font-extrabold text-gray-900 text-lg">{{ t('fuel_sold_chart.title') }}</h3>

        <!-- Filter Bar -->
        <div class="flex flex-wrap items-end gap-3 my-4 p-4 border border-gray-200 rounded-2xl">
            <!-- Period Tabs -->
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {{ t('fuel_sold_chart.period') }}
                </label>
                <div class="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                    <button
                        v-for="p in periods"
                        :key="p.value"
                        @click="selectPeriod(p.value)"
                        :class="[
                            'px-3.5 py-1.5 text-sm font-semibold transition-colors',
                            filters.period === p.value
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50',
                        ]"
                    >
                        {{ t(`fuel_sold_chart.${p.value}`) }}
                    </button>
                </div>
            </div>

            <!-- Amount stepper -->
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {{ t('fuel_sold_chart.amount') }}
                </label>
                <div class="flex items-center gap-2">
                    <button
                        @click="changeAmount(-1)"
                        :disabled="filters.amount <= 1"
                        class="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 font-bold text-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        −
                    </button>
                    <span class="w-8 text-center font-extrabold text-gray-900 tabular-nums">{{ filters.amount }}</span>
                    <button
                        @click="changeAmount(1)"
                        class="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 font-bold text-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            <!-- Fuel Type -->
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {{ t('fuel_sold_chart.fuel_type') }}
                </label>
                <select
                    v-model="filters.fuel_type"
                    @change="fetchChartData"
                    class="px-3 py-1.5 text-sm font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    <option value="">{{ t('fuel_sold_chart.all_fuels') }}</option>
                    <option v-for="fuel in fuels" :key="fuel._id" :value="fuel._id">
                        {{ fuel.fuel_name }}
                    </option>
                </select>
            </div>

            <!-- Sale By -->
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {{ t('fuel_sold_chart.staff') }}
                </label>
                <select
                    v-model="filters.createdBy"
                    @change="fetchChartData"
                    class="px-3 py-1.5 text-sm font-semibold border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                    <option value="">{{ t('fuel_sold_chart.all_staff') }}</option>
                    <option v-for="staff in staffList" :key="staff._id" :value="staff._id">
                        {{ staff.name }}
                    </option>
                </select>
            </div>

            <!-- Date Range -->
            <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {{ t('fuel_sold_chart.custom_range') }}
                </label>
                <VueDatePicker
                    v-model="dateRange"
                    class="DatePicker"
                    range
                    auto-apply
                    :placeholder="t('fuel_sold_chart.date_range_placeholder')"
                    :partial-range="false"
                    :enable-time-picker="false"
                    @update:model-value="onChangeDateRange"
                />
            </div>

            <!-- Actions -->
            <div class="flex gap-2 ml-auto">
                <button
                    @click="resetFilters"
                    class="px-4 py-2 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    {{ t('fuel_sold_chart.reset') }}
                </button>
                <button
                    @click="fetchChartData"
                    :disabled="loading"
                    class="px-5 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                    <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {{ t('fuel_sold_chart.apply') }}
                </button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center h-[400px]">
            <svg class="animate-spin w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
        </div>

        <!-- No data -->
        <div v-else-if="!data" class="flex items-center justify-center h-[400px] text-gray-400 font-medium">
            {{ t('fuel_sold_chart.no_data') }}
        </div>

        <!-- Chart -->
        <template v-else>
            <!-- Metric toggle -->
            <div class="p-4 border border-gray-200 rounded-2xl">
                <div class="flex gap-2 mb-4">
                    <button
                        v-for="m in metrics"
                        :key="m.value"
                        @click="activeMetric = m.value"
                        :class="[
                            'px-3 py-1 text-xs font-bold rounded-lg border transition-colors',
                            activeMetric === m.value
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50',
                        ]"
                    >
                        {{ t(`fuel_sold_chart.${m.value}`) }}
                    </button>
                </div>

                <apexchart type="area" height="380" :options="chartOptions" :series="series" />

                <!-- Fuel legend pills -->
                <div class="flex flex-wrap gap-2">
                    <div
                        v-for="fuel in data.fuels"
                        :key="fuel.fuel_id"
                        class="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50"
                    >
                        <span
                            class="w-2.5 h-2.5 rounded-full shrink-0"
                            :style="{ backgroundColor: fuel.fuel_color }"
                        ></span>
                        <span class="text-xs font-semibold text-gray-700">{{ fuel.fuel_name }}</span>
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
    import { getFromCache } from '@/composables/useCache'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { staffService } from '@/modules/staff/services/api.service'

    const apexchart = VueApexCharts
    const { t } = useI18n()

    // ── Types ─────────────────────────────────────────────────────────────────────
    interface FuelEntry {
        quantity_liter: number
        quantity_ton: number
        amount_us: number
        amount_khr: number
        count: number
    }
    interface ChartDataPoint {
        date: string
        displayDate: string
        fuels: Record<string, FuelEntry>
    }
    interface FuelMeta {
        fuel_id: string
        fuel_name: string
        fuel_color: string
    }
    interface IFuel {
        _id: string
        fuel_name: string
    }
    interface ApiResponse {
        success: boolean
        data: {
            period: { start: string; end: string; groupBy: string }
            filters: { fuel_type: string | null; createdBy: string | null; isNozzle: string | null }
            chart_data: ChartDataPoint[]
            fuels: FuelMeta[]
            totals: {
                total_quantity_liter: number
                total_quantity_ton: number
                total_amount_us: number
                total_amount_khr: number
                total_records: number
            }
        }
    }

    // ── State ─────────────────────────────────────────────────────────────────────
    const loading = ref(false)
    const apiResponse = ref<ApiResponse | null>(null)
    const stationId = ref('')
    const fuels = ref<IFuel[]>([])
    const dateRange = ref<Date[] | null>(null)
    const metrics = [
        { value: 'quantity_liter' as const },
        { value: 'amount_us' as const },
        { value: 'amount_khr' as const },
    ]
    const activeMetric = ref<'quantity_liter' | 'amount_us' | 'amount_khr'>('quantity_liter')

    const periods = [{ value: 'day' }, { value: 'week' }, { value: 'month' }, { value: 'year' }]

    const staffList = ref<any[]>([])

    // update filters — remove isNozzle, add createdBy
    const filters = reactive({
        period: 'week',
        amount: 1,
        fuel_type: '',
        createdBy: '',
        startDate: '',
        endDate: '',
    })

    const fetchStaff = async () => {
        try {
            await staffService
                .getStaffByStationId()
                .then(res => res.data)
                .then(data => {
                    staffList.value = data.data.map((staff: any) => ({
                        _id: staff._id,
                        name: `${staff.firstName} ${staff.lastName}`,
                    }))
                })
        } catch (e) {
            console.error(e)
        }
    }

    // ── Computed ──────────────────────────────────────────────────────────────────
    const data = computed(() => apiResponse.value?.data ?? null)

    // ── Formatters ────────────────────────────────────────────────────────────────
    const formatLiter = (v: number) => `${v.toLocaleString('en-US', { maximumFractionDigits: 1 })} L`
    const formatUSD = (v: number) =>
        `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    const formatKHR = (v: number) => `${(v / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}K ៛`
    const formatDateRange = (start: string, end: string) => {
        const s = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const e = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        return `${s} – ${e}`
    }

    const metricFormatter = (v: number) => {
        if (activeMetric.value === 'quantity_liter') return formatLiter(v)
        if (activeMetric.value === 'amount_us') return formatUSD(v)
        return formatKHR(v)
    }

    // ── Chart ─────────────────────────────────────────────────────────────────────
    const series = computed(() => {
        if (!data.value) return []
        return data.value.fuels.map(fuel => ({
            name: fuel.fuel_name,
            color: fuel.fuel_color,
            data: data.value!.chart_data.map(point => ({
                x: point.displayDate,
                y: point.fuels[fuel.fuel_id]?.[activeMetric.value] ?? 0,
            })),
        }))
    })

    const chartOptions = computed(() => ({
        chart: {
            type: 'area' as const,
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: 'Kantumruy Pro, sans-serif',
            zoom: { enabled: false },
        },
        colors: data.value?.fuels.map(f => f.fuel_color) ?? [],
        stroke: { curve: 'smooth' as const, width: 2.5 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 100],
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            type: 'category' as const,
            labels: { style: { colors: '#6b7280', fontSize: '12px', fontWeight: '600' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: metricFormatter,
                style: { colors: '#9ca3af', fontSize: '11px' },
            },
        },
        grid: {
            borderColor: '#f3f4f6',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
        },
        legend: { show: false },
        tooltip: {
            theme: 'light',
            y: { formatter: metricFormatter },
        },
    }))

    // ── Filter handlers ───────────────────────────────────────────────────────────
    const selectPeriod = (p: string) => {
        filters.period = p
        filters.startDate = ''
        filters.endDate = ''
        dateRange.value = null
        fetchChartData()
    }

    const changeAmount = (delta: number) => {
        filters.amount = Math.max(1, filters.amount + delta)
    }

    const onChangeDateRange = (val: Date[] | null) => {
        if (val && val.length === 2) {
            filters.startDate = val[0].toISOString().split('T')[0]
            filters.endDate = val[1].toISOString().split('T')[0]
            filters.period = ''
            fetchChartData()
        }
    }

    const resetFilters = () => {
        filters.period = 'week'
        filters.amount = 1
        filters.fuel_type = ''
        filters.createdBy = ''
        filters.startDate = ''
        filters.endDate = ''
        dateRange.value = null
        fetchChartData()
    }

    // ── Fetch ─────────────────────────────────────────────────────────────────────
    const fetchChartData = async () => {
        if (!stationId.value) return
        loading.value = true
        try {
            const params: Record<string, any> = {}
            if (filters.startDate && filters.endDate) {
                params.startDate = filters.startDate
                params.endDate = filters.endDate
            } else {
                params.period = filters.period
                params.amount = filters.amount
            }
            if (filters.fuel_type) params.fuel_type = filters.fuel_type
            if (filters.createdBy) params.createdBy = filters.createdBy

            const response = await lookupService.getFuelSoldsAreaChart(stationId.value, params)
            apiResponse.value = response.data
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const fetchFuels = async () => {
        try {
            const response = await lookupService.getFuelByStationId(stationId.value)
            fuels.value = response?.data?.data ?? []
        } catch (e) {
            console.error(e)
        }
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────────
    onMounted(async () => {
        const appData = getFromCache('app_data')
        stationId.value = appData?.value?.stations?.[0]?._id ?? ''
        if (stationId.value) {
            await Promise.all([fetchFuels(), fetchStaff(), fetchChartData()])
        }
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
