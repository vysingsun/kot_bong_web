import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fuel_soldService } from '@/modules/fuel-sold/services/api.service'

interface Ifuel {
    _id: any
    fuel_name: string
    station_id: any
    coefficient_id: any
    createdAt: any
}

class FormData {
    fuel: any
    quantity_sold_liter?: number | null
    exchange_rate?: number | null
    amount_per_liter_khr?: number | null
    station_id: any
    fuel_old?: string | null
    createdAt: any
}

class ReportFilters {
    date_range?: any
    fuel_type?: any
}

export interface IFuelSold {
    _id: string
    fuel: {
        _id: string
        fuel_name: string
        color: string
        coefficient_value: number
    }
    quantity_sold_liter: number
    exchange_rate: number
    amount_per_liter_khr: number
    total_amount_us: number
    total_amount_khr: number
    station_id: string
    createdAt: string
    updatedAt: string
    createdBy?: {
        _id: string
        firstName: string
        lastName: string
    }
    updatedBy?: any
}

interface IFuelSoldFilters {
    search: string
    fuel_type: string
    createdBy: string
    date_from: string
    date_to: string
    page_number: number
    page_size: number
}

export const useFuelSoldStore = defineStore('fuelSoldStore', () => {
    const formData = ref(new FormData())
    const isCreatedSuccess = ref(true)
    const filterForm = ref<any>(new ReportFilters())
    const fuels = ref<any[]>([])

    const loading = ref(false)
    const fuelSales = ref<IFuelSold[]>([])

    const totalCount = ref(0)
    const totals = ref({
        quantity_liter: 0,
        total_amount_us: 0,
        total_amount_khr: 0,
    })

    const filters = ref<IFuelSoldFilters>({
        search: '',
        fuel_type: '',
        createdBy: '',
        date_from: '',
        date_to: '',
        page_number: 1,
        page_size: 10,
    })

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
            text: 'Quantity Sold Liter',
            value: 'quantity_sold_liter',
        },
        {
            text: 'Quantity Sold Ton',
            value: 'quantity_sold_ton',
        },
        {
            text: 'Amount per Liter (KHR)',
            value: 'amount_per_liter_khr',
        },
        {
            text: 'Amount per Liter (USD)',
            value: 'amount_per_liter_us',
        },
        {
            text: 'Exchange Rate',
            value: 'exchange_rate',
        },
        {
            text: 'Total Amount (KHR)',
            value: 'total_amount_khr',
        },
        {
            text: 'Total Amount (USD)',
            value: 'total_amount_us',
        },
        {
            text: 'Date',
            value: 'createdAt',
        },
    ])

    function prepareFuelSoldParams() {
        const params: any = {}
        const filter = filterForm.value
        if (filter.fuel_type) params['fuelId'] = filter.fuel_type

        if (filter.date_range) {
            params['start_date'] = filter.date_range?.start
            params['end_date'] = filter.date_range?.end
        }

        return params
    }

    const getFuelSales = async () => {
        try {
            loading.value = true

            const params: any = {
                page_number: filters.value.page_number,
                page_size: filters.value.page_size,
            }

            if (filters.value.search) {
                params.search = filters.value.search
            }

            if (filters.value.fuel_type) {
                params.fuelId = filters.value.fuel_type
            }

            if (filters.value.createdBy) {
                params.createdBy = filters.value.createdBy
            }

            if (filters.value.date_from) {
                params.start_date = filters.value.date_from
            }

            if (filters.value.date_to) {
                params.end_date = filters.value.date_to
            }

            const res = await fuel_soldService.getFuelSoldByStationId(params)

            if (res.data.success) {
                if (filters.value.page_number > 1) {
                    fuelSales.value = [...fuelSales.value, ...res.data.data]
                } else {
                    fuelSales.value = res.data.data
                }

                totalCount.value = res.data.count || 0
                totals.value = res.data.totals || {
                    quantity_sold_liter: 0,
                    total_amount_us: 0,
                    total_amount_khr: 0,
                }
            }
        } catch (error) {
            console.error('Error fetching fuel sales:', error)
        } finally {
            loading.value = false
        }
    }

    // Group by date
    const groupedByDate = computed(() => {
        const groups: Record<string, IFuelSold[]> = {}

        fuelSales.value.forEach(sale => {
            const date = new Date(sale.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })

            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(sale)
        })

        return groups
    })

    const deleteFuelSale = async (id: string) => {
        try {
            const res = await fuel_soldService.delete(id)
            return res.data.success
        } catch (error) {
            console.error('Error deleting fuel sale:', error)
            return false
        }
    }

    const resetFilters = () => {
        filters.value = {
            search: '',
            fuel_type: '',
            createdBy: '',
            date_from: '',
            date_to: '',
            page_number: 1,
            page_size: 10,
        }
    }

    const saveFuelSold = async () => {
        const res = await fuel_soldService.create(formData.value)
        if (!res.data.success) {
            isCreatedSuccess.value = false
        }
    }

    const resetData = () => {
        formData.value = new FormData()
        fuels.value = []
    }

    const readDataFromApi = async (id: any) => {
        const { data } = await fuel_soldService.get(id)
        readFuedSold(data.data)
        fuels.value = [data.data.fuel]
        formData.value.fuel = data.data.fuel._id
        formData.value.fuel_old = data.data.fuel._id
    }

    const readFuedSold = ({
        fuel = undefined,
        quantity_sold_liter = undefined,
        exchange_rate = undefined,
        amount_per_liter_khr = undefined,
        station_id = undefined,
        createdAt = undefined,
    }: Partial<FormData> = {}) => {
        formData.value = {
            fuel,
            quantity_sold_liter,
            exchange_rate,
            amount_per_liter_khr,
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
        saveFuelSold,
        readDataFromApi,
        isCreatedSuccess,
        prepareFuelSoldParams,

        totals,
        loading,
        filters,
        fuelSales,
        totalCount,
        getFuelSales,
        resetFilters,
        groupedByDate,
        deleteFuelSale,
    }
})
