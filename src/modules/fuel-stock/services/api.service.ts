import axios from 'axios'
import { getFromCache } from '@/composables/useCache'

const appData = getFromCache('app_data')
const stationId = appData.value.stations[0]._id
export const fuel_stockService = {
    get: async (params: object) => {
        return axios.get(`/fuel_stock/station/${stationId}`, { params })
    },
    create: async (payload: object) => {
        return axios.post('/fuel_stock/create', payload)
    },
}
