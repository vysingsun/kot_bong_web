<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { COMPANIES, type Company } from '@/data/constants'
    import { stationService } from '@/modules/OnboardingView/services/api.service'
    import { getFromCache, setCache } from '@/composables/useCache'
    import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
    import { useThemeStore } from '@/stores/theme'
    import DeleteModal from '@/components/app/DeleteModal.vue'

    const themeStore = useThemeStore()

    const router = useRouter()
    const { t } = useI18n()
    const selectedCompany = ref<Company | null>(null)
    const fuelStocks = ref<any[]>([])
    const loading = ref(false)
    const isLoading = ref(false)
    const saving = ref(false)
    const stationId = ref('')
    const error = ref('')
    const isDropdownOpen = ref(false)
    const dropdownRef = ref<HTMLElement | null>(null)

    // Modal states
    const isModalOpen = ref(false)
    const isCreatingFuel = ref(false)
    const newFuel = ref({
        fuel_name: '',
        coefficient_value: '',
        color: '#3b82f6',
        fuel_tank_size: '',
    })

    // Validation states
    const formErrors = ref({
        fuel_name: false,
        coefficient_value: false,
        fuel_tank_size: false,
    })

    // Deleting state
    const deletingFuelIds = ref<Set<string>>(new Set())

    const errorModal = ref({
        show: false,
        description: '',
        message: '',
    })

    const showErrorModal = (description: string, message: string) => {
        errorModal.value = {
            show: true,
            description,
            message,
        }
    }

    const successModal = ref({
        show: false,
        type: 'success' as const,
        title: '',
        description: '',
    })

    const showSuccessModal = (title: string, description: string) => {
        successModal.value = {
            show: true,
            type: 'success',
            title,
            description,
        }
    }

    const deleteModal = ref({
        show: false,
        targetIndex: -1,
        targetId: '',
    })
    onMounted(async () => {
        try {
            loading.value = true
            const appData = getFromCache('app_data')

            if (!appData || !appData.value?.stations?.[0]?._id) {
                error.value = 'Station information not found'
                return
            }

            stationId.value = appData.value.stations[0]._id
            const stationName = appData.value.stations[0].station_name

            // Set default selected company
            if (stationName) {
                let matchedCompany = COMPANIES.find(
                    company => company.name.toLowerCase() === stationName.toLowerCase().replace(/_/g, ' '),
                )

                if (!matchedCompany) {
                    matchedCompany = COMPANIES.find(company => company._id === stationName.toLowerCase())
                }

                if (!matchedCompany) {
                    const stationNameLower = stationName.toLowerCase()
                    matchedCompany = COMPANIES.find(
                        company => stationNameLower.includes(company._id) || company._id.includes(stationNameLower),
                    )
                }

                selectedCompany.value = matchedCompany || COMPANIES[0]
            } else {
                selectedCompany.value = COMPANIES[0]
            }

            // Fetch current stock data
            await loadFuelStocks()

            // Click outside handler
            document.addEventListener('click', handleClickOutside)
        } catch (err: any) {
            console.error('Error loading onboarding data:', err)
            error.value = 'Failed to load data'
        } finally {
            loading.value = false
        }
    })

    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside)
    })

    const loadFuelStocks = async () => {
        try {
            const response = await stationService.getCurrentStock(stationId.value)

            if (response.data.success) {
                fuelStocks.value = response.data.data.map((stock: any) => ({
                    id: stock.fuel?._id,
                    fuel_name: stock.fuel?.fuel_name,
                    color: stock.fuel?.color,
                    coefficient_value: stock.fuel?.coefficient_value,
                    fuel_tank_size: stock.fuel_tank_size,
                }))
            }
        } catch (err) {
            console.error('Error loading fuel stocks:', err)
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
            isDropdownOpen.value = false
        }
    }

    const selectCompany = (company: Company) => {
        selectedCompany.value = company
        isDropdownOpen.value = false

        updateCompany()
    }

    const toggleDropdown = () => {
        isDropdownOpen.value = !isDropdownOpen.value
    }

    const updateFuelTankSize = (index: number, value: string) => {
        const numValue = parseFloat(value)
        if (!isNaN(numValue) && numValue >= 0) {
            fuelStocks.value[index].fuel_tank_size = numValue
        }
    }

    const canDeleteFuel = (index: number) => {
        // Can only delete fuels added after the default ones
        return index >= 3
    }

    const deleteFuel = async (index: number, fuelId: string) => {
        if (!canDeleteFuel(index)) {
            showErrorModal(t('onboarding.cannot_delete_default'), '')
            return
        }
        deleteModal.value = { show: true, targetIndex: index, targetId: fuelId }
    }

    const handleDeleteConfirm = async () => {
        const { targetIndex, targetId } = deleteModal.value
        try {
            deletingFuelIds.value.add(targetId)
            const response = await stationService.deleteFuel(targetId)
            if (response.data.success) {
                fuelStocks.value.splice(targetIndex, 1)
            } else {
                throw new Error(response.data.error || 'Failed to delete fuel')
            }
        } catch (err: any) {
            console.error('Error deleting fuel:', err)
            showErrorModal(
                t('onboarding.fuel_deletion_error'),
                err.response?.data?.error?.message || t('onboarding.fuel_deletion_error'),
            )
        } finally {
            deletingFuelIds.value.delete(targetId)
        }
    }

    const openModal = () => {
        isModalOpen.value = true
        // Reset form
        newFuel.value = {
            fuel_name: '',
            coefficient_value: '',
            color: '#3b82f6',
            fuel_tank_size: '',
        }
        // Reset validation errors
        formErrors.value = {
            fuel_name: false,
            coefficient_value: false,
            fuel_tank_size: false,
        }
    }

    const closeModal = () => {
        isModalOpen.value = false
    }

    const validateForm = () => {
        formErrors.value.fuel_name = !newFuel.value.fuel_name.trim()
        formErrors.value.coefficient_value =
            !newFuel.value.coefficient_value || parseFloat(newFuel.value.coefficient_value) <= 0
        formErrors.value.fuel_tank_size = !newFuel.value.fuel_tank_size || parseFloat(newFuel.value.fuel_tank_size) <= 0

        return !formErrors.value.fuel_name && !formErrors.value.coefficient_value && !formErrors.value.fuel_tank_size
    }

    const createFuel = async () => {
        // Validation
        if (!validateForm()) {
            return
        }

        try {
            isCreatingFuel.value = true

            const payload = {
                fuel_name: newFuel.value.fuel_name.trim(),
                station_id: stationId.value,
                coefficient_value: parseFloat(newFuel.value.coefficient_value),
                color: newFuel.value.color,
                fuel_tank_size: parseFloat(newFuel.value.fuel_tank_size),
            }

            const response = await stationService.createFuel(payload)

            if (response.data.success) {
                // Add to array instead of reloading
                const newFuelData = response.data.data.data
                fuelStocks.value.push({
                    id: newFuelData.fuel._id,
                    fuel_name: newFuelData.fuel.fuel_name,
                    color: newFuelData.fuel.color,
                    coefficient_value: newFuelData.fuel.coefficient_value,
                    fuel_tank_size: newFuelData.fuel_tank_size || parseFloat(newFuel.value.fuel_tank_size),
                })

                // Close modal
                closeModal()

                // Show success message
                showSuccessModal(t('common.success.title'), t('onboarding.fuel_created_success'))
            } else {
                throw new Error(response.data.error || 'Failed to create fuel')
            }
        } catch (err: any) {
            showErrorModal(
                t('onboarding.fuel_creation_error'),
                err.response?.data?.error || t('onboarding.fuel_creation_error'),
            )
        } finally {
            isCreatingFuel.value = false
        }
    }

    const updateLocalStorage = (newStationName: string) => {
        try {
            const appData = getFromCache('app_data')

            if (appData && appData.value?.stations?.[0]) {
                appData.value.stations[0].station_name = newStationName
                setCache('app_data', appData.value)
            }
        } catch (error) {
            console.error('Error updating localStorage:', error)
        }
    }

    const updateCompany = async () => {
        if (!selectedCompany.value) {
            alert(t('onboarding.select_company_error'))
            return
        }

        try {
            isLoading.value = true
            const newStationName = selectedCompany.value.name.replace(/\s+/g, '_')

            const response = await stationService.updateStation(stationId.value, {
                station_name: newStationName,
            })

            if (response.data.result.success) {
                updateLocalStorage(newStationName)

                themeStore.setTheme(selectedCompany.value._id)
            } else {
                throw new Error('Failed to update station name')
            }
        } catch (err: any) {
            errorModal.value.show = true
            errorModal.value.message = err.response?.data?.details[0]?.error || 'Failed to save data. Please try again.'
            alert(t('onboarding.company_update_error'))
        } finally {
            isLoading.value = false
        }
    }

    const handleSubmit = async () => {
        try {
            saving.value = true
            //  Update fuel tank sizes
            const tankSizeData = fuelStocks.value.map(stock => ({
                id: stock.id,
                fuel_tank_size: stock.fuel_tank_size,
            }))

            const tankSizeResponse = await stationService.updateFuelTankSizes(tankSizeData)

            if (!tankSizeResponse.data.success) {
                throw new Error('Failed to update fuel tank sizes')
            }

            // Redirect to home
            router.push('/')
        } catch (err: any) {
            console.error('Error saving onboarding data:', err)
            errorModal.value.show = true
            errorModal.value.message = err.response?.data?.details[0]?.error || 'Failed to save data. Please try again.'
        } finally {
            saving.value = false
        }
    }

    const handleErrorModalConfirm = () => {
        errorModal.value.show = false
    }
</script>

<template>
    <section class="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 relative">
        <div class="absolute top-3 right-3 z-10">
            <LanguageSwitcher />
        </div>
        <div class="container mx-auto px-4 max-w-3xl">
            <!-- Header -->
            <div class="text-center mt-6 mb-6">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ t('onboarding.welcome') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ t('onboarding.subtitle') }}
                </p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
                <svg
                    aria-hidden="true"
                    class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <p class="mt-4 text-gray-600 dark:text-gray-400">{{ t('onboarding.loading') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
                <p class="text-red-600 dark:text-red-400">{{ error }}</p>
            </div>

            <!-- Main Content -->
            <div v-else class="space-y-6">
                <!-- Step 1: Select Company -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        {{ t('onboarding.select_company') }}
                    </label>

                    <div v-if="isLoading" class="progress w-full mb-1"></div>

                    <!-- Custom Dropdown -->
                    <div class="relative" ref="dropdownRef">
                        <button
                            @click="toggleDropdown"
                            type="button"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div v-if="selectedCompany" class="flex items-center gap-3">
                                <img
                                    :src="selectedCompany.image"
                                    :alt="selectedCompany.name"
                                    class="w-8 h-8 object-contain rounded bg-white p-1"
                                />
                                <span class="font-medium">{{ selectedCompany.name }}</span>
                            </div>
                            <span v-else class="text-gray-500 dark:text-gray-400">
                                {{ t('onboarding.choose_company') }}
                            </span>

                            <!-- Dropdown Arrow -->
                            <svg
                                class="w-5 h-5 text-gray-400 transition-transform"
                                :class="{ 'rotate-180': isDropdownOpen }"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        <transition
                            enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95"
                        >
                            <div
                                v-if="isDropdownOpen"
                                class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                            >
                                <ul class="py-1">
                                    <li
                                        v-for="company in COMPANIES"
                                        :key="company._id"
                                        @click="selectCompany(company)"
                                        class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center gap-3"
                                        :class="{
                                            'bg-blue-50 dark:bg-blue-900/20': selectedCompany?._id === company._id,
                                        }"
                                    >
                                        <img
                                            :src="company.image"
                                            :alt="company.name"
                                            class="w-10 h-10 object-contain rounded bg-gray-50 dark:bg-gray-600 p-1.5"
                                        />
                                        <span class="font-medium text-gray-900 dark:text-white">{{
                                            company.name
                                        }}</span>

                                        <!-- Check Icon -->
                                        <svg
                                            v-if="selectedCompany?._id === company._id"
                                            class="w-5 h-5 ml-auto text-blue-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </li>
                                </ul>
                            </div>
                        </transition>
                    </div>
                </div>

                <!-- Step 2: Configure Fuel Tank Sizes -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-sm font-semibold text-gray-900 dark:text-white">
                            {{ t('onboarding.configure_tanks') }}
                        </h2>
                        <button
                            @click="openModal"
                            type="button"
                            class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-blue-300"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            <span>{{ t('onboarding.add_fuel') }}</span>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div
                            v-for="(stock, index) in fuelStocks"
                            :key="stock.id"
                            class="relative p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                            <!-- Delete Button (only for non-default fuels) -->
                            <button
                                v-if="canDeleteFuel(index)"
                                @click="deleteFuel(index, stock.id)"
                                :disabled="deletingFuelIds.has(stock.id)"
                                class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-full flex items-center justify-center transition-colors z-10 shadow-md"
                                :title="t('onboarding.delete_fuel')"
                            >
                                <svg
                                    v-if="deletingFuelIds.has(stock.id)"
                                    class="w-3 h-3 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    />
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="3"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <!-- Header with fuel name and coefficient -->
                            <div class="flex items-center gap-3 mb-3">
                                <!-- Oil Drop Icon -->
                                <svg
                                    class="w-6 h-6 flex-shrink-0"
                                    :style="{ color: stock.color }"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                </svg>

                                <div class="flex-1">
                                    <p class="text-base font-semibold text-gray-900 dark:text-white">
                                        {{ stock.fuel_name }}
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ t('onboarding.coefficient') }}:
                                        <span class="text-blue-600 dark:text-blue-400 font-semibold">{{
                                            stock.coefficient_value
                                        }}</span>
                                        {{ t('onboarding.liters_per_ton') }}
                                    </p>
                                </div>
                            </div>

                            <!-- Input Field -->
                            <div>
                                <label
                                    :for="`tank-size-${index}`"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    {{ t('onboarding.tank_capacity') }}
                                </label>
                                <div class="relative">
                                    <input
                                        :id="`tank-size-${index}`"
                                        type="number"
                                        :value="stock.fuel_tank_size"
                                        @input="updateFuelTankSize(index, ($event.target as HTMLInputElement).value)"
                                        min="0"
                                        step="100"
                                        class="w-full px-4 py-2.5 pr-16 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :placeholder="t('onboarding.enter_capacity')"
                                    />
                                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {{ t('onboarding.liters') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end gap-3">
                    <button
                        @click="router.push('/')"
                        class="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
                    >
                        {{ t('onboarding.skip') }}
                    </button>
                    <button
                        @click="handleSubmit"
                        :disabled="!selectedCompany || saving"
                        class="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-300 flex items-center gap-2"
                    >
                        <svg
                            v-if="saving"
                            aria-hidden="true"
                            class="w-5 h-5 animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        {{ saving ? t('onboarding.saving') : t('onboarding.complete_setup') }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Add Fuel Modal -->
        <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isModalOpen"
                class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
                @click.self="closeModal"
            >
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            {{ t('onboarding.add_new_fuel') }}
                        </h3>
                        <button
                            @click="closeModal"
                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <!-- Fuel Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('onboarding.fuel_name') }} <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="newFuel.fuel_name"
                                type="text"
                                :class="[
                                    'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                                    formErrors.fuel_name
                                        ? 'border-red-500 dark:border-red-500'
                                        : 'border-gray-300 dark:border-gray-600',
                                ]"
                                :placeholder="t('onboarding.fuel_name_placeholder')"
                                @input="formErrors.fuel_name = false"
                            />
                            <p v-if="formErrors.fuel_name" class="mt-1 text-sm text-red-500">
                                {{ t('onboarding.fuel_name_required') }}
                            </p>
                        </div>

                        <!-- Coefficient Value -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('onboarding.coefficient_value') }} <span class="text-red-500">*</span>
                            </label>
                            <input
                                v-model="newFuel.coefficient_value"
                                type="number"
                                step="0.01"
                                min="0"
                                :class="[
                                    'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                                    formErrors.coefficient_value
                                        ? 'border-red-500 dark:border-red-500'
                                        : 'border-gray-300 dark:border-gray-600',
                                ]"
                                :placeholder="t('onboarding.coefficient_placeholder')"
                                @input="formErrors.coefficient_value = false"
                            />
                            <p v-if="formErrors.coefficient_value" class="mt-1 text-sm text-red-500">
                                {{ t('onboarding.coefficient_required') }}
                            </p>
                        </div>

                        <!-- Color Picker -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('onboarding.fuel_color') }}
                            </label>
                            <div class="flex items-center gap-3">
                                <input
                                    v-model="newFuel.color"
                                    type="color"
                                    class="h-10 w-20 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                                />
                                <input
                                    v-model="newFuel.color"
                                    type="text"
                                    class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="#3b82f6"
                                />
                            </div>
                        </div>

                        <!-- Tank Size -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('onboarding.tank_capacity') }} <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input
                                    v-model="newFuel.fuel_tank_size"
                                    type="number"
                                    step="100"
                                    min="0"
                                    :class="[
                                        'w-full px-4 py-2.5 pr-16 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                                        formErrors.fuel_tank_size
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-300 dark:border-gray-600',
                                    ]"
                                    :placeholder="t('onboarding.enter_capacity')"
                                    @input="formErrors.fuel_tank_size = false"
                                />
                                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {{ t('onboarding.liters') }}
                                    </span>
                                </div>
                            </div>
                            <p v-if="formErrors.fuel_tank_size" class="mt-1 text-sm text-red-500">
                                {{ t('onboarding.tank_size_required') }}
                            </p>
                        </div>
                    </div>

                    <!-- Modal Actions -->
                    <div class="flex gap-3 mt-6">
                        <button
                            @click="closeModal"
                            class="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                        >
                            {{ t('onboarding.cancel') }}
                        </button>
                        <button
                            @click="createFuel"
                            :disabled="isCreatingFuel"
                            class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg v-if="isCreatingFuel" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                />
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            {{ isCreatingFuel ? t('onboarding.creating') : t('onboarding.create_fuel') }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </section>
    <ErrorModal
        :show="errorModal.show"
        :description="errorModal.description"
        :error-message="errorModal.message"
        @confirm="handleErrorModalConfirm"
    />
    <SucessModal
        :show="successModal.show"
        :type="successModal.type"
        :title="successModal.title"
        :description="successModal.description"
        @close="successModal.show = false"
        @confirm="successModal.show = false"
    />

    <DeleteModal
        :show="deleteModal.show"
        :title="t('onboarding.confirm_delete')"
        :description="''"
        @close="deleteModal.show = false"
        @confirm="handleDeleteConfirm"
    />
</template>
<style scoped></style>
