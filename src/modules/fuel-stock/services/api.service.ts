import axios from 'axios'

export const fuel_stockService = {
    create: async (payload: object) => {
        return axios.post('/fuel_stock/create', payload)
    },
}
