<template>
    <BaseForm
        :title="t('fuel_sold.title')"
        :is-loading="loadingForm"
        :editing-id="fuel_sold_id"
        :form-data="store.formData"
        :api-service="nozzleApiService"
        :get-service-key="'createByNozzle'"
        @on-save="handleSaveLoading"
    >
        <div class="form-grid">
            <!-- ① Fuel Type -->
            <div>
                <label class="field-label"> {{ t('fuel_sold.fuel_type') }} <span class="req">*</span> </label>
                <select v-model="selectedFuelId" class="field-input" required :disabled="mode === 'view'">
                    <option value="" disabled>{{ t('fuel_sold.fuel_type_placeholder') }}</option>
                    <option v-for="item in store.fuels" :key="item._id" :value="item._id">
                        {{ item.fuel_name }}
                    </option>
                </select>
            </div>

            <!-- ② Nozzle Start -->
            <div>
                <label class="field-label"> {{ t('fuel_sold.nozzle_start') }} <span class="req">*</span> </label>
                <input
                    v-model="store.formData.nozzle_start"
                    type="number"
                    step="0.01"
                    min="0"
                    class="field-input"
                    required
                    :disabled="mode === 'view'"
                />
            </div>

            <!-- ③ Nozzle End -->
            <div>
                <label class="field-label"> {{ t('fuel_sold.nozzle_end') }} <span class="req">*</span> </label>
                <input
                    v-model="store.formData.nozzle_end"
                    type="number"
                    step="0.01"
                    min="0"
                    class="field-input"
                    required
                    :disabled="mode === 'view'"
                />
            </div>

            <!-- ④ Calculated quantity (read-only display) -->
            <div>
                <label class="field-label">{{ t('fuel_sold.quantity_as_liter') }}</label>
                <input
                    :value="calculatedQty"
                    type="number"
                    class="field-input bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    disabled
                />
            </div>

            <!-- ⑤ Amount per Liter — switches on currency -->
            <div>
                <label class="field-label"> {{ amountPerLiterLabel }} <span class="req">*</span> </label>
                <input
                    v-if="!isUSD"
                    v-model="store.formData.amount_per_liter_khr"
                    type="number"
                    min="0"
                    step="0.01"
                    class="field-input"
                    required
                    :disabled="mode === 'view'"
                />
                <input
                    v-else
                    v-model="store.formData.amount_per_liter_us"
                    type="number"
                    min="0"
                    step="0.01"
                    class="field-input"
                    required
                    :disabled="mode === 'view'"
                />
            </div>

            <!-- ⑥ Exchange Rate — hidden when USD -->
            <div v-if="!isUSD">
                <label class="field-label">{{ t('fuel_sold.exchange_rate') }}</label>
                <input
                    v-model="store.formData.exchange_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    :disabled="mode === 'view'"
                    class="field-input"
                />
            </div>

            <!-- ④ Exchange Rate — label dynamic, hidden when USD -->
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
                    t('fuel_sold.exchange_rate')
                }}</label>
                <input
                    v-model="store.formData.exchange_rate"
                    type="number"
                    step="0.01"
                    min="0"
                    :disabled="mode === 'view'"
                    class="field-input"
                    required
                />
            </div>

            <!-- ⑦ Date · Start Time · End Time -->
            <div class="col-span-full">
                <div class="date-time-row">
                    <div class="date-time-cell">
                        <label class="field-label"> {{ t('fuel_sold.date') }} <span class="req">*</span> </label>
                        <VueDatePicker
                            v-model="store.formData.createdAt"
                            class="DatePicker"
                            auto-apply
                            :partial-range="false"
                            :enable-time-picker="false"
                        />
                    </div>

                    <div class="w-full flex justify-between gap-2">
                        <div class="w-1/2 date-time-cell">
                            <label class="field-label">
                                {{ t('fuel_sold.start_time') }} <span class="req">*</span>
                            </label>
                            <TimePicker
                                v-model="store.formData.startTime"
                                :disabled="mode === 'view'"
                                :placeholder="t('fuel_sold.time_placeholder')"
                            />
                        </div>
                        <div class="w-1/2 date-time-cell">
                            <label class="field-label">
                                {{ t('fuel_sold.end_time') }} <span class="req">*</span>
                            </label>
                            <TimePicker
                                v-model="store.formData.endTime"
                                :disabled="mode === 'view'"
                                :placeholder="t('fuel_sold.time_placeholder')"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- ⑧ Description -->
            <div class="col-span-full">
                <label class="field-label">{{ t('fuel_sold.description') }}</label>
                <textarea
                    v-model="store.formData.description"
                    rows="3"
                    :disabled="mode === 'view'"
                    :placeholder="mode !== 'view' ? t('fuel_sold.description_placeholder') : ''"
                    class="field-input resize-none"
                />
            </div>
        </div>
    </BaseForm>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
    import { useRoute, onBeforeRouteUpdate } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { fuel_soldService } from '@/modules/fuel-sold/services/api.service'
    import { useFuelSoldStore } from '@/modules/fuel-sold/store/index'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { getFromCache } from '@/composables/useCache'
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import { initFlowbite } from 'flowbite'
    import TimePicker from '@/components/app/TimePicker.vue'

    const { t } = useI18n()
    const store = useFuelSoldStore()
    const route = useRoute()
    const mode = ref(route.params.mode)
    const loadingForm = ref(true)
    const stationId = ref('')
    const fuel_sold_id = route.path.split('/').pop()

    const appData = getFromCache('app_data')

    // ── Currency ──────────────────────────────────────────────────────────
    const currency = computed<string>(() => appData.value?.stations?.[0]?.currency ?? 'USD')
    const isUSD = computed(() => currency.value === 'USD')

    // ── Labels ────────────────────────────────────────────────────────────
    const amountPerLiterLabel = computed(() => t('fuel_sold.amount_per_lite_dynamic', { currency: currency.value }))

    // ── Calculated qty from nozzle ────────────────────────────────────────
    const calculatedQty = computed(() => {
        const start = parseFloat(String(store.formData.nozzle_start ?? ''))
        const end = parseFloat(String(store.formData.nozzle_end ?? ''))
        if (isNaN(start) || isNaN(end) || end < start) return 0
        return +(end - start).toFixed(4)
    })

    // ── Nozzle api service wrapper — maps createByNozzle / editByNozzle ──
    // BaseForm calls apiService[getServiceKey] for create
    // and apiService['edit'] for edit — we remap edit → editByNozzle
    const nozzleApiService = {
        createByNozzle: fuel_soldService.createByNozzle,
        edit: fuel_soldService.editByNozzle, // BaseForm calls 'edit' on update
        delete: fuel_soldService.delete,
    }

    // ── Fuel select ───────────────────────────────────────────────────────
    const selectedFuelId = computed({
        get() {
            return typeof store.formData.fuel === 'object' ? store.formData.fuel?._id : store.formData.fuel
        },
        set(value) {
            store.formData.fuel = value
        },
    })

    const handleSaveLoading = (isLoading: boolean) => {
        loadingForm.value = isLoading
    }

    const getFuelService = async () => {
        if (store.fuels.length === 0) {
            const response = await lookupService.getFuelByStationId(stationId.value)
            store.fuels = response?.data?.data ?? []
        }
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────
    onMounted(async () => {
        initFlowbite()
        stationId.value = appData.value?.stations?.[0]?._id ?? ''
        store.formData.station_id = stationId.value

        if (mode.value === 'create') {
            store.fuels = []
            await getFuelService()
            store.formData.createdAt = new Date()
            store.formData.startTime = appData.value?.startTime ?? ''
            store.formData.endTime = appData.value?.endTime ?? ''
        } else if (mode.value === 'edit') {
            await store.readDataFromApi(fuel_sold_id)
            store.fuels = []
            await getFuelService()
        } else if (mode.value === 'view') {
            await store.readDataFromApi(fuel_sold_id)
        }

        loadingForm.value = false
    })

    watch(mode, async newMode => {
        if (newMode === 'edit' || newMode === 'create') {
            store.fuels = []
            await getFuelService()
        }
    })

    onBeforeUnmount(() => {
        store.resetData()
    })

    onBeforeRouteUpdate((to, _from, next) => {
        mode.value = to.params.mode
        next()
    })
</script>

<style lang="scss" scoped>
    .field-label {
        @apply block mb-2 text-sm font-medium text-gray-900 dark:text-white;
    }
    .req {
        @apply text-red-500 ml-0.5;
    }
    .field-input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
           focus:ring-secondary focus:border-secondary block w-full p-2.5
           dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white;
    }
    .date-time-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        @media (min-width: 640px) {
            grid-template-columns: 1fr 1fr;
        }
        @media (min-width: 1024px) {
            grid-template-columns: 1.5fr 1fr 1fr;
        }
    }
    .date-time-cell {
        display: flex;
        flex-direction: column;
    }
    :deep(.DatePicker) .dp__pointer {
        border-radius: 8px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
        @media (min-width: 768px) {
            grid-template-columns: 1fr 1fr;
        }
        @media (min-width: 1280px) {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            .col-span-full {
                grid-column: 1 / -1;
            }
        }
    }
</style>
