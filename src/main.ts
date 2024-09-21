import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// register Flowbite
import { initFlowbite } from 'flowbite'

import BaseLoading from './components/app/BaseLoading.vue'
import ShapeBgAnimate from './components/app/ShapeBgAnimate.vue'

// Axios default config
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

initFlowbite()
const app = createApp(App)
app.use(createPinia())
app.use(router)

app.component('BaseLoading', BaseLoading)
app.component('ShapeBgAnimate', ShapeBgAnimate)
app.mount('#app')
