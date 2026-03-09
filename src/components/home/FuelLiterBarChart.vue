<template>
    <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <!-- Card Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M12 2L8 6H4v12h16V6h-4L12 2z" />
                        <path d="M8 14h8M8 10h8" />
                    </svg>
                </div>
                <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {{ t('fuel_sales_chart.volume_sold') }}
                    </p>
                    <h3 class="font-extrabold text-gray-900">
                        {{ t('fuel_sales_chart.quantity_liters') }}
                    </h3>
                </div>
            </div>
            <span
                v-if="data?.date?.label"
                class="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1"
            >
                {{ data.date.label }}
            </span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center h-[260px]">
            <svg class="animate-spin w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
        </div>

        <!-- No data -->
        <div v-else-if="!data" class="flex items-center justify-center h-[260px] text-gray-400 font-medium text-sm">
            {{ t('fuel_sales_chart.no_data') }}
        </div>

        <!-- Chart + Totals -->
        <template v-else>
            <apexchart type="bar" height="260" :options="chartOptions" :series="series" />

            <!-- Totals row -->
            <div class="border-t border-gray-100 pt-3 flex justify-between">
                <div class="flex flex-col gap-0.5 pr-4 border-r border-gray-100">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {{ t('fuel_sales_chart.total_liters') }}
                    </span>
                    <span class="font-extrabold text-gray-900 tabular-nums text-lg leading-tight">
                        {{ formatLiter(data.grand_totals.total_quantity_sold_liter) }}
                    </span>
                </div>
                <div class="flex flex-col gap-0.5 pl-4">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {{ t('fuel_sales_chart.total_revenue') }}
                    </span>
                    <span class="font-extrabold text-blue-600 tabular-nums text-lg leading-tight">
                        {{ formatKHR(data.grand_totals.total_amount_khr) }}
                    </span>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { useI18n } from 'vue-i18n'
    import VueApexCharts from 'vue3-apexcharts'

    const apexchart = VueApexCharts
    const { t } = useI18n()
    const formatKHR = (v: number) => `${(v / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}K ៛`

    // ── Types ─────────────────────────────────────────────────────────────────────
    interface FuelSale {
        fuel_id: string
        fuel_name: string
        fuel_color: string
        total_quantity_sold_liter: number
        total_amount_khr: number
        [key: string]: any
    }

    interface ApiResponse {
        success: boolean
        data: {
            date: { label: string; start: string; end: string }
            sales_by_fuel: FuelSale[]
            grand_totals: {
                total_quantity_sold_liter: number
                total_amount_khr: number
                [key: string]: any
            }
        }
    }

    // ── Props ─────────────────────────────────────────────────────────────────────
    const props = defineProps<{
        response: ApiResponse | null
        loading?: boolean
    }>()

    // ── Data ──────────────────────────────────────────────────────────────────────
    const data = computed(() => props.response?.data ?? null)
    const fuels = computed(() => data.value?.sales_by_fuel ?? [])

    // ── Formatter ─────────────────────────────────────────────────────────────────
    const formatLiter = (v: number) => `${v.toLocaleString('en-US', { maximumFractionDigits: 1 })} L`

    // ── Chart ─────────────────────────────────────────────────────────────────────
    const chartOptions = computed(() => ({
        chart: {
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: 'Kantumruy Pro, sans-serif',
        },
        plotOptions: {
            bar: { borderRadius: 6, columnWidth: '52%', distributed: true },
        },
        dataLabels: {
            enabled: true,
            formatter: (v: number) => `${v.toLocaleString()} L`,
            style: { fontSize: '11px', fontWeight: '700', colors: ['#fff'] },
            offsetY: -2,
            background: { enabled: false },
        },
        colors: fuels.value.map(f => f.fuel_color),
        xaxis: {
            categories: fuels.value.map(f => f.fuel_name),
            labels: { style: { colors: '#6b7280', fontSize: '12px', fontWeight: '600' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (v: number) => `${v.toLocaleString()} L`,
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
            y: { formatter: (v: number) => `${v.toLocaleString()} L` },
        },
    }))

    const series = computed(() => [
        {
            name: t('fuel_sales_chart.quantity_liters'),
            data: fuels.value.map(f => f.total_quantity_sold_liter),
        },
    ])
</script>
