import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fuelService } from '@/modules/fuel/services/api.service'

export interface IFuel {
    _id: string
    fuel_name: string
    station_id: string
    coefficient_value: number
    color: string
    fuel_tank_size: number
    createdAt?: string
    updatedAt?: string
    current_stock?: IcurrentStock
}

export interface IcurrentStock {
    current_stock_liter: number
    current_stock_ton: number
    fuel_tank_size: number
}

export class FuelFormData {
    fuel_name: string = ''
    coefficient_value: number | null = null
    color: string = '#3b82f6'
    fuel_tank_size: number | null = null
    station_id: string = ''
}

export const useFuelStore = defineStore('fuelStore', () => {
    const formData = ref(new FuelFormData())
    const fuels = ref<IFuel[]>([])
    const isCreatedSuccess = ref(true)
    const loading = ref(false)

    const saveFuel = async () => {
        try {
            loading.value = true
            const payload = {
                fuel_name: formData.value.fuel_name,
                station_id: formData.value.station_id,
                coefficient_value: formData.value.coefficient_value,
                color: formData.value.color,
                fuel_tank_size: Number(formData.value.fuel_tank_size),
            }
            const res = await fuelService.create(payload)
            if (!res.data.success) {
                isCreatedSuccess.value = false
                return false
            }
            isCreatedSuccess.value = true
            return true
        } catch (error) {
            isCreatedSuccess.value = false
            return false
        } finally {
            loading.value = false
        }
    }

    const updateFuel = async (id: string) => {
        try {
            loading.value = true
            const res = await fuelService.edit(id, formData.value)

            if (!res.data.success) {
                return false
            }
            return true
        } catch (error) {
            return false
        } finally {
            loading.value = false
        }
    }

    const deleteFuel = async (id: string) => {
        try {
            const res = await fuelService.delete(id)
            return res.data.success
        } catch (error) {
            return false
        }
    }

    const getFuelsByStation = async (stationId: string) => {
        try {
            loading.value = true
            const res = await fuelService.getFuelByStationId(stationId)
            if (res.data.success) {
                fuels.value = res.data.data
            }
        } catch (error) {
            console.error('Error fetching fuels:', error)
        } finally {
            loading.value = false
        }
    }

    const readDataFromApi = async (id: string) => {
        try {
            const { data } = await fuelService.get(id)

            if (data.success) {
                readFuel(data.data)
            }
        } catch (error) {
            console.error('Error reading fuel:', error)
        }
    }

    const readFuel = (fuel: Partial<IFuel>) => {
        formData.value.fuel_name = fuel.fuel_name || ''
        formData.value.coefficient_value = fuel.coefficient_value || null
        formData.value.color = fuel.color || '#3b82f6'
        formData.value.fuel_tank_size = fuel.current_stock?.fuel_tank_size || fuel.fuel_tank_size || null
        formData.value.station_id = fuel.station_id || ''
    }

    const resetData = () => {
        formData.value = new FuelFormData()
        fuels.value = []
        isCreatedSuccess.value = true
    }

    return {
        formData,
        fuels,
        isCreatedSuccess,
        loading,
        saveFuel,
        updateFuel,
        deleteFuel,
        getFuelsByStation,
        readDataFromApi,
        readFuel,
        resetData,
    }
})
