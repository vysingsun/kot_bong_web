import axios from 'axios'

const xAxios = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const appService = {
    init: async () => {
        return xAxios.get('auth/me')
    },
}
