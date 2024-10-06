import { defineStore } from 'pinia'
import { appService } from '@/modules/app/services/api.service'
import { getFromCache, setCache } from '@/composables/useCache'

export const useAppStore = defineStore('appStore', () => {
    const init = async () => {
        const appData = getFromCache('app_data')
        if (!appData) {
            await appService.init().then(res => {
                const result = res.data
                setCache('app_data', result.data)
            })
        }
    }
    return {
        init,
    }
})
