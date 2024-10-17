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
}

export const useFuelStockStore = defineStore('useFuelStockStore', () => {
    const formData = ref(new FormData())
    const isCreatedSuccess = ref(true)
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
    const saveFuelStock = async () => {
        const res = await fuel_stockService.create(formData.value)
        if (!res.data.success) {
            isCreatedSuccess.value = false
        }
    }
    return {
        headers,
        formData,
        saveFuelStock,
        isCreatedSuccess,
    }
})
