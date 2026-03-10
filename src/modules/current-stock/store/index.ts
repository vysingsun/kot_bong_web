import { defineStore } from 'pinia'
import type { ApexOptions } from 'apexcharts'

export const useCurrentStockStore = defineStore('current-stockStore', () => {
    const getChartOptions = (current_stock_liter: any, fuel_title: string, color: any): ApexOptions => {
        return {
            series: [current_stock_liter],
            colors: [color],
            chart: {
                height: '180px',
                width: '100%',
                type: 'radialBar' as const,
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    track: {
                        background: '#E5E7EB',
                    },
                    dataLabels: {
                        total: {
                            show: true,
                            label: fuel_title,
                            color: '#fff',
                            fontSize: '8px',
                        },
                        value: {
                            show: false,
                        },
                    },
                    hollow: {
                        margin: 0,
                        size: '35%',
                        background: '#293450',
                    },
                },
            },
            stroke: {
                lineCap: 'round' as const,
            },
        }
    }

    return {
        getChartOptions,
    }
})
