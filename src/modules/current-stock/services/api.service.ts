import axios from 'axios'
class ApiService {
    async getAll<T>(params?: object): Promise<T> {
        return axios.get('current_stock/all', params)
    }
    async read<T>(id: number): Promise<T> {
        return axios.get('current-stock/' + id)
    }
    async create<T>(formData: object): Promise<T> {
        return axios.post('current-stock', formData)
    }
    async update<T>(id: number, formData: object): Promise<T> {
        return axios.put('current-stock/' + id, formData)
    }

    async delete<T>(id: number): Promise<T> {
        return axios.delete('current-stock/' + id)
    }
}
export default new ApiService()
