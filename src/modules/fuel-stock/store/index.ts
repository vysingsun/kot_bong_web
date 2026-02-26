import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fuel_stockService } from '../services/api.service'
interface Ifuel {
    _id: any
    fuel_name: string
    station_id: any
    coefficient_id: any
    createdAt: any
}
class FormData {
    _id: any
    fuel?: Ifuel
    quantity_ton?: number | null
    quantity_liter?: number | null
    amount_ton?: number | null
    amount_liter_us?: number | null
    amount_liter_khr?: number | null
    supplier_name?: string
    exchange_rate?: number | null
    total_amount_us?: number | null
    station_id: any
    createdAt: any
    fuel_old?: string | null
}

class ReportFilters {
    date_range?: any
    fuel_type?: any
}

export interface IFuelStock {
    _id: string
    fuel: {
        _id: string
        fuel_name: string
        color: string
        coefficient_value: number
    }
    quantity_ton: number
    quantity_liter: number
    amount_ton: number
    amount_liter_us: number
    amount_liter_khr: number
    supplier_name: string
    exchange_rate: number
    total_amount_us: number
    station_id: string
    createdAt: string
    updatedAt: string
    createdBy?: any
    updatedBy?: any
}
export interface IFuelStockFilters {
    search: string
    fuel_type: string
    date_from: string
    date_to: string
    page_number: number
    page_size: number
}

export const useFuelStockStore = defineStore('useFuelStockStore', () => {
    const formData = ref(new FormData())
    const isCreatedSuccess = ref(true)
    const filterForm = ref<any>(new ReportFilters())
    const fuels = ref<any[]>([])

    const fuelStocks = ref<IFuelStock[]>([])
    const loading = ref(false)
    const totalCount = ref(0)
    const totals = ref({
        quantity_liter: 0,
        quantity_ton: 0,
        total_amount_us: 0,
    })

    const filters = ref<IFuelStockFilters>({
        search: '',
        fuel_type: '',
        date_from: '',
        date_to: '',
        page_number: 1,
        page_size: 10,
    })

    // Group fuel stocks by date
    const groupedByDate = computed(() => {
        const groups: Record<string, IFuelStock[]> = {}

        fuelStocks.value.forEach(stock => {
            const date = new Date(stock.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })

            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(stock)
        })

        return groups
    })

    const getFuelStocks = async () => {
        try {
            loading.value = true

            const params: any = {
                page_number: filters.value.page_number,
                page_size: filters.value.page_size,
            }

            // Only add params if they have values
            if (filters.value.search) {
                params.search = filters.value.search
            }

            if (filters.value.fuel_type) {
                params.fuelId = filters.value.fuel_type
            }

            if (filters.value.date_from) {
                params.start_date = filters.value.date_from
            }

            if (filters.value.date_to) {
                params.end_date = filters.value.date_to
            }

            const res = await fuel_stockService.getFuelStocksByStation(params)

            if (res.data.success) {
                // If loading more (page > 1), append to existing data
                if (filters.value.page_number > 1) {
                    fuelStocks.value = [...fuelStocks.value, ...res.data.data]
                } else {
                    // First page, replace all data
                    fuelStocks.value = res.data.data
                }

                totalCount.value = res.data.count
                totals.value = res.data.totals
            }
        } catch (error) {
            console.error('Error fetching fuel stocks:', error)
        } finally {
            loading.value = false
        }
    }

    const deleteFuelStock = async (id: string) => {
        try {
            const res = await fuel_stockService.delete(id)
            return res.data.success
        } catch (error) {
            console.error('Error deleting fuel stock:', error)
            return false
        }
    }

    const resetFilters = () => {
        filters.value = {
            search: '',
            fuel_type: '',
            date_from: '',
            date_to: '',
            page_number: 1,
            page_size: 10,
        }
    }

    const headers = ref([
        {
            text: 'Fuel Type',
            value: 'fuel.fuel_name',
        },
        {
            text: 'Created By',
            value: 'createdBy',
        },
        {
            text: 'Quantity In Liter',
            value: 'quantity_liter',
        },
        {
            text: 'Quantity In Ton',
            value: 'quantity_ton',
        },
        {
            text: 'Amount In Ton',
            value: 'amount_ton',
        },
        {
            text: 'Amount Per liter USD',
            value: 'amount_liter_us',
        },
        {
            text: 'Amount Per liter KHR',
            value: 'amount_liter_khr',
        },
        {
            text: 'Exchange Rate',
            value: 'exchange_rate',
        },
        {
            text: 'Total Amount USD',
            value: 'total_amount_us',
        },
        {
            text: 'From',
            value: 'supplier_name',
        },
        {
            text: 'Date',
            value: 'createdAt',
        },
    ])

    function prepareFuelStockParams() {
        const params: any = {}
        const filter = filterForm.value
        if (filter.fuel_type) params['fuelId'] = filter.fuel_type

        if (filter.date_range) {
            params['start_date'] = filter.date_range?.start
            params['end_date'] = filter.date_range?.end
        }

        return params
    }

    const saveFuelStock = async () => {
        const res = await fuel_stockService.create(formData.value)
        if (!res.data.success) {
            isCreatedSuccess.value = false
        }
    }

    const resetData = () => {
        formData.value = new FormData()
        fuels.value = []
    }

    const readDataFromApi = async (id: any) => {
        const { data } = await fuel_stockService.get(id)
        readFuedStock(data.data)
        fuels.value = [data.data.fuel]
        formData.value.fuel = data.data.fuel._id
        formData.value.fuel_old = data.data.fuel._id
    }

    const readFuedStock = ({
        _id = undefined,
        fuel = undefined,
        quantity_ton = undefined,
        quantity_liter = undefined,
        amount_ton = undefined,
        amount_liter_us = undefined,
        amount_liter_khr = undefined,
        supplier_name = undefined,
        exchange_rate = undefined,
        total_amount_us = undefined,
        station_id = undefined,
        createdAt = undefined,
    }: Partial<FormData> = {}) => {
        formData.value = {
            _id,
            fuel,
            quantity_ton,
            quantity_liter,
            amount_ton,
            amount_liter_us,
            amount_liter_khr,
            supplier_name,
            exchange_rate,
            total_amount_us,
            station_id,
            createdAt,
        }
    }
    return {
        fuels,
        headers,
        formData,
        resetData,
        filterForm,
        saveFuelStock,
        readDataFromApi,
        isCreatedSuccess,
        prepareFuelStockParams,

        fuelStocks,
        loading,
        totalCount,
        totals,
        filters,
        groupedByDate,
        getFuelStocks,
        deleteFuelStock,
        resetFilters,
    }
})
