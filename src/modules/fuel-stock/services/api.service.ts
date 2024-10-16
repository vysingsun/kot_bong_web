import axios from 'axios'

export const fuel_stockService = {
    get: async (params: object) => {
        return axios.get('/fuel_stock/all', { params })
    },
    create: async (payload: object) => {
        return axios.post('/fuel_stock/create', payload)
    },
}
