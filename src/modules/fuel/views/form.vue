<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { useFuelStore } from '@/modules/fuel/store'
    import { getFromCache } from '@/composables/useCache'

    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const store = useFuelStore()

    const fuelId = ref<string | null>(null)
    const loading = ref(false)
    const saving = ref(false)
    const stationId = ref('')
    const successModal = ref({ show: false, type: 'success', title: '', description: '' })
    const errorModal = ref({ show: false, description: '', message: '' })

    const formErrors = ref({
        fuel_name: false,
        coefficient_value: false,
        fuel_tank_size: false,
    })

    onMounted(async () => {
        loading.value = true

        // Get station ID from cache
        const appData = getFromCache('app_data')
        if (appData && appData.value?.stations?.[0]?._id) {
            stationId.value = appData.value.stations[0]._id
            store.formData.station_id = stationId.value
        }

        // If editing, load fuel data
        if (route.params.id) {
            fuelId.value = route.params.id as string
            await store.readDataFromApi(fuelId.value)
        }

        loading.value = false
    })

    onBeforeUnmount(() => {
        store.resetData()
    })

    const validateForm = () => {
        formErrors.value.fuel_name = !store.formData.fuel_name.trim()
        formErrors.value.coefficient_value = !store.formData.coefficient_value || store.formData.coefficient_value <= 0
        formErrors.value.fuel_tank_size = !store.formData.fuel_tank_size || store.formData.fuel_tank_size <= 0

        return !formErrors.value.fuel_name && !formErrors.value.coefficient_value && !formErrors.value.fuel_tank_size
    }

    const handleSave = async () => {
        if (!validateForm()) {
            return
        }

        saving.value = true

        try {
            let success = false

            if (fuelId.value) {
                // Update existing fuel
                success = await store.updateFuel(fuelId.value)
            } else {
                // Create new fuel
                success = await store.saveFuel()
            }

            if (success) {
                successModal.value = {
                    show: true,
                    type: 'success',
                    title: t(fuelId.value ? 'fuel.update_success_title' : 'fuel.create_success_title'),
                    description: t(fuelId.value ? 'fuel.update_success_desc' : 'fuel.create_success_desc'),
                }
            } else {
                errorModal.value = {
                    show: true,
                    description: t('fuel.save_error'),
                    message: '',
                }
            }
        } catch (error) {
            console.error('Error saving fuel:', error)
            errorModal.value = {
                show: true,
                description: t('fuel.save_error'),
                message: error instanceof Error ? error.message : String(error),
            }
        } finally {
            saving.value = false
        }
    }

    const handleCancel = () => {
        router.push('/fuel')
    }

    const handleErrorModalConfirm = () => {
        errorModal.value.show = false

        if (!fuelId.value) {
            router.push('/fuel')
        }
    }

    const handlesuccessModal = () => {
        successModal.value.show = false
        router.push('/fuel')
    }
</script>

<template>
    <div class="md:mx-auto md:pt-20 p-4">
        <BaseLoading v-if="loading" />

        <div class="max-w-2xl mx-auto">
            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ fuelId ? t('fuel.edit_fuel') : t('fuel.create_fuel') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ fuelId ? t('fuel.edit_subtitle') : t('fuel.create_subtitle') }}
                </p>
            </div>

            <!-- Form Card -->
            <div class="bg-white dark:bg-gray-800">
                <div class="space-y-6">
                    <!-- Fuel Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('fuel.fuel_name') }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model="store.formData.fuel_name"
                            type="text"
                            :class="[
                                'w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                                formErrors.fuel_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                            ]"
                            :placeholder="t('fuel.fuel_name_placeholder')"
                            @input="formErrors.fuel_name = false"
                        />
                        <p v-if="formErrors.fuel_name" class="mt-1 text-sm text-red-500">
                            {{ t('fuel.fuel_name_required') }}
                        </p>
                    </div>

                    <!-- Coefficient Value -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('fuel.coefficient_value') }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model="store.formData.coefficient_value"
                            type="number"
                            step="0.01"
                            min="0"
                            :class="[
                                'w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                                formErrors.coefficient_value
                                    ? 'border-red-500'
                                    : 'border-gray-300 dark:border-gray-600',
                            ]"
                            :placeholder="t('fuel.coefficient_placeholder')"
                            @input="formErrors.coefficient_value = false"
                        />
                        <p v-if="formErrors.coefficient_value" class="mt-1 text-sm text-red-500">
                            {{ t('fuel.coefficient_required') }}
                        </p>
                    </div>

                    <!-- Color Picker -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('fuel.fuel_color') }}
                        </label>
                        <div class="flex items-center gap-3">
                            <input
                                v-model="store.formData.color"
                                type="color"
                                class="h-12 w-24 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
                            />
                            <input
                                v-model="store.formData.color"
                                type="text"
                                class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="#3b82f6"
                            />
                        </div>
                    </div>

                    <!-- Tank Capacity -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ t('fuel.tank_capacity') }} <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <input
                                v-model="store.formData.fuel_tank_size"
                                type="number"
                                step="100"
                                min="0"
                                :class="[
                                    'w-full px-4 py-3 pr-20 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                                    formErrors.fuel_tank_size
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600',
                                ]"
                                :placeholder="t('fuel.tank_placeholder')"
                                @input="formErrors.fuel_tank_size = false"
                            />
                            <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {{ t('fuel.liters') }}
                                </span>
                            </div>
                        </div>
                        <p v-if="formErrors.fuel_tank_size" class="mt-1 text-sm text-red-500">
                            {{ t('fuel.tank_size_required') }}
                        </p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-4 mt-8">
                    <button
                        @click="handleCancel"
                        class="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
                    >
                        {{ t('fuel.cancel') }}
                    </button>
                    <button
                        @click="handleSave"
                        :disabled="saving"
                        class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-600-hover disabled:bg-gray-400 text-on-primary font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <svg v-if="saving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        {{ saving ? t('fuel.saving') : t('fuel.save') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <SuccessModal
        :show="successModal.show"
        type="success"
        :title="successModal.title"
        :description="successModal.description"
        @close="successModal.show = false"
        @confirm="handlesuccessModal"
    />
    <ErrorModal
        :show="errorModal.show"
        :description="errorModal.description"
        :error-message="errorModal.message"
        @confirm="handleErrorModalConfirm"
    />
</template>
