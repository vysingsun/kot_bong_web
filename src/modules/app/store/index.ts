import { defineStore } from 'pinia'
import { appService } from '@/modules/app/services/api.service'

export const useAppStore = defineStore('appStore', () => {
    const init = async () => {
        await appService.init()
    }
    return {
        init,
    }
})
