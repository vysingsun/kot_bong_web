import axios from 'axios'

export const current_stockService = {
    getAll: async (params?: object) => {
        return axios.get('/current_stock/all', params)
    },
}
