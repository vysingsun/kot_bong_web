import { defineStore } from 'pinia'
import { appService } from '@/modules/app/services/api.service'
import router from '@/router'


export const useAppStore = defineStore('appStore', () => {
    const init = async() => {
        await appService.init().then(res => {
            console.log(res)
            if (res.data.success) {
                return
            } else {
                router.push('/auth/login')
            }
        }).catch(error => {
            console.log(error, 'init')
        })
    }
    return {
        init
    }
})

        