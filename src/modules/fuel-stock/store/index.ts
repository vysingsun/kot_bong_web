import { defineStore } from 'pinia'
import { ref } from 'vue'
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
    fuel_id?: Ifuel
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
    fuel_id_old?: string | null
}

class ReportFilters {
    date_range?: any
    fuel_type?: any
}

export const useFuelStockStore = defineStore('useFuelStockStore', () => {
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
        fuels.value = [data.data.fuel_id]
        formData.value.fuel_id = data.data.fuel_id._id
        formData.value.fuel_id_old = data.data.fuel_id._id
    }

    const readFuedStock = ({
        _id = undefined,
        fuel_id = undefined,
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
            fuel_id,
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
    }
})
