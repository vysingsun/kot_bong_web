import axios from 'axios'
import type { FuelFormData } from '@/modules/fuel/store'

export interface CreateFuelPayload {
    fuel_name: string
    station_id: string
    coefficient_value: number
    color: string
    fuel_tank_size: number
}

export const fuelService = {
    create: async (data: FuelFormData | CreateFuelPayload) => {
        return axios.post('/fuel/create', data)
    },

    get: async (id: string) => {
        return axios.get(`/fuel/${id}`)
    },

    getFuelByStationId: async (stationId: string, params?: object) => {
        return axios.get(`/fuel/station/${stationId}`, { params })
    },

    edit: async (id: string, payload: Partial<FuelFormData>) => {
        return axios.post(`/fuel/update/${id}`, payload)
    },

    delete: async (fuelId: string) => {
        return axios.post(`/fuel/delete/${fuelId}`)
    },
}
