import type { StationUser, Subscription } from '@/modules/payment/services/api.service'
import axios from 'axios'

export interface Station {
    _id: string
    station_name: string
    owner: string
    users: StationUser[]
    subscription: Subscription
    createdAt: string
    updatedAt: string
}

export const lookupService = {
    getFuelByStationId: async (params: string) => {
        return axios.get(`/fuel/station/${params}`)
    },
    getRoles: async () => {
        return axios.get('/role/all')
    },
    getFuelSales: async (stationId: string, params?: any) => {
        return axios.get(`/fuel_sold/station/${stationId}/sales`, { params })
    },
    getStationById: async (id: string) => {
        return axios.get<{ success: boolean; data: Station }>(`/station/${id}`)
    },
}
