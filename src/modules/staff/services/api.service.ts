import axios from 'axios'
import { getFromCache } from '@/composables/useCache'

const appData = getFromCache('app_data')
const stationId = appData.value.stations[0]._id

export const staffService = {
    get: async (id: string) => {
        return axios.get(`staff/${id}`)
    },
    getStaffByStationId: async (params?: object) => {
        return axios.get(`staff/station/${stationId}`, { params })
    },
    create: async (payload: object) => {
        return axios.post('staff/create', payload)
    },
    edit: async (id: string, payload: object) => {
        return axios.post(`staff/update/${id}`, payload)
    },
    delete: async (id: string) => {
        return axios.post(`staff/delete/${id}`)
    },
}
