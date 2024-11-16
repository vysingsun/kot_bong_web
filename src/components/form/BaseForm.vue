<template>
    <div class="flex justify-between shadow-b-md pb-6">
        <div class="text-lg font-medium flex items-center">
            {{ mode === 'create' ? `Create ${title}` : mode === 'view' ? `View ${title}` : `Edit ${title}` }}
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
    <div>
        <form @submit.prevent="onSave">
            <slot></slot>
            <div
                v-if="mode !== 'view'"
                class="bottom-0 left-0 flex justify-center w-full py-4 mt-4 space-x-4 sm:absolute sm:px-4 sm:mt-0"
            >
                <button
                    type="submit"
                    class="w-full justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    <span v-if="mode === 'create'">Submit</span>
                    <span v-else>Update</span>
                </button>
                <button
                    type="button"
                    class="w-full justify-center text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    @click="onCancel"
                >
                    <svg
                        class="w-5 h-5 mr-1.5 -ml-1"
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
                            stroke-width="2"
                            d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                    Cancel
                </button>
            </div>
        </form>
        <div
            v-if="mode === 'view'"
            class="bottom-0 left-0 flex justify-center w-full py-4 mt-4 space-x-4 sm:absolute sm:px-4 sm:mt-0"
        >
            <button
                @click="enableEdit"
                class="w-full justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
                Edit
            </button>
        </div>
    </div>
    <BaseModal
        :is-visible="isVisible"
        type="success"
        :title="`Add ${title} Successfully`"
        confirm-label="Done"
        @confirm="handleConfirm"
    />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
    import { useModal } from '@/composables/useModal'

    const { isVisible, showModal, closeModal } = useModal()
    const isLoading = ref(false)
    const router = useRouter()
    const route = useRoute()
    const mode = ref(route.params.mode)
    const id = ref('')
    const props = defineProps({
        title: String,
        formData: {
            type: Object,
            default: {},
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

    const handleConfirm = () => {
        let newPath = ''
        if (mode.value == 'create') {
            newPath = route.fullPath.replace('create', `view/${id.value}`)
        } else if (mode.value == 'edit') {
            newPath = route.fullPath.replace(/\/edit\/[^/]+$/, `/view/${id.value}`)
        }
        router.push(newPath).catch(err => {
            if (err.name !== 'NavigationDuplicated') {
                throw err
            }
        })
        closeModal()
    }

    const onSave = async () => {
        isLoading.value = true
        if (mode.value == 'create') {
            const res = await props.apiService[props.getServiceKey](props.formData)
            if (res.data.success) {
                id.value = res.data.data._id
                isLoading.value = false
                showModal()
            } else {
                alert('Unsuccessfully!')
                handleConfirm()
            }
        } else {
            const res = await props.apiService['edit'](props.editingId, props.formData)
            if (res.data.result.success) {
                id.value = res.data.result.data._id
                isLoading.value = false
                showModal()
            } else {
                alert('Unsuccessfully!')
                handleConfirm()
            }
        }
    }

    const enableEdit = () => {
        router.push(route.fullPath.replace('view', 'edit'))
    }

    onBeforeRouteUpdate((to, from, next) => {
        mode.value = to.params.mode
        next()
    })
</script>
