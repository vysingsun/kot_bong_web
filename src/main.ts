import './assets/main.css'

import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// register Flowbite
import { initFlowbite } from 'flowbite'

import BaseLoading from './components/app/BaseLoading.vue'
import ShapeBgAnimate from './components/app/ShapeBgAnimate.vue'
import { getFromCache, removeCaches } from '@/composables/useCache'

const getToken = () => {
    const token = getFromCache('token')?.value

    return token && `Bearer ${token}`
}
// Axios default config
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
const isUnauthorized = ref(false)
axios.interceptors.request.use(
    function (req) {
        if (req.url === 'login') isUnauthorized.value = false
        if (isUnauthorized.value) throw new Error('Unauthorized access detected. Further requests blocked.')

        const token = req.headers.has('Authorization') ? req.headers.Authorization : getToken()

        req.headers['Authorization'] = token

        return req
    },
    err => {
        return Promise.reject(err)
    },
)

axios.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        if (error.response.status === 401) {
            removeCaches(['token'])
            sessionStorage.removeItem('has-show-fireworks')
            router.push({ name: 'Login' })
            if (error?.response?.data?.error?.errors?.detail) {
                const message = error?.response?.data?.error?.errors?.detail
                alert(message ?? '!!!')
            }

            isUnauthorized.value = true
        } else {
            const errorResponse = error?.response?.data
            const message = errorResponse?.error?.form_errors?.[0] ?? errorResponse?.file?.[0]

            if (message) {
                alert(message)
            }
        }

        return Promise.reject(error)
    },
)

initFlowbite()
const app = createApp(App)
app.use(createPinia())
app.use(router)

app.component('BaseLoading', BaseLoading)
app.component('ShapeBgAnimate', ShapeBgAnimate)
app.mount('#app')
