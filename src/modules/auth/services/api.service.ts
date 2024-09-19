import axios from 'axios'

export const authService = {
  login: async (payload: object) => {
    return axios.post('auth/login', payload, { headers: { Authorization: null } })
  },
  logout: async () => {
    return axios.get('auth/logout')
  }
}
