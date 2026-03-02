import { reactive } from 'vue'
import { useAppStore } from '@/modules/app/store/index'

export const errorModal = reactive({
    show: false,
    description: '',
    message: '',
    statusCode: 0,
})

export function showErrorModal(message: string, description = '', statusCode = 0) {
    // Stop loading when error appears
    const appStore = useAppStore()
    appStore.loading = false

    errorModal.show = true
    errorModal.message = message
    errorModal.description = description
    errorModal.statusCode = statusCode
}

export function hideErrorModal() {
    errorModal.show = false
    errorModal.message = ''
    errorModal.description = ''
    errorModal.statusCode = 0
}
