import { ref } from 'vue'

export function useModal() {
    const isVisible = ref(false)

    const showModal = () => {
        isVisible.value = true
    }

    const closeModal = () => {
        isVisible.value = false
    }

    return { isVisible, showModal, closeModal }
}
