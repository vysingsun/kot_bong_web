import axios from 'axios'

export interface StationUser {
    isSuspended: boolean
    suspendedAt: string | null
    _id: string
    firstName: string
    lastName: string
    phone: string
    role: string
    stations: string[]
    language: string
    isDeleted: boolean
    deletedAt: string | null
    registerBy: string
    createdAt: string
    updatedAt: string
    __v: number
    email: string
}

export interface Station {
    subscription: string | null
    _id: string
    station_name: string
    owner: string
    users: StationUser[]
    createdAt: string
    updatedAt: string
    __v: number
    currency: string
    isNozzle: boolean
}

export interface UpdateStationSettingsPayload {
    currency: string
    isNozzle: boolean
}

export const stationService = {
    getById: async (id: string) => {
        return axios.get<{ success: boolean; data: Station }>(`/station/${id}`)
    },

    updateSettings: async (id: string, payload: UpdateStationSettingsPayload) => {
        return axios.post<{ success: boolean; data: Station }>(`/station/update/${id}`, payload)
    },
}
