import axios from 'axios'

export const current_stockService = {
    getCurrentStock: async (station_id: any, params?: object) => {
        return axios.get(`/current_stock/station/${station_id}`, { params })
    },
}
