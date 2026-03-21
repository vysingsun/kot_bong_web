<template>
    <BaseForm
        :title="t('fuel_sold.title')"
        :is-loading="loadingFrom"
        :editing-id="fuel_sold_id"
        :form-data="store.formData"
        :api-service="fuel_soldService"
        @on-save="handleSaveLoading"
    >
        <div class="form-grid">
            <!-- ① Fuel Type -->
            <div>
                <label class="field-label"> {{ t('fuel_sold.fuel_type') }} <span class="req">*</span> </label>
                <select v-model="selectedFuelId" class="field-input" required :disabled="mode === 'view'">
                    <option value="" disabled>{{ t('fuel_sold.fuel_type_placeholder') }}</option>
                    <option v-for="item in store.fuels" :key="item?._id" :value="item._id">
                        {{ item.fuel_name }}
                    </option>
                </select>
            </div>

            <!-- ② Quantity Sold (liters) -->
            <div>
                <label class="field-label"> {{ t('fuel_sold.quantity_as_liter') }} <span class="req">*</span> </label>
                <div class="relative">
                    <input
                        v-model="store.formData.quantity_sold_liter"
                        type="number"
                        step="0.01"
                        min="0"
                        class="field-input pr-12"
                        required
                        :disabled="mode === 'view'"
                    />
                    <button
                        v-if="mode !== 'view'"
                        type="button"
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-secondary dark:text-gray-400 dark:hover:text-secondary"
                        @click="openScanner"
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M5 8a1 1 0 0 1-2 0V5.923c0-.76.082-1.185.319-1.627.223-.419.558-.754.977-.977C4.738 3.082 5.162 3 5.923 3H8a1 1 0 0 1 0 2H5.923c-.459 0-.57.022-.684.082a.364.364 0 0 0-.157.157c-.06.113-.082.225-.082.684V8zm3 11a1 1 0 1 1 0 2H5.923c-.76 0-1.185-.082-1.627-.319a2.363 2.363 0 0 1-.977-.977C3.082 19.262 3 18.838 3 18.077V16a1 1 0 1 1 2 0v2.077c0 .459.022.57.082.684.038.07.087.12.157.157.113.06.225.082.684.082H8zm7-15a1 1 0 0 0 1 1h2.077c.459 0 .57.022.684.082.07.038.12.087.157.157.06.113.082.225.082.684V8a1 1 0 1 0 2 0V5.923c0-.76-.082-1.185-.319-1.627a2.363 2.363 0 0 0-.977-.977C19.262 3.082 18.838 3 18.077 3H16a1 1 0 0 0-1 1zm4 12a1 1 0 1 1 2 0v2.077c0 .76-.082 1.185-.319 1.627a2.364 2.364 0 0 1-.977.977c-.442.237-.866.319-1.627.319H16a1 1 0 1 1 0-2h2.077c.459 0 .57-.022.684-.082a.363.363 0 0 0 .157-.157c.06-.113.082-.225.082-.684V16zM3 11a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3z"
                                fill="currentColor"
                            />
                        </svg>
                        <span class="sr-only">Scan number</span>
                    </button>
                </div>
            </div>

            <!-- ③ Amount per Liter — label uses station currency -->
            <div>
                <label class="field-label"> {{ amountPerLiterLabel }} <span class="req">*</span> </label>
                <input
                    v-model="store.formData.amount_per_liter_khr"
                    type="number"
                    min="0"
                    step="0.01"
                    class="field-input"
                    required
                    :disabled="mode === 'view'"
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

            <!-- ⑤ Date · Start Time · End Time — inline row -->
            <div class="col-span-full">
                <div class="date-time-row">
                    <!-- Date -->
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
                        <!-- Start Time -->
                        <div class="w-1/2 date-time-cell">
                            <label class="field-label">
                                {{ t('fuel_sold.start_time') }} <span class="req">*</span>
                            </label>
                            <TimePicker
                                v-model="store.formData.startTime"
                                :disabled="mode === 'view'"
                                :placeholder="t('fuel_sold.time_placeholder')"
                                required
                            />
                        </div>

                        <!-- End Time -->
                        <div class="w-1/2 date-time-cell">
                            <label class="field-label">
                                {{ t('fuel_sold.end_time') }} <span class="req">*</span>
                            </label>
                            <TimePicker
                                v-model="store.formData.endTime"
                                :disabled="mode === 'view'"
                                :placeholder="t('fuel_sold.time_placeholder')"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- ⑥ Description — optional, full width -->
            <div class="col-span-full">
                <label class="field-label">
                    {{ t('fuel_sold.description') }}
                </label>
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

    <!-- Fullscreen Camera Scanner -->
    <Teleport to="body">
        <div v-if="showScanner" class="scanner-modal">
            <div class="scanner-container">
                <video ref="videoRef" autoplay playsinline></video>
                <canvas ref="canvasRef" style="display: none"></canvas>
                <div class="scanner-overlay">
                    <div class="scanner-header">
                        <button class="close-btn" @click="closeScanner">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="scanner-guide">
                        <div class="guide-frame"></div>
                        <p class="guide-text">Point camera at numbers</p>
                    </div>
                    <div class="scanner-controls">
                        <button class="capture-btn" :disabled="scanning" @click="captureAndScan">
                            <div v-if="scanning" class="spinner"></div>
                            <span v-else class="capture-circle"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed, onBeforeUnmount, onUnmounted, watch } from 'vue'
    import { useRoute, onBeforeRouteUpdate } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { fuel_soldService } from '@/modules/fuel-sold/services/api.service'
    import { useFuelSoldStore } from '@/modules/fuel-sold/store/index'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import { getFromCache } from '@/composables/useCache'
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import { initFlowbite } from 'flowbite'
    import { createWorker, type Worker } from 'tesseract.js'
    import TimePicker from '@/components/app/TimePicker.vue'

    const { t } = useI18n()

    // ── Camera / OCR ──────────────────────────────────────────────────
    const videoRef = ref<HTMLVideoElement | null>(null)
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    const showScanner = ref(false)
    const scanning = ref(false)
    let stream: MediaStream | null = null
    let ocrWorker: Worker | null = null

    // ── Store / Route ─────────────────────────────────────────────────
    const store = useFuelSoldStore()
    const route = useRoute()
    const mode = ref(route.params.mode)
    const loading = ref(false)
    const loadingFrom = ref(true)
    const stationId = ref('')
    const fuel_sold_id = route.path.split('/').pop()

    // ── Cache ─────────────────────────────────────────────────────────
    const appData = getFromCache('app_data')

    // Station currency — fallback USD
    const currency = computed<string>(() => appData.value?.stations?.[0]?.currency ?? 'USD')

    // ── Dynamic labels ────────────────────────────────────────────────
    /**
     * "Amount per Liter" label shows the station currency in parentheses.
     *   - Original KM key had "(គិតជារៀល)" hard-coded.
     *   - We now inject the real currency so it reads e.g.  "(USD)" or "(KHR)"
     */
    const amountPerLiterLabel = computed(() => t('fuel_sold.amount_per_lite_dynamic', { currency: currency.value }))

    // ── Fuel select ───────────────────────────────────────────────────
    const selectedFuelId = computed({
        get() {
            return typeof store.formData.fuel === 'object' ? store.formData.fuel?._id : store.formData.fuel
        },
        set(value) {
            store.formData.fuel = value
        },
    })

    const handleSaveLoading = (isLoading: boolean) => {
        loadingFrom.value = isLoading
    }

    // ── Load fuels ────────────────────────────────────────────────────
    const getFuelService = async () => {
        if (store.fuels.length === 0) {
            loading.value = true
            const response = await lookupService.getFuelByStationId(stationId.value)
            store.fuels = response?.data?.data ?? []
            loading.value = false
        }
    }

    // ── OCR ───────────────────────────────────────────────────────────
    const initializeOCR = async () => {
        ocrWorker = await createWorker('eng')
        await ocrWorker.setParameters({ tessedit_char_whitelist: '0123456789.' })
    }

    const openScanner = async () => {
        showScanner.value = true
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
            })
            await new Promise(r => setTimeout(r, 100))
            if (videoRef.value) videoRef.value.srcObject = stream
        } catch {
            alert('Could not access camera. Please check permissions.')
            closeScanner()
        }
    }

    const closeScanner = () => {
        stream?.getTracks().forEach(t => t.stop())
        stream = null
        showScanner.value = false
        scanning.value = false
    }

    const captureAndScan = async () => {
        if (!ocrWorker || scanning.value) return
        scanning.value = true
        const video = videoRef.value
        const canvas = canvasRef.value
        if (!video || !canvas) {
            scanning.value = false
            return
        }
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            scanning.value = false
            return
        }
        ctx.drawImage(video, 0, 0)
        try {
            const {
                data: { text },
            } = await ocrWorker.recognize(canvas)
            const numbers = text.replace(/[^\d.]/g, '').trim()
            if (numbers) {
                store.formData.quantity_sold_liter = parseFloat(numbers)
                closeScanner()
            } else {
                alert('No numbers detected. Please try again.')
                scanning.value = false
            }
        } catch {
            alert('Failed to scan. Please try again.')
            scanning.value = false
        }
    }

    // ── Lifecycle ─────────────────────────────────────────────────────
    onMounted(async () => {
        initializeOCR()
        initFlowbite()

        stationId.value = appData.value?.stations?.[0]?._id ?? ''
        store.formData.station_id = stationId.value

        if (mode.value === 'create') {
            store.formData.createdAt = new Date()
            store.fuels = []
            await getFuelService()

            // Pre-fill start/end time from cache — user can override.
            // If cache has no values, fields stay empty (required → user must enter).
            store.formData.startTime = appData.value?.timeStart ?? ''
            store.formData.endTime = appData.value?.timeEnd ?? ''
        } else if (mode.value === 'edit') {
            await store.readDataFromApi(fuel_sold_id)
            store.fuels = []
            await getFuelService()
        } else if (mode.value === 'view') {
            await store.readDataFromApi(fuel_sold_id)
        }

        loadingFrom.value = false
    })

    watch(mode, async newMode => {
        if (newMode === 'edit' || newMode === 'create') {
            store.fuels = []
            await getFuelService()
        }
    })

    onBeforeUnmount(() => {
        closeScanner()
        store.resetData()
    })
    onUnmounted(() => {
        ocrWorker?.terminate()
    })
    onBeforeRouteUpdate((to, _from, next) => {
        mode.value = to.params.mode
        next()
    })
</script>

<style lang="scss" scoped>
    /* ── Shared field styles ── */
    .field-label {
        @apply block mb-2 text-sm font-medium text-gray-900 dark:text-white;
    }
    .req {
        @apply text-red-500 ml-0.5;
    }
    .optional {
        @apply text-gray-400 font-normal text-xs ml-1;
    }
    .field-input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
           focus:ring-secondary focus:border-secondary block w-full p-2.5
           dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white;
    }

    /* ── Date + Time inline row ── */
    .date-time-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    @media (min-width: 640px) {
        .date-time-row {
            grid-template-columns: 1fr 1fr;
        }
    }
    @media (min-width: 1024px) {
        /* Date gets a bit more space than the two time pickers */
        .date-time-row {
            grid-template-columns: 1.5fr 1fr 1fr;
        }
    }
    .date-time-cell {
        display: flex;
        flex-direction: column;
    }

    /* ── DatePicker ── */
    :deep(.DatePicker) {
        .dp__pointer {
            border-radius: 8px;
            padding-top: 10px;
            padding-bottom: 10px;
        }
    }

    /* ── Form grid ── */
    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }
    @media (min-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    @media (min-width: 1280px) {
        .form-grid {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
        .form-grid .col-span-full {
            grid-column: 1 / -1;
        }
    }

    /* ── Scanner ── */
    .scanner-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        background: #000;
    }
    .scanner-container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }
    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .scanner-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
    }
    .scanner-header {
        padding: 20px;
        display: flex;
        justify-content: flex-end;
    }
    .close-btn {
        background: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
    }
    .close-btn:hover {
        background: rgba(0, 0, 0, 0.7);
    }
    .scanner-guide {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }
    .guide-frame {
        width: 95%;
        max-width: 400px;
        height: 90px;
        border: 3px solid rgba(255, 255, 255, 0.8);
        border-radius: 12px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
    }
    .guide-text {
        margin-top: 30px;
        color: white;
        font-size: 18px;
        font-weight: 500;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    .scanner-controls {
        padding: 40px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }
    .capture-btn {
        background: transparent;
        border: 4px solid white;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }
    .capture-btn:active:not(:disabled) {
        transform: scale(0.95);
    }
    .capture-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .capture-circle {
        width: 64px;
        height: 64px;
        background: white;
        border-radius: 50%;
    }
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
