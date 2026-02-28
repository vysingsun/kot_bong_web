<script setup lang="ts">
    import { RouterView, useRoute, useRouter } from 'vue-router'
    import { useAppStore } from '@/modules/app/store/index'
    import { errorModal, hideErrorModal } from '@/composables/useErrorModal'

    const router = useRouter()
    const route = useRoute()

    function handleErrorModalConfirm() {
        const pathSegments = route.path.split('/').filter(segment => segment !== '')

        if (pathSegments.length >= 3 && (pathSegments[1] === 'view' || pathSegments[1] === 'edit')) {
            router.push(`/${pathSegments[0]}`)
        } else {
            const newPath = pathSegments.slice(0, -1).join('/')
            router.push(`/${newPath}`)
        }
        hideErrorModal()
    }
    const appStore = useAppStore()
</script>

<template>
    <RouterView />
    <BaseLoading v-if="appStore.loading" />
    <ErrorModal
        :show="errorModal.show"
        :description="errorModal.description"
        :error-message="errorModal.message"
        :button-text="$t('common.success.action')"
        @confirm="handleErrorModalConfirm"
    />
</template>
