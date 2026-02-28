<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { useFuelSoldStore } from '@/modules/fuel-sold/store'
    import { useFuelStore } from '@/modules/fuel/store'
    import { getFromCache } from '@/composables/useCache'
    import type { IFuelSold } from '@/modules/fuel-sold/store'
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import DeleteModal from '@/components/app/DeleteModal.vue'
    import { useAppStore } from '@/modules/app/store/index'

    const appStore = useAppStore()

    const router = useRouter()
    const { t } = useI18n()
    const store = useFuelSoldStore()
    const fuelStore = useFuelStore()

    const stationId = ref('')
    const showFilters = ref(false)
    const date_range = ref([])
    const selectedSale = ref<any>(null)

    const deleteModal = ref({ show: false, targetIndex: -1 })
    const successModal = ref({ show: false, type: 'success', title: '', description: '' })
    const errorModal = ref({ show: false, description: '', message: '' })

    const users = ref<any[]>([]) // For createdBy filter

    onMounted(async () => {
        const appData = getFromCache('app_data')
        if (appData && appData.value?.stations?.[0]?._id) {
            stationId.value = appData.value.stations[0]._id
            // Load fuel sales
            await store.getFuelSales()

            // Load fuels for filter
            await fuelStore.getFuelsByStation(stationId.value)

            // TODO: Load users for createdBy filter if needed
            // await loadUsers()
        }
    })

    const handleCreate = () => {
        router.push('/fuel-sold/create')
    }

    const handleEdit = (sale: any) => {
        router.push(`/fuel-sold/edit/${sale._id}`)
    }

    const handleDeleteClick = (sale: IFuelSold, index: number) => {
        selectedSale.value = sale
        deleteModal.value = { show: true, targetIndex: index }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedSale.value) return
        const { targetIndex } = deleteModal.value
        try {
            appStore.loading = true
            const success = await store.deleteFuelSale(selectedSale.value._id)

            deleteModal.value.show = false

            if (success) {
                successModal.value = {
                    show: true,
                    type: 'success',
                    title: t('fuel_sold.delete_success_title'),
                    description: t('fuel_sold.delete_success_desc'),
                }
                appStore.loading = false
                store.fuelSales.splice(targetIndex, 1)
            } else {
                appStore.loading = false
                errorModal.value = {
                    show: true,
                    description: t('fuel_sold.delete_error'),
                    message: '',
                }
            }
        } catch (error) {
            deleteModal.value.show = false
            appStore.loading = false
            errorModal.value = {
                show: true,
                description: t('fuel_sold.delete_error'),
                message: '',
            }
        }
    }

    const handleSearch = async () => {
        store.filters.page_number = 1
        await store.getFuelSales()
    }

    const onChangeDateRange = async (value: any) => {
        if (value && value[0] && value[1]) {
            store.filters.date_from = new Date(value[0]).toISOString().split('T')[0]
            store.filters.date_to = new Date(value[1]).toISOString().split('T')[0]
        } else {
            store.filters.date_from = ''
            store.filters.date_to = ''
        }
        await handleSearch()
    }

    const handleResetFilters = async () => {
        date_range.value = []
        store.resetFilters()
        await store.getFuelSales()
    }

    const handleViewDetail = (saleId: string) => {
        router.push(`/fuel-sold/view/${saleId}`)
    }

    const loadMore = async () => {
        store.filters.page_number++
        await store.getFuelSales()
    }

    const updatePageSize = async (size: number) => {
        store.filters.page_size = size
        store.filters.page_number = 1
        await store.getFuelSales()
    }

    const hasMoreRecords = computed(() => {
        return store.fuelSales.length < store.totalCount
    })

    const canLoadPrevious = computed(() => {
        return store.filters.page_number > 1
    })

    const loadPrevious = async () => {
        if (canLoadPrevious.value) {
            store.filters.page_number--
            store.fuelSales = [] // Clear current data
            await store.getFuelSales()
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)
    }

    const getCreatorName = (sale: any) => {
        if (sale.createdBy) {
            return `${sale.createdBy.firstName} ${sale.createdBy.lastName}`
        }
        return t('fuel_sold.unknown')
    }
</script>

<template>
    <div class="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
        <BaseLoading v-if="store.loading && store.filters.page_number === 1" />

        <!-- Header -->
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {{ t('fuel_sold.title') }}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">
                        {{ store.totalCount }} {{ t('fuel_sold.records') }}
                    </p>
                </div>
                <button
                    @click="handleCreate"
                    class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary font-semibold rounded-lg transition-colors shadow-md"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    {{ t('fuel_sold.add_sale') }}
                </button>
            </div>

            <!-- Filters -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-2">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                        {{ t('fuel_sold.filters') }}
                    </h3>
                    <button @click="showFilters = !showFilters" class="text-primary hover:text-primary-dark">
                        <svg
                            class="w-5 h-5 transition-transform"
                            :class="{ 'rotate-180': showFilters }"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Search -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('fuel_sold.search') }}
                            </label>
                            <input
                                v-model="store.filters.search"
                                type="text"
                                @input="handleSearch"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                :placeholder="t('fuel_sold.search_placeholder')"
                            />
                        </div>

                        <!-- Fuel Type -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('fuel_sold.fuel_type') }}
                            </label>
                            <select
                                v-model="store.filters.fuel_type"
                                @change="handleSearch"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">{{ t('fuel_sold.all_fuels') }}</option>
                                <option v-for="fuel in fuelStore.fuels" :key="fuel._id" :value="fuel._id">
                                    {{ fuel.fuel_name }}
                                </option>
                            </select>
                        </div>

                        <!-- Date Range -->
                        <div class="sm:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ t('fuel_sold.date_range') }}
                            </label>
                            <VueDatePicker
                                v-model="date_range"
                                range
                                auto-apply
                                placeholder="From Date - To Date"
                                :partial-range="false"
                                :enable-time-picker="false"
                                @update:model-value="onChangeDateRange"
                            />
                        </div>

                        <!-- Reset Button -->
                        <div class="sm:col-span-2 flex justify-end">
                            <button
                                @click="handleResetFilters"
                                class="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                            >
                                {{ t('fuel_sold.reset_filters') }}
                            </button>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Grouped Sales List -->
            <div v-if="Object.keys(store.groupedByDate).length > 0" class="space-y-2 mb-6">
                <div v-for="(sales, date) in store.groupedByDate" :key="date">
                    <!-- Date Header -->
                    <div class="flex items-center gap-3">
                        <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-base font-bold text-gray-900 dark:text-white">{{ date }}</h2>
                        </div>
                    </div>

                    <!-- Sales Cards -->
                    <div class="space-y-2">
                        <div
                            v-for="(sale, index) in sales"
                            :key="sale._id"
                            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 p-4"
                            @click="handleViewDetail(sale._id)"
                        >
                            <div class="flex items-start gap-3">
                                <!-- Fuel Icon -->
                                <div
                                    class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    :style="{ backgroundColor: sale.fuel.color + '20' }"
                                >
                                    <svg
                                        class="w-6 h-6"
                                        :style="{ color: sale.fuel.color }"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                    </svg>
                                </div>

                                <!-- Content -->
                                <div class="flex-1 min-w-0">
                                    <!-- Top Row: Fuel Name & Quantity -->
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="flex-1 min-w-0">
                                            <h3 class="text-base font-bold text-gray-900 dark:text-white truncate">
                                                {{ sale.fuel.fuel_name }}
                                            </h3>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                                {{ t('fuel_sold.sold_by') }}:
                                                <span class="font-semibold text-gray-900">{{
                                                    getCreatorName(sale)
                                                }}</span>
                                            </p>
                                        </div>
                                        <div class="text-right flex-shrink-0 ml-4">
                                            <div class="text-base font-bold text-[#149c49] dark:text-green-400">
                                                {{ sale.quantity_sold_liter.toLocaleString() }} L
                                            </div>
                                            <div class="text-xs text-blue-500 dark:text-blue-400">
                                                <span class="font-bold">{{
                                                    formatCurrency(sale.amount_per_liter_khr)
                                                }}</span>
                                                {{ t('fuel_sold.riel_per_liter') }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Bottom Row: Total Amounts -->
                                    <div
                                        class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700"
                                    >
                                        <div class="flex gap-4">
                                            <div>
                                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                                    {{ t('fuel_sold.total_usd') }}
                                                </p>
                                                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                                    ${{ formatCurrency(sale.total_amount_us) }}
                                                </p>
                                            </div>
                                            <div>
                                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                                    {{ t('fuel_sold.total_khr') }}
                                                </p>
                                                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                                    ៛{{ formatCurrency(sale.total_amount_khr) }}
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="flex gap-2" @click.stop>
                                            <button
                                                @click="handleEdit(sale)"
                                                class="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                :title="t('fuel_sold.edit')"
                                            >
                                                <svg
                                                    class="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                @click="handleDeleteClick(sale, index)"
                                                class="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors"
                                                :title="t('fuel_sold.delete')"
                                            >
                                                <svg
                                                    class="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    {{ t('fuel_sold.no_records') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                    {{ t('fuel_sold.no_records_desc') }}
                </p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-blue-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {{ t('fuel_sold.total_quantity_liter') }}
                            </p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                {{ store.totals.quantity_liter.toLocaleString() }}
                                <span class="text-base font-normal text-gray-500 ml-1">L</span>
                            </p>
                        </div>
                        <div
                            class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
                        >
                            <svg
                                class="w-6 h-6 text-blue-600 dark:text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-l-4 border-purple-500">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {{ t('fuel_sold.total_amount_us') }}
                            </p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                ${{ formatCurrency(store.totals.total_amount_us) }}
                            </p>
                        </div>
                        <div
                            class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
                        >
                            <svg
                                class="w-6 h-6 text-purple-600 dark:text-purple-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
                                />
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <nav
                v-if="store.fuelSales.length > 0"
                class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700"
            >
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {{ t('fuel_sold.total_records') }}:
                    <span class="font-semibold text-gray-900 dark:text-white">{{ store.totalCount }}</span>
                </span>

                <select
                    v-model="store.filters.page_size"
                    class="block w-20 h-[35px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    @change="updatePageSize(Number(($event.target as any).value))"
                >
                    <option value="7">7</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="120">120</option>
                </select>

                <ul class="inline-flex items-stretch -space-x-px">
                    <li>
                        <button
                            :disabled="!canLoadPrevious"
                            @click="loadPrevious"
                            class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <span
                            class="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                        >
                            {{ store.filters.page_number }}
                        </span>
                    </li>
                    <li>
                        <button
                            :disabled="!hasMoreRecords"
                            @click="loadMore"
                            class="flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Modals -->
        <DeleteModal
            :show="deleteModal.show"
            :title="t('fuel_sold.confirm_delete')"
            :description="t('fuel_sold.confirm_delete_desc')"
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
            @confirm="errorModal.show = false"
        />
    </div>
</template>
