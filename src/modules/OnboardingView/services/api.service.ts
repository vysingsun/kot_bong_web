import axios from 'axios'

export const stationService = {
    updateStation: async (stationId: string, data: { station_name: string }) => {
        return axios.post(`/station/update/${stationId}`, data)
    },

    getCurrentStock: async (stationId: string) => {
        return axios.get(`/current_stock/station/${stationId}`)
    },

    updateFuelTankSizes: async (data: { id: string; fuel_tank_size: number }[]) => {
        return axios.post('/current_stock/updateFuelTankSizes', data)
    },
}
