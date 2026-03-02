import axios from 'axios'
import { getFromCache } from '@/composables/useCache'

const appData = getFromCache('app_data')
const stationId = appData.value.stations[0]._id
export const fuel_soldService = {
    get: async (id: any) => {
        return axios.get(`fuel_sold/${id}`)
    },
    getFuelSoldByStationId: async (params: object) => {
        return axios.get(`fuel_sold/station/${stationId}`, { params })
    },
    create: async (paylaod: object) => {
        return axios.post('fuel_sold/create', paylaod)
    },
    edit: async (id: string, paylaod: object) => {
        return axios.post(`fuel_sold/update/${id}`, paylaod)
    },
    delete: async (id: any) => {
        return axios.post(`fuel_sold/delete/${id}`)
    },
}
