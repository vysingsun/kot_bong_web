<template>
    <div class="px-4">
        <div v-if="isLoading" class="progress w-full mb-1"></div>
    </div>
    <div class="relative sm:rounded-lg p-4">
        <div v-if="isGlobalSearch" class="pb-4 max-w-[400px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('fuel_sold.search') }}
            </label>
            <div class="relative">
                <div
                    class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none"
                >
                    <svg
                        class="w-5 h-5 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </div>
                <input
                    id="table-search"
                    v-model="search"
                    type="text"
                    class="w-full block p-2 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary"
                    :placeholder="t('filter.search')"
                    @input="updateSearch"
                />
            </div>
        </div>
        <div class="max-w-[400px]">
            <slot name="top-bar" class="w-full"></slot>
        </div>

        <!-- Export button -->
        <div v-if="exportable && isAdmin" class="flex justify-end mb-3">
            <div class="relative inline-flex">
                <button
                    class="inline-flex items-center gap-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors"
                    @click="openDownloadModal()"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    {{ t('common.export_excel') }} {{ subscription?.hasProAccess }}
                </button>

                <span
                    v-if="!subscription?.hasProAccess"
                    class="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-white dark:bg-gray-800 shadow"
                >
                    <svg
                        aria-hidden="true"
                        class="w-4 h-4 text-blue-600 dark:text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </span>
            </div>
        </div>

        <div class="w-full overflow-x-auto rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th v-if="columnNo" scope="col" class="px-6 py-3 whitespace-nowrap">#</th>
                        <template v-for="(item, idx) of getHeaders" :key="idx">
                            <th :id="`header-${idx}`" scope="col" class="px-6 py-3 whitespace-nowrap">
                                {{ item.text }}
                            </th>
                        </template>
                        <th v-if="isAction" scope="col" class="px-6 py-3 text-center whitespace-nowrap">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="items?.length == 0" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td :colspan="columnNo ? getHeaders?.length + 1 : getHeaders?.length" class="text-center py-6">
                            <span>No matching records found</span>
                        </td>
                    </tr>
                    <tr
                        v-for="(item, ridx) of items"
                        :key="item"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        @click="clickableRow && isRowClickable(item) && onClickRow(item)"
                    >
                        <th v-if="columnNo" scope="row" class="px-6 py-4 whitespace-nowrap">
                            {{ getRowNumber(ridx) }}
                        </th>
                        <template v-for="({ value }, cidx) of headers" :key="cidx">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <slot :name="value" :item="item" :search="search || params.search">
                                    <span>{{ getItem(item, value) ?? '--' }}</span>
                                </slot>
                            </td>
                        </template>
                        <td v-if="isAction" class="px-6 py-4 text-center whitespace-nowrap">
                            <a
                                class="pr-2 font-medium text-red-600 dark:text-red-500 hover:underline inline-block"
                                @click.stop="onRemove(item)"
                                >{{ t('form.delet') }}</a
                            >
                            <a
                                class="font-medium text-blue-600 dark:text-blue-500 hover:underline inline-block"
                                @click.stop="onEdit(item)"
                                >{{ t('form.edit') }}</a
                            >
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <slot name="dynamic-title-summary-bar" :totals="props.totals" />

        <slot name="summary-bar" :totals="props.totals" />

        <nav class="flex items-center justify-between pt-6" aria-label="Table navigation">
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                {{ t('fuel_sold.total_records') }}
                <span class="font-semibold text-gray-900 dark:text-white">{{ totalRecords }}</span>
            </span>
            <select
                id="small"
                v-model="tableParams.page_size"
                class="block w-20 h-[35px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary"
                @change="updatePageSize(tableParams.page_size)"
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
                        :disabled="disable_btn_decrease_page"
                        class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        @click="updatePageDecrease"
                    >
                        <span class="sr-only">Previous</span>
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </li>
                <li>
                    <a
                        href="#"
                        class="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        >{{ tableParams.page_number }}</a
                    >
                </li>
                <li>
                    <button
                        :disabled="disable_btn_increase_page"
                        class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        @click="updatePageIncrease"
                    >
                        <span class="sr-only">Next</span>
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    </div>

    <BaseModal
        :is-visible="isVisible"
        type="error"
        :title="`Are you sure you want to delete this ${name}?`"
        confirm-label="Confirm"
        @close="closeModal()"
        @confirm="handleConfirmToDelete"
    />

    <!-- ═══════════════════════════════════════════════════════
         Liquid Glass Download Modal
    ═══════════════════════════════════════════════════════ -->
    <Teleport to="body">
        <Transition name="glass-modal">
            <div
                v-if="showDownloadModal"
                class="fixed inset-0 z-50 flex items-center justify-center"
                @click.self="showDownloadModal = false"
            >
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

                <!-- Glass card -->
                <div class="glass-card relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden">
                    <!-- Top shimmer line -->
                    <div
                        class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent z-10"
                    ></div>

                    <!-- Header -->
                    <div class="px-6 pt-8 pb-5 text-center">
                        <div
                            class="mx-auto mb-4 w-14 h-14 rounded-2xl glass-icon-wrap flex items-center justify-center"
                        >
                            <svg
                                class="w-7 h-7 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                        </div>
                        <h3 class="text-gray-900 font-semibold text-[17px] tracking-tight">
                            {{ t('common.export_excel') }}
                        </h3>
                        <p class="text-gray-500 text-[13px] mt-1 leading-relaxed">
                            {{ t('common.choose_export_type') }}
                        </p>
                    </div>

                    <!-- Options -->
                    <div class="px-4 pb-5 space-y-2.5">
                        <!-- Current screen option -->
                        <button
                            class="option-card w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200"
                            :class="downloadOption === 'current' ? 'option-selected' : 'option-unselected'"
                            @click="downloadOption = 'current'"
                        >
                            <div
                                class="opt-icon w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                :class="downloadOption === 'current' ? 'opt-icon-active' : 'opt-icon-idle'"
                            >
                                <svg
                                    class="w-[18px] h-[18px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-[13.5px] font-semibold text-gray-800 leading-tight">
                                    {{ t('common.current_data') }}
                                </p>
                                <p class="text-[12px] text-gray-500 mt-0.5 leading-snug">
                                    {{ t('common.current_data_desc') }}
                                </p>
                            </div>
                            <div
                                class="radio-outer w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                :class="
                                    downloadOption === 'current'
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-300 bg-transparent'
                                "
                            >
                                <Transition name="dot-pop">
                                    <div
                                        v-if="downloadOption === 'current'"
                                        class="w-[7px] h-[7px] rounded-full bg-white"
                                    ></div>
                                </Transition>
                            </div>
                        </button>

                        <!-- All records option -->
                        <button
                            class="option-card w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200"
                            :class="downloadOption === 'all' ? 'option-selected' : 'option-unselected'"
                            @click="downloadOption = 'all'"
                        >
                            <div
                                class="opt-icon w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                :class="downloadOption === 'all' ? 'opt-icon-active' : 'opt-icon-idle'"
                            >
                                <svg
                                    class="w-[18px] h-[18px]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-[13.5px] font-semibold text-gray-800 leading-tight">
                                    {{ t('common.all_data') }}
                                </p>
                                <p class="text-[12px] text-gray-500 mt-0.5 leading-snug">
                                    {{ t('common.all_data_desc') }}
                                </p>
                            </div>
                            <div
                                class="radio-outer w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                :class="
                                    downloadOption === 'all'
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-300 bg-transparent'
                                "
                            >
                                <Transition name="dot-pop">
                                    <div
                                        v-if="downloadOption === 'all'"
                                        class="w-[7px] h-[7px] rounded-full bg-white"
                                    ></div>
                                </Transition>
                            </div>
                        </button>
                    </div>

                    <!-- Separator -->
                    <div class="h-px bg-gray-200/80 mx-0"></div>

                    <!-- Action row — iOS alert style -->
                    <div class="flex">
                        <button
                            class="flex-1 py-[15px] text-[15px] font-normal text-gray-500 hover:text-gray-700 hover:bg-gray-50/60 transition-colors"
                            @click="showDownloadModal = false"
                        >
                            {{ t('common.cancel') }}
                        </button>
                        <div class="w-px bg-gray-200/80"></div>
                        <button
                            class="flex-1 py-[15px] text-[15px] font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                            :class="
                                isDownloading
                                    ? 'text-blue-400'
                                    : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/60'
                            "
                            :disabled="isDownloading"
                            @click="confirmDownload()"
                        >
                            <svg v-if="isDownloading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            {{ isDownloading ? t('common.loading') : t('common.confirm') }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
    <ProUpgradeModal :show="warningModal.show" @close="warningModal.show = false" @confirm="handleSuccessConfirm" />
</template>

<script setup lang="ts">
    import { onMounted, ref, reactive, computed, inject } from 'vue'
    import _ from 'lodash'
    import { initFlowbite } from 'flowbite'
    import { useRoute, useRouter } from 'vue-router'
    import { useModal } from '@/composables/useModal'
    import { useAppStore } from '@/modules/app/store/index'
    import { useI18n } from 'vue-i18n'
    import {
        generateExcel as generateExcelClient,
        triggerDownload,
        type ExcelColumn,
        type ExcelTotal,
    } from '@/utils/excel_generator'
    import { AuthKey } from '@/composables/useAuth'
    import { lookupService } from '@/atoms/lookup/lookup.services'
    import type { Subscription } from '@/modules/payment/services/api.service'
    import { getFromCache } from '@/composables/useCache'
    import ProUpgradeModal from '@/components/app/ProUpgradeModal.vue'

    const { isAdmin } = inject(AuthKey)!
    const appStore = useAppStore()
    const { t } = useI18n()
    const { isVisible, showModal, closeModal } = useModal()
    const router = useRouter()
    const route = useRoute()

    const emits = defineEmits(['rowClick', 'retrieveResult'])

    const props = defineProps({
        name: { type: String },
        apiService: { type: Object, required: true },
        getServiceKey: { type: String, default: 'get' },
        headers: { type: Array<any>, default: [] },
        params: { type: Object, default: {} },
        clickableRow: { type: Boolean, default: false },
        isRowClickable: { type: Function, default: () => true },
        columnNo: Boolean,
        loadDataOnMount: { type: Boolean, default: true },
        isGlobalSearch: { type: Boolean, default: false },
        isAction: { type: Boolean, default: true },
        totals: { type: Object as () => Record<string, any> | null, default: null },
        exportable: { type: Boolean, default: false },
        exportFilename: { type: String, default: 'report' },
        // (lang: 'en'|'kh') => ExcelColumn[]  — called at download time with current lang
        // This lets every header/getValue switch language automatically.
        exportColumns: { type: Function as unknown as () => (lang: string) => ExcelColumn[], default: null },
        // Totals for the footer row — static pre-computed values (takes priority over exportTotalsKeys)
        exportTotals: { type: Array as () => ExcelTotal[], default: () => [] },
        // (lang: 'en'|'kh') => string  — banner title, switches with language
        exportTitle: { type: Function as unknown as () => (lang: string) => string, default: null },
        // (lang: 'en'|'kh') => string  — sheet name, switches with language
        exportSheet: { type: Function as unknown as () => (lang: string) => string, default: null },
        // Auto-sum these fields for the totals footer — used when exportTotals=[]
        // Shape: { colIndex: number, key: string, numFmt?: string }[]
        exportTotalsKeys: {
            type: Array as () => { colIndex: number; key: string; numFmt?: string }[],
            default: () => [],
        },
    })

    // ── Table state ──────────────────────────────────────────
    const disable_btn_decrease_page = ref(true)
    const disable_btn_increase_page = ref(false)
    const totalRecords = ref(0)
    const paginationLength = computed(() => Math.ceil(totalRecords.value / tableParams.page_size))
    const getHeaders = computed(() => [...props.headers])
    const isLoading = ref(false)
    const tableParams = reactive({ page_number: 1, page_size: 10, search: '' })
    const extraParams = ref<any>({})
    const items = ref<any[]>([])
    const search = ref('')
    const record_id = ref('')

    // ── Download state ───────────────────────────────────────
    const showDownloadModal = ref(false)
    const downloadOption = ref<'current' | 'all'>('current')
    const isDownloading = ref(false)
    const subscription = ref<Subscription | null>(null)
    const appData = getFromCache('app_data')
    const warningModal = ref({
        show: false,
        title: '',
        description: '',
    })

    const openDownloadModal = () => {
        if (props.exportable && !subscription.value?.hasProAccess) {
            warningModal.value = {
                show: true,
                title: t('subscription.pro_required_title'),
                description: t('subscription.pro_required_desc'),
            }
            return
        }
        downloadOption.value = 'current'
        showDownloadModal.value = true
    }

    const handleSuccessConfirm = () => {
        warningModal.value.show = false
        router.push('/payment')
    }

    // ── Current data: generate Excel in-browser, zero API call ─
    const exportCurrentInBrowser = async () => {
        // Detect language from the app store (same source the server uses)
        const lang: string = (appStore as any).currentUser?.language === 'kh' ? 'kh' : 'en'
        const snapshot = items.value // stable reference for indexOf

        // Call exportColumns(lang) — returns translated ExcelColumn[]
        // Fallback: auto-build plain columns from props.headers (no translation)
        const baseCols: ExcelColumn[] =
            typeof props.exportColumns === 'function'
                ? props.exportColumns(lang)
                : props.headers.map((h: any) => ({
                      key: h.value ?? h.text,
                      header: h.text ?? h.value,
                      width: 18,
                      align: 'left' as const,
                  }))

        // Inject correct row index for '#' column (key='#')
        const cols: ExcelColumn[] = baseCols.map(col => {
            if (col.key === '#') {
                return {
                    ...col,
                    getValue: (_item: any) => snapshot.indexOf(_item) + 1,
                }
            }
            return col
        })

        // Auto-compute totals from exportTotalsKeys if no static totals passed
        const totals: ExcelTotal[] =
            props.exportTotals.length > 0
                ? props.exportTotals
                : props.exportTotalsKeys.map(({ colIndex, key, numFmt }: any) => ({
                      colIndex,
                      numFmt,
                      value: snapshot.reduce((acc: number, row: any) => {
                          const v = key.split('.').reduce((o: any, k: string) => o?.[k], row)
                          return acc + (typeof v === 'number' ? v : 0)
                      }, 0),
                  }))

        // Resolve translated title and sheet name
        const title = typeof props.exportTitle === 'function' ? props.exportTitle(lang) : props.exportFilename
        const sheetName = typeof props.exportSheet === 'function' ? props.exportSheet(lang) : 'Sheet1'

        const blob = await generateExcelClient({
            title,
            sheetName,
            lang,
            allRecords: false,
            columns: cols,
            rows: snapshot,
            totals,
        })

        triggerDownload(blob, `${props.exportFilename}_current_${Date.now()}.xlsx`)
    }

    // ── All data: call server /download endpoint ─────────────
    const triggerApiDownload = async (downloadParams: Record<string, any>, suffix: string) => {
        const res = await props.apiService['download'](downloadParams)
        const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${props.exportFilename}_${suffix}_${Date.now()}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    const confirmDownload = async () => {
        if (isDownloading.value) return
        isDownloading.value = true
        try {
            const { stationId, ...filters } = extraParams.value
            const hasFilter = Object.values(filters).some(v => v !== undefined && v !== null && v !== '')

            if (downloadOption.value === 'all') {
                // All records — stationId only, no filters, no pagination
                await triggerApiDownload({ stationId, all: 'true' }, 'all')
            } else {
                // Current view — send active filters + current page params
                // if (hasFilter) {
                await triggerApiDownload(
                    {
                        ...extraParams.value,
                        page_number: tableParams.page_number,
                        page_size: tableParams.page_size,
                    },
                    'current',
                )
                // } else {
                //     // No filters — stationId only (backend returns all for this station)
                //     await triggerApiDownload({ stationId }, 'current')
                // }
            }

            showDownloadModal.value = false
        } catch (err) {
            console.error('Failed to export', err)
        } finally {
            isDownloading.value = false
        }
    }

    // ── Table methods ────────────────────────────────────────
    const getItem = (obj: any, key: any) => _.get(obj, key)

    const getRowNumber = (idx: number) => {
        const n = idx + 1
        if (totalRecords.value > tableParams.page_size && tableParams.page_number > 1) {
            return (tableParams.page_number - 1) * tableParams.page_size + n
        }
        return n
    }

    const getData = async (renew = false) => {
        if (renew) tableParams.page_number = 1
        items.value = []
        isLoading.value = true
        try {
            const { data } = await props.apiService[props.getServiceKey]({ ...tableParams, ...extraParams.value })
            items.value = data?.data
            totalRecords.value = data?.count ?? data.data?.length
            isLoading.value = false
            emits('retrieveResult', {
                totalRecord: data?.count,
                data: data?.results,
                params: { ...extraParams.value },
                allData: data,
            })
            disable_btn_increase_page.value = tableParams.page_number >= paginationLength.value
            if (tableParams.page_number > 1) disable_btn_decrease_page.value = false
        } catch {
            items.value = []
            isLoading.value = false
        }
    }

    const onClickRow = (item: any) => emits('rowClick', item)
    const onRemove = (item: any) => {
        record_id.value = item._id
        showModal()
    }

    const handleConfirmToDelete = async () => {
        try {
            appStore.loading = true
            const res = await props.apiService['delete'](record_id.value)
            if (res?.data) {
                if (res.data.success) {
                    alert(`Delete ${props.name} Successfully`)
                    window.location.reload()
                } else alert(res.data.error || `Delete ${props.name} Unsuccessfully`)
            } else {
                alert(`Delete ${props.name} Unsuccessfully - No response`)
            }
        } catch (err) {
            const error = err as any
            if (error.response?.data) alert(`Error: ${error.response.data.error || error.response.data.message}`)
            else if (error.request) alert('Network error: Unable to reach server')
            else alert(`An error occurred: ${error.message}`)
        } finally {
            appStore.loading = false
        }
    }

    const onEdit = (item: any) => {
        const baseUrl = route.path.split('/edit')[0]
        router.push(`${baseUrl}/edit/${item._id}`)
    }

    const updateSearch = _.debounce(async () => {
        tableParams.search = search.value
        tableParams.page_number = 1
        getData()
    }, 1000)

    const updatePageSize = async (pageSize: any) => {
        if (pageSize * tableParams.page_number > totalRecords.value) tableParams.page_number = 1
        tableParams.page_size = pageSize
        getData()
    }

    const updatePageDecrease = async () => {
        tableParams.page_number -= 1
        if (tableParams.page_number === 1) disable_btn_decrease_page.value = true
        if (tableParams.page_number <= paginationLength.value) disable_btn_increase_page.value = false
        getData()
    }

    const updatePageIncrease = async () => {
        tableParams.page_number += 1
        if (tableParams.page_number >= paginationLength.value) disable_btn_increase_page.value = true
        if (tableParams.page_number > 1) disable_btn_decrease_page.value = false
        getData()
    }

    onMounted(async () => {
        initFlowbite()
        extraParams.value = { ...props.params }
        await fetchStation(appData.value.stations[0]._id)
        if (props.loadDataOnMount) getData()
    })

    async function fetchStation(stationId: string) {
        try {
            const res = await lookupService.getStationById(stationId)
            subscription.value = res.data.data.subscription
        } catch (err: any) {
            alert(err?.response?.data?.message ?? 'Failed to load station')
        }
    }
</script>

<style lang="scss" scoped>
    /* ── Glass card ─────────────────────────────────────────────── */
    .glass-card {
        background: rgba(255, 255, 255, 0.26);
        backdrop-filter: blur(8px) saturate(200%) brightness(1.02);
        -webkit-backdrop-filter: blur(48px) saturate(200%) brightness(1.02);
        border: 1px solid rgba(255, 255, 255, 0.95);
        box-shadow:
            0 0 0 0.5px rgba(255, 255, 255, 0.5) inset,
            0 24px 56px rgba(0, 0, 0, 0.18),
            0 6px 18px rgba(0, 0, 0, 0.1);
    }

    /* ── Icon wrap ──────────────────────────────────────────────── */
    .glass-icon-wrap {
        background: linear-gradient(145deg, #dbeafe, #eff6ff);
        border: 1px solid rgba(147, 197, 253, 0.5);
        box-shadow:
            0 4px 14px rgba(59, 130, 246, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    /* ── Option cards ───────────────────────────────────────────── */
    .option-card {
        outline: none;
    }

    .option-selected {
        background: rgba(239, 246, 255, 0.95);
        border: 1.5px solid rgba(147, 197, 253, 0.8);
        box-shadow:
            0 1px 3px rgba(59, 130, 246, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .option-unselected {
        background: rgba(249, 250, 251, 0.7);
        border: 1.5px solid rgba(229, 231, 235, 0.8);

        &:hover {
            background: rgba(243, 244, 246, 0.9);
            border-color: rgba(209, 213, 219, 0.9);
        }
    }

    /* ── Option icons ───────────────────────────────────────────── */
    .opt-icon-active {
        background: linear-gradient(145deg, #dbeafe, #bfdbfe);
        border: 1px solid rgba(147, 197, 253, 0.6);
        color: #2563eb;
    }

    .opt-icon-idle {
        background: rgba(243, 244, 246, 0.9);
        border: 1px solid rgba(229, 231, 235, 0.8);
        color: #9ca3af;
    }

    /* ── Modal transition ───────────────────────────────────────── */
    .glass-modal-enter-active {
        transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .glass-modal-leave-active {
        transition: all 0.18s cubic-bezier(0.4, 0, 1, 1);
    }
    .glass-modal-enter-from,
    .glass-modal-leave-to {
        opacity: 0;
        transform: scale(0.94) translateY(12px);
    }

    /* ── Radio dot pop ──────────────────────────────────────────── */
    .dot-pop-enter-active {
        transition:
            transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.12s ease;
    }
    .dot-pop-leave-active {
        transition:
            transform 0.1s ease-in,
            opacity 0.1s ease;
    }
    .dot-pop-enter-from {
        transform: scale(0);
        opacity: 0;
    }
    .dot-pop-leave-to {
        transform: scale(0);
        opacity: 0;
    }
</style>
