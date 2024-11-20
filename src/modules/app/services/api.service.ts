import axios from 'axios'
import { getFromCache } from '@/composables/useCache'

const getToken = () => {
    const token = getFromCache('token')?.value

    return token && `Bearer ${token}`
}
const xAxios = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const appService = {
    init: async () => {
        return xAxios.get('auth/me', {
            headers: {
                Authorization: getToken(),
            },
        })
    },
}
