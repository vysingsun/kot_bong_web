import axios from 'axios'

export const lookupService = {
    getFuelByStationId: async (params: string) => {
        return axios.get(`/fuel/station/${params}`)
    },
}
