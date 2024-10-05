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
    const saveFuelStock = async () => {
        await fuel_stockService.create(formData.value)
    }
    return {
        formData,
        saveFuelStock,
    }
})
