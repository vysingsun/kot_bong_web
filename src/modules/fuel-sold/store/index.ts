import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fuel_soldService } from '@/modules/fuel-sold/services/api.service'

interface Ifuel {
    _id: any
    fuel_name: string
    station_id: any
    coefficient_id: any
    createdAt: any
}

class FormData {
    fuel_id: any
    quantity_sold_liter?: number | null
    exchange_rate?: number | null
    amount_per_liter_khr?: number | null
    station_id: any
    fuel_id_old?: string | null
    createdAt: any
}

class ReportFilters {
    date_range?: any
    fuel_type?: any
}

export const useFuelSoldStore = defineStore('fuelSoldStore', () => {
    const formData = ref(new FormData())
    const isCreatedSuccess = ref(true)
    const filterForm = ref<any>(new ReportFilters())
    const fuels = ref<any[]>([])
    const headers = ref([
        {
            text: 'Fuel Type',
            value: 'fuel_id.fuel_name',
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
        fuels.value = [data.data.fuel_id]
        formData.value.fuel_id = data.data.fuel_id._id
        formData.value.fuel_id_old = data.data.fuel_id._id
    }

    const readFuedSold = ({
        fuel_id = undefined,
        quantity_sold_liter = undefined,
        exchange_rate = undefined,
        amount_per_liter_khr = undefined,
        station_id = undefined,
        createdAt = undefined,
    }: Partial<FormData> = {}) => {
        formData.value = {
            fuel_id,
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
    }
})
