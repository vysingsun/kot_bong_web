import axios from 'axios'

export const fuelPriceEstimateService = {
    // ── Estimates ─────────────────────────────────────────────────────

    /** POST /api/fuel_price_estimate/create  (multipart/form-data) */
    create: async (formData: FormData) => {
        return axios.post('/fuel_price_estimate/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },

    /** GET /api/fuel_price_estimate/all?page=&limit= */
    getAll: async (params?: { page?: number; limit?: number }) => {
        return axios.get('/fuel_price_estimate/all', { params })
    },

    /** GET /api/fuel_price_estimate/:id */
    getById: async (id: string) => {
        return axios.get(`/fuel_price_estimate/${id}`)
    },

    /** POST /api/fuel_price_estimate/update/:id  (multipart/form-data) */
    update: async (id: string, formData: FormData) => {
        return axios.post(`/fuel_price_estimate/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },

    /** POST /api/fuel_price_estimate/delete/:id */
    delete: async (id: string) => {
        return axios.post(`/fuel_price_estimate/delete/${id}`)
    },

    // ── Comments ──────────────────────────────────────────────────────

    /** GET /api/fuel_price_estimate/:id/comments?page=&limit= */
    getComments: async (estimateId: string, params?: { page?: number; limit?: number }) => {
        return axios.get(`/fuel_price_estimate/${estimateId}/comments`, { params })
    },

    /** POST /api/fuel_price_estimate/:id/comments/create */
    addComment: async (estimateId: string, content: string) => {
        return axios.post(`/fuel_price_estimate/${estimateId}/comments/create`, { content })
    },

    /** POST /api/fuel_price_estimate/comments/update/:commentId */
    updateComment: async (commentId: string, content: string) => {
        return axios.post(`/fuel_price_estimate/comments/update/${commentId}`, { content })
    },

    /** POST /api/fuel_price_estimate/comments/delete/:commentId */
    deleteComment: async (commentId: string) => {
        return axios.post(`/fuel_price_estimate/comments/delete/${commentId}`)
    },
}
