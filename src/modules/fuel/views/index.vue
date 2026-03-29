<script setup lang="ts">
    import { ref, onMounted, inject } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { useFuelStore } from '@/modules/fuel/store'
    import { getFromCache } from '@/composables/useCache'
    import type { IFuel } from '@/modules/fuel/store'
    import DeleteModal from '@/components/app/DeleteModal.vue'
    import { useAppStore } from '@/modules/app/store/index'
    import { AuthKey } from '@/composables/useAuth'

    const { isAdmin } = inject(AuthKey)!
    const appStore = useAppStore()
    const router = useRouter()
    const { t } = useI18n()
    const store = useFuelStore()

    const stationId = ref('')
    const selectedFuel = ref<IFuel | null>(null)

    const deleteModal = ref({ show: false, targetIndex: -1 })
    const successModal = ref({ show: false, type: 'success', title: '', description: '' })
    const errorModal = ref({ show: false, description: '', message: '' })

    onMounted(async () => {
        const appData = getFromCache('app_data')
        if (appData && appData.value?.stations?.[0]?._id) {
            stationId.value = appData.value.stations[0]._id
            await store.getFuelsByStation(stationId.value)
        }
    })

    const handleCreate = () => {
        router.push('/fuel/create')
    }

    const handleEdit = (fuel: IFuel) => {
        router.push(`/fuel/edit/${fuel._id}`)
    }

    const handleDeleteClick = (fuel: IFuel, index: number) => {
        selectedFuel.value = fuel
        deleteModal.value = { show: true, targetIndex: index }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedFuel.value) return
        const { targetIndex } = deleteModal.value
        try {
            appStore.loading = true
            const success = await store.deleteFuel(selectedFuel.value._id)

            deleteModal.value.show = false

            if (success) {
                successModal.value = {
                    show: true,
                    type: 'success',
                    title: t('fuel.delete_success_title'),
                    description: t('fuel.delete_success_desc'),
                }
                appStore.loading = false
                store.fuels.splice(targetIndex, 1)
                // Reload list
                // await store.getFuelsByStation(stationId.value)
            } else {
                appStore.loading = false
                errorModal.value = {
                    show: true,
                    description: t('fuel.delete_error'),
                    message: '',
                }
            }
        } catch (error) {
            deleteModal.value.show = false
            appStore.loading = false
            errorModal.value = {
                show: true,
                description: t('fuel.delete_error'),
                message: '',
            }
        }
    }

    const handleErrorModalConfirm = () => {
        errorModal.value.show = false
    }
</script>

<template>
    <div class="md:mx-auto md:pt-20 p-4">
        <BaseLoading v-if="store.loading" />

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {{ t('fuel.fuel_management') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ t('fuel.manage_subtitle') }}
                </p>
            </div>
            <button
                v-if="isAdmin"
                @click="handleCreate"
                class="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg transition-colors shadow-md"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                {{ t('fuel.add_fuel') }}
            </button>
        </div>

        <!-- Fuel Grid -->
        <div v-if="store.fuels.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
                v-for="(fuel, index) in store.fuels"
                :key="fuel._id"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200 dark:border-gray-700"
            >
                <!-- Fuel Header -->
                <div class="flex items-start gap-3 mb-4">
                    <div
                        class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        :style="{ backgroundColor: fuel.color + '20' }"
                    >
                        <svg class="w-7 h-7" :style="{ color: fuel.color }" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {{ t('fuel.name') }}: {{ fuel.fuel_name }}
                        </h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {{ t('onboarding.coefficient') }}:
                            <span class="font-bold" :style="{ color: fuel.color }">
                                {{ fuel.coefficient_value }}
                            </span>
                            {{ t('onboarding.liters_per_ton') }}
                        </p>
                    </div>
                </div>

                <!-- Tank Capacity -->
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            {{ t('fuel.tank_capacity') }}
                        </span>
                        <span class="text-lg font-bold text-gray-900 dark:text-white">
                            {{ fuel.current_stock?.fuel_tank_size?.toLocaleString() || 0 }}
                            <span class="text-sm font-normal text-gray-500">L</span>
                        </span>
                    </div>
                </div>

                <!-- Actions -->
                <div v-if="isAdmin" class="flex gap-2 mt-4">
                    <button
                        @click="handleEdit(fuel)"
                        class="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                        {{ t('fuel.edit') }}
                    </button>
                    <button
                        @click="handleDeleteClick(fuel, index)"
                        class="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                        {{ t('fuel.delete') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-16">
            <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                    />
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('fuel.no_fuels') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                {{ t('fuel.no_fuels_desc') }}
            </p>
            <button
                @click="handleCreate"
                class="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg transition-colors"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                {{ t('fuel.create_first_fuel') }}
            </button>
        </div>

        <!-- Modals -->
        <DeleteModal
            :show="deleteModal.show"
            :title="t('fuel.confirm_delete')"
            :description="t('fuel.confirm_delete_desc', { name: selectedFuel?.fuel_name })"
            @close="deleteModal.show = false"
            @confirm="handleDeleteConfirm"
        />

        <SuccessModal
            :show="successModal.show"
            :type="successModal.type"
            :title="successModal.title"
            :description="successModal.description"
            @close="successModal.show = false"
            @confirm="successModal.show = false"
        />

        <ErrorModal
            :show="errorModal.show"
            :description="errorModal.description"
            :error-message="errorModal.message"
            @confirm="handleErrorModalConfirm"
        />
    </div>
</template>
