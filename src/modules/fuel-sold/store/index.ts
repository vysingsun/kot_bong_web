
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

class ReportFilters {
    date_range?: any
    fuel_type?: any
}

export const useFuelSoldStore = defineStore('fuelSoldStore', () => {
    const formData = ref(new FormData())
    const isCreatedSuccess = ref(true)
    const filterForm = ref<any>(new ReportFilters())
    const headers = ref([
        {
            text: 'Fuel Type',
            value: 'fuel_id.fuel_name',
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

    return {
        headers,
        formData,
        filterForm,
        // saveFuelSold,
        isCreatedSuccess,
        prepareFuelSoldParams
    }
})

        