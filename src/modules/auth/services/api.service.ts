import axios from 'axios'

export const authService = {
    login: async (payload: object) => {
        return axios.post('auth/login', payload, { withCredentials: true })
    },
    logout: async () => {
        return axios.post('auth/logout')
    },
}
