import axios from 'axios'
export interface CreateFuelPayload {
    fuel_name: string
    station_id: string
    coefficient_value: number
    color: string
    fuel_tank_size: number
}

export const stationService = {
    updateStation: async (stationId: string, data: { station_name?: string; owner?: string }) => {
        return axios.post(`/station/update/${stationId}`, data)
    },

    getCurrentStock: async (stationId: string) => {
        return axios.get(`/current_stock/station/${stationId}`)
    },

    updateFuelTankSizes: async (data: { id: string; fuel_tank_size: number }[]) => {
        return axios.post('/current_stock/updateFuelTankSizes', data)
    },

    createFuel: async (data: CreateFuelPayload) => {
        return axios.post('/fuel/create', data)
    },
    deleteFuel: async (fuelId: string) => {
        return axios.post(`/fuel/delete/${fuelId}`)
    },
}
