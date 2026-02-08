import { defineStore } from 'pinia'
import { appService } from '@/modules/app/services/api.service'
import { getFromCache, setCache } from '@/composables/useCache'
import { ref } from 'vue'
export const useAppStore = defineStore('appStore', () => {
    const loading = ref(false)
    const init = async () => {
        const appData = getFromCache('app_data')
        if (!appData) {
            loading.value = true
            await appService.init().then(res => {
                const result = res.data
                setCache('app_data', result.data)
            })
            loading.value = false
        }
    }
    return {
        init,
        loading,
    }
})
