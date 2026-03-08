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

export const userService = {
    get: async () => {
        return axios.get('/auth/me')
    },
    update: async (id: string, payload: object) => {
        return axios.post(`user/update/${id}`, payload)
    },
    updatePassword: async (
        id: string,
        payload: { current_password: string; new_password: string; repeat_password: string },
    ) => {
        return axios.post(`user/update-password/${id}`, payload)
    },
    delete: async (id: string) => {
        return axios.post(`user/delete/${id}`)
    },
}
