<template>
    <BaseLoading v-if="isLoading" />

    <!-- Header -->
    <div class="flex justify-between shadow-b-md pb-6 p-4">
        <div class="text-lg font-medium flex items-center">
            {{
                mode === 'create'
                    ? `${t('form.create')} ${title}`
                    : mode === 'view'
                      ? `${t('form.view')} ${title}`
                      : `${t('form.edit')} ${title}`
            }}
        </div>
        <div>
            <button
                type="button"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2.5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                @click="onBack"
            >
                <svg
                    class="w-4 h-4 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m15 19-7-7 7-7"
                    />
                </svg>
            </button>
        </div>
    </div>

    <!-- Form -->
    <div class="p-4">
        <form @submit.prevent="onSave">
            <slot></slot>

            <!-- Action buttons — edit/create mode -->
            <div v-if="mode !== 'view'" class="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    class="inline-flex items-center justify-center text-red-600 border border-red-600 hover:text-white hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    @click="onCancel"
                >
                    <svg
                        class="w-4 h-4 mr-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-width="2"
                            d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                    {{ t('form.cancel') }}
                </button>
                <button
                    type="submit"
                    :disabled="isSaving"
                    class="inline-flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    <svg v-if="isSaving" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span v-if="mode === 'create'">{{ t('form.submit') }}</span>
                    <span v-else>{{ t('form.update') }}</span>
                </button>
            </div>
        </form>

        <!-- Action buttons — view mode -->
        <div v-if="mode === 'view'" class="flex justify-end gap-3 mt-6">
            <!-- Delete Button (if enabled) -->
            <button
                v-if="showDelete"
                class="inline-flex items-center justify-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800"
                @click="handleDeleteClick"
            >
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
                {{ t('form.delete') }}
            </button>

            <!-- Edit Button -->
            <button
                class="inline-flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                @click="enableEdit"
            >
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                </svg>
                {{ t('form.edit') }}
            </button>
        </div>
    </div>

    <!-- Success Modal -->
    <!-- <BaseModal
        :is-visible="successModal.show"
        type="success"
        :title="successModal.title"
        confirm-label="Done"
        @confirm="handleSuccessConfirm"
    /> -->

    <SuccessModal
        :show="successModal.show"
        type="success"
        :title="successModal.title"
        :description="successModal.description"
        @close="successModal.show = false"
        @confirm="handleSuccessConfirm"
    />

    <!-- Error Modal -->
    <ErrorModal
        :show="errorModal.show"
        :description="errorModal.description"
        :error-message="errorModal.message"
        @confirm="handleErrorModalConfirm"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteModal
        :show="deleteModal.show"
        :title="deleteTitle"
        :description="deleteDescription"
        @close="deleteModal.show = false"
        @confirm="handleDeleteConfirm"
    />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
    import DeleteModal from '@/components/app/DeleteModal.vue'
    import { useI18n } from 'vue-i18n'
    import { useAppStore } from '@/modules/app/store/index'

    const appStore = useAppStore()
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const mode = ref(route.params.mode)
    const id = ref('')
    const isSaving = ref(false)

    const props = defineProps({
        title: {
            type: String,
            required: true,
        },
        formData: {
            type: Object,
            default: () => ({}),
        },
        apiService: {
            type: Object,
            required: true,
        },
        getServiceKey: {
            type: String,
            default: 'create',
        },
        editingId: {
            type: String,
            required: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        showDelete: {
            type: Boolean,
            default: false,
        },
        deleteTitle: {
            type: String,
            default: '',
        },
        deleteDescription: {
            type: String,
            default: '',
        },
        recordName: {
            type: String,
            default: '',
        },
    })

    /* emits */
    const emits = defineEmits(['on-save', 'on-delete'])

    const successModal = ref({
        show: false,
        type: 'success',
        title: '',
        description: '',
    })

    const errorModal = ref({
        show: false,
        title: '',
        description: '',
        message: '',
    })

    const deleteModal = ref({
        show: false,
    })

    const onBack = () => {
        const pathSegments = route.path.split('/')
        router.push(`/${pathSegments[1]}`)
    }

    const onCancel = () => {
        if (mode.value === 'create') {
            const pathSegments = route.path.split('/')
            router.push(`/${pathSegments[1]}`)
        } else {
            router.push(route.fullPath.replace('edit', 'view'))
        }
    }

    const handleSuccessConfirm = () => {
        successModal.value.show = false
        const pathSegments = route.path.split('/')
        router.push(`/${pathSegments[1]}`)
    }

    const handleErrorModalConfirm = () => {
        errorModal.value.show = false
    }

    const onSave = async () => {
        isSaving.value = true
        emits('on-save', true)

        try {
            if (mode.value === 'create') {
                const res = await props.apiService[props.getServiceKey](props.formData)
                if (res.data.success) {
                    id.value = res.data.data._id
                    successModal.value = {
                        show: true,
                        type: 'success',
                        title: t('form.create') + props.title,
                        description: '',
                    }
                } else {
                    errorModal.value = {
                        show: true,
                        title: '',
                        description: t('form.create_error'),
                        message: res.error instanceof Error ? res.error.message : String(res.error),
                    }
                }
            } else {
                const res = await props.apiService['edit'](props.editingId, props.formData)
                if (res.data.success) {
                    id.value = res.data.data._id
                    successModal.value = {
                        show: true,
                        type: 'success',
                        title: t('form.edit') + props.title,
                        description: '',
                    }
                } else {
                    errorModal.value = {
                        show: true,
                        title: '',
                        description: t('form.update_error'),
                        message: res.error instanceof Error ? res.error.message : String(res.error),
                    }
                }
            }
        } catch (error) {
            errorModal.value = {
                show: true,
                title: '',
                description: isSaving.value ? t('form.create_error') : t('form.update_error'),
                message: error instanceof Error ? error.message : String(error),
            }
        } finally {
            isSaving.value = false
            emits('on-save', false)
        }
    }

    const enableEdit = () => {
        router.push(route.fullPath.replace('view', 'edit'))
    }

    const handleDeleteClick = () => {
        deleteModal.value.show = true
    }

    const handleDeleteConfirm = async () => {
        try {
            appStore.loading = true
            const res = await props.apiService.delete(props.editingId)

            deleteModal.value.show = false

            if (res.data.success) {
                successModal.value = {
                    show: true,
                    type: 'success',
                    title: t('form.delete') + props.title + t('common.suceess.delete'),
                    description: t('form.delete_success'),
                }
                emits('on-delete', props.editingId)
                appStore.loading = false
            } else {
                errorModal.value = {
                    show: true,
                    title: '',
                    description: t('form.delete_error'),
                    message: res.error instanceof Error ? res.error.message : String(res.error),
                }
                appStore.loading = false
            }
        } catch (error) {
            console.error('Delete error:', error)
            deleteModal.value.show = false
            errorModal.value = {
                show: true,
                title: '',
                description: t('form.delete_error'),
                message: error instanceof Error ? error.message : String(error),
            }
            appStore.loading = false
        }
    }

    onBeforeRouteUpdate((to, from, next) => {
        mode.value = to.params.mode
        next()
    })
</script>
