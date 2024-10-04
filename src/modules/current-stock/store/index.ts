import { defineStore } from 'pinia'
export const useCurrentStockStore = defineStore('current-stockStore', () => {
    const getChartOptions = (current_stock_liter: any, fuel_title: string, color: any) => {
        return {
            series: [current_stock_liter],
            colors: [color],
            chart: {
                height: '180px',
                width: '100%',
                type: 'radialBar',
                color: '#000',
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
                            offsetY: 30,
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
                lineCap: 'round',
            },
        }
    }
    return {
        getChartOptions,
    }
})
