
import { defineStore } from 'pinia'

interface IAppStore {}

export const useAppStore = defineStore('appStore', {
    state: (): IAppStore => ({}),
    getters: {},
    actions: {},
})

        