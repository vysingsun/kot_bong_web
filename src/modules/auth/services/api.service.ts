import axios from 'axios'
import { getFromCache } from '@/composables/useCache'

const getToken = () => {
    const token = getFromCache('token')?.value
    return token && `Bearer ${token}`
}

export const authService = {
    login: async (payload: object) => {
        return axios.post('auth/login', payload, { withCredentials: true })
    },
    logout: async () => {
        return axios.post(
            'auth/logout',
            {},
            {
                headers: {
                    Authorization: getToken(),
                },
            },
        )
    },
}
