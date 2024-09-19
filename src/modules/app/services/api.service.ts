
import axios from 'axios'
class ApiService {
    async getAll<T>(params?: object): Promise<T> {
        return axios.get('app', params)
    }
    async read<T>(id: number): Promise<T> {
         return axios.get('app/' + id)
    }
    async create<T>(formData: object): Promise<T> {
        return axios.post('app', formData)
    }
    async update<T>(id: number, formData: object): Promise<T> {
        return axios.put('app/' + id, formData)
    }

    async delete<T>(id: number): Promise<T> {
        return axios.delete('app/' + id)
    }
}
export default new ApiService()
        