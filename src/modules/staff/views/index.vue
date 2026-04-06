<template>
    <div class="p-4 md:p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('staff.title') }}</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ t('staff.total_staff', { count: totalRecords }) }}
                </p>
            </div>
            <!-- <router-link
                v-if="isAdmin"
                :to="`${basePath}/create`"
                class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 transition-colors"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ t('form.create') }}
            </router-link> -->
            <!-- <div class="relative inline-flex">
                <router-link
                    v-if="isAdmin"
                    :to="`${basePath}/create`"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 transition-colors"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {{ t('form.create') }}
                </router-link>

                <span
                    v-if="store.subscription?.hasProAccess"
                    class="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-white dark:bg-gray-800 shadow"
                >
                    <svg
                        aria-hidden="true"
                        class="w-4 h-4 text-blue-600 dark:text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </span>
            </div> -->
            <div class="relative inline-flex">
                <button
                    v-if="isAdmin"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:ring-4 focus:ring-secondary/30 transition-colors"
                    @click="onClickCreate"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {{ t('form.create') }}
                </button>

                <!-- Pro badge -->
                <span
                    v-if="!store.subscription?.hasProAccess"
                    class="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-white dark:bg-gray-800 shadow"
                >
                    <svg
                        aria-hidden="true"
                        class="w-4 h-4 text-blue-600 dark:text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
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

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
                v-for="n in 8"
                :key="n"
                class="rounded-2xl p-5 border border-gray-200 dark:border-gray-700 animate-pulse"
            >
                <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                    <div class="flex flex-col items-end gap-1.5">
                        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-14" />
                    </div>
                </div>
                <div class="space-y-2 mt-3">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div
            v-else-if="!isLoading && staffList.length === 0"
            class="flex flex-col items-center justify-center py-20 text-center"
        >
            <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t('staff.no_staff') }}</p>
        </div>

        <!-- Staff Cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div
                v-for="staff in staffList"
                :key="staff._id"
                class="group rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-200 cursor-pointer overflow-hidden"
                @click="onView(staff)"
            >
                <!-- Card Body -->
                <div class="p-5">
                    <!-- Avatar + Badges -->
                    <div class="flex items-start justify-between mb-4">
                        <AppAvatar :user="staff" size="lg" />
                        <div class="flex flex-col items-end gap-1.5 shrink-0">
                            <!-- Role Badge -->
                            <span
                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            >
                                {{ t(`staff.${staff.role?.role_name}`) || '—' }}
                            </span>
                            <!-- Active / Inactive Badge -->
                            <span
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                :class="
                                    staff.isSuspended || staff.isDeleted
                                        ? 'bg-red-50 text-[#f00317] dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-green-50 text-[#19b23e] dark:bg-green-900/30 dark:text-green-400'
                                "
                            >
                                <span
                                    class="w-1.5 h-1.5 rounded-full"
                                    :class="staff.isSuspended || staff.isDeleted ? 'bg-[#f00317]' : 'bg-[#19b23e]'"
                                />
                                {{ staff.isSuspended ? t('staff.inactive') : t('staff.active') }}
                            </span>
                        </div>
                    </div>

                    <!-- Name -->
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {{ staff.firstName }} {{ staff.lastName }}
                    </h3>

                    <!-- Contact -->
                    <div class="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <svg
                            v-if="staff.phone"
                            class="w-3.5 h-3.5 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                        </svg>
                        <svg
                            v-else-if="staff.email"
                            class="w-3.5 h-3.5 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <span class="truncate">{{ staff.phone || staff.email || '—' }}</span>
                    </div>

                    <!-- Language -->
                    <!-- <div class="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                            />
                        </svg>
                        <span>{{ staff.language === 'kh' ? 'ខ្មែរ' : 'English' }}</span>
                    </div> -->

                    <!-- Created At -->
                    <div class="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span>{{ formatDate(staff.createdAt) }}</span>
                    </div>

                    <!-- Clock icon -->
                    <div class="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <svg
                            class="w-4 h-4 flex-shrink-0 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="1.8"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                            />
                        </svg>
                        <span>{{ displayValue(staff.startTime) }} - {{ displayValue(staff.endTime) }}</span>
                    </div>
                </div>

                <!-- Card Footer Actions — always visible -->
                <div
                    v-if="currentUserRole !== 'User'"
                    class="border-t border-gray-200 dark:border-gray-700 px-5 py-3 flex items-center justify-end gap-3"
                >
                    <!-- Suspend Toggle -->
                    <button
                        v-if="staff._id !== currentUserId"
                        :disabled="staff.isDeleted"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        :class="
                            staff.isSuspended
                                ? 'text-[#19b23e] bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/40'
                                : 'text-[#f00317] bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40'
                        "
                        @click.stop="onToggleSuspend(staff)"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 3v4m-4.243 1.757a6 6 0 1 0 8.486 0"
                            />
                        </svg>
                        {{ staff.isSuspended ? t('staff.activate') : t('staff.suspend') }}
                    </button>
                    <span
                        v-if="staff._id === currentUserId"
                        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                        {{ t('staff.me') }}
                    </span>
                    <button
                        v-if="staff._id !== currentUserId"
                        :disabled="staff.isSuspended || staff.isDeleted"
                        class="text-blue-600 disabled:opacity-40 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
                        @click.stop="onEdit(staff)"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                    <span v-if="staff._id !== currentUserId" class="text-gray-300 dark:text-gray-600">|</span>
                    <button
                        v-if="staff._id !== currentUserId && !staff.isDeleted"
                        class="text-xs font-medium text-[#f00317] hover:text-[#f00317] dark:text-gray-400 dark:hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#f00317] dark:disabled:hover:text-gray-400"
                        @click.stop="onDelete(staff)"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                    <!-- Restore button — only show if deleted -->
                    <button
                        v-if="staff._id !== currentUserId && staff.isDeleted"
                        class="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        @click.stop="onRestore(staff)"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

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
    <!-- Delete Confirmation Modal -->
    <DeleteModal
        :show="isVisible"
        :title="t('staff.delete_confirm')"
        :description="''"
        @close="closeModal"
        @confirm="handleConfirmDelete"
    />

    <!-- Pro Access Warning Modal -->
    <!-- <SuccessModal
        :show="warningModal.show"
        type="warning"
        :title="warningModal.title"
        :description="warningModal.description"
        @close="warningModal.show = false"
        @confirm="handleSuccessConfirm"
    /> -->
    <ProUpgradeModal :show="warningModal.show" @close="warningModal.show = false" @confirm="handleSuccessConfirm" />
</template>

<script setup lang="ts">
    import { ref, onMounted, inject } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import _ from 'lodash'
    import { staffService } from '@/modules/staff/services/api.service'
    import { useStaffStore } from '@/modules/staff/store/index'
    import { useModal } from '@/composables/useModal'
    import { useAppStore } from '@/modules/app/store/index'
    import { getFromCache } from '@/composables/useCache'
    import type { IStaff } from '@/modules/staff/store/index'
    import { useFormatDate } from '@/composables/useFormatDate'
    import DeleteModal from '@/components/app/DeleteModal.vue'
    import { AuthKey } from '@/composables/useAuth'
    import ProUpgradeModal from '@/components/app/ProUpgradeModal.vue'

    const { isAdmin } = inject(AuthKey)!
    const { formatDate } = useFormatDate()
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStaffStore()
    const appStore = useAppStore()
    const { isVisible, showModal, closeModal } = useModal()

    const basePath = route.path
    const isLoading = ref(false)
    const staffList = ref<IStaff[]>([])
    const totalRecords = ref(0)
    const search = ref('')
    const deleteId = ref('')

    const appData = getFromCache('app_data')
    const stationId = appData.value.stations[0]._id
    const currentUserId = appData.value?._id
    const currentUserRole = appData.value?.role?.role_name

    // ── Modals ────────────────────────────────────────────────────────
    const successModal = ref({
        show: false,
        type: 'success' as 'success' | 'warning',
        title: '',
        description: '',
    })

    const errorModal = ref({
        show: false,
        description: '',
        message: '',
    })

    const handleErrorModalConfirm = () => {
        errorModal.value.show = false
    }

    const getData = async () => {
        isLoading.value = true
        try {
            const { data } = await staffService.getStaffByStationId({
                search: search.value,
                station_id: stationId,
            })
            staffList.value = data?.data ?? []
            totalRecords.value = data?.count ?? staffList.value.length
        } catch (error) {
            staffList.value = []
        } finally {
            isLoading.value = false
        }
    }

    const onSearch = _.debounce(() => {
        getData()
    }, 600)

    const onView = (staff: IStaff) => {
        if (staff._id === currentUserId) {
            router.push('/profile')
            return
        }
        router.push(`${basePath}/view/${staff._id}`)
    }

    const onEdit = (staff: IStaff) => {
        router.push(`${basePath}/edit/${staff._id}`)
    }

    const onDelete = (staff: IStaff) => {
        deleteId.value = staff._id
        showModal()
    }

    const handleConfirmDelete = async () => {
        try {
            appStore.loading = true
            const success = await store.deleteStaff(deleteId.value)
            if (success) {
                const target = staffList.value.find(s => s._id === deleteId.value)
                if (target) target.isDeleted = true

                successModal.value = {
                    show: true,
                    type: 'success',
                    title: t('staff.delete_success_title'),
                    description: t('staff.delete_success_desc'),
                }
            } else {
                errorModal.value = {
                    show: true,
                    description: t('staff.delete_failed'),
                    message: '',
                }
            }
        } catch (err: any) {
            errorModal.value = {
                show: true,
                description: t('staff.delete_failed'),
                message: err?.response?.data?.error || err?.message || '',
            }
        } finally {
            appStore.loading = false
            closeModal()
        }
    }

    const onRestore = async (staff: IStaff) => {
        try {
            appStore.loading = true
            await staffService.edit(staff._id, {
                isDeleted: false,
                deletedAt: null,
            })
            const target = staffList.value.find(s => s._id === staff._id)
            if (target) {
                target.isDeleted = false
                target.deletedAt = null
            }
            successModal.value = {
                show: true,
                type: 'success',
                title: t('staff.restore_success_title'),
                description: t('staff.restore_success_desc'),
            }
        } catch (err: any) {
            errorModal.value = {
                show: true,
                description: t('staff.restore_failed'),
                message: err?.response?.data?.error || err?.message || '',
            }
        } finally {
            appStore.loading = false
        }
    }

    onMounted(async () => {
        await Promise.all([getData(), store.fetchStation(stationId)])
    })

    const onToggleSuspend = async (staff: IStaff) => {
        try {
            staff.isSuspended = !staff.isSuspended
            await staffService.edit(staff._id, { isSuspended: staff.isSuspended })
        } catch (err: any) {
            staff.isSuspended = !staff.isSuspended
            // errorModal.show = true
            // errorModal.message = err.response?.data?.error || err.message
        }
    }

    // ── Display ───────────────────────────────────────────────────────
    const periodLabel = (p: 'AM' | 'PM') => (p === 'AM' ? t('time_picker.am') : t('time_picker.pm'))

    // ── Parse 24h string → 12h state ─────────────────────────────────
    const parse24 = (v?: string) => {
        if (!v) return { h12: 12, m: 0, p: 'AM' as 'AM' | 'PM' }
        const [hh, mm] = v.split(':').map(Number)
        const h = isNaN(hh) ? 0 : hh
        const m = isNaN(mm) ? 0 : mm
        const p: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM'
        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
        return { h12, m, p }
    }

    const displayValue = (time: string) => {
        if (!time) return ''
        const { h12, m, p } = parse24(time)
        return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${periodLabel(p)}`
    }

    // ── Pro access modal ──────────────────────────────────────────────
    const warningModal = ref({
        show: false,
        title: '',
        description: '',
    })

    const onClickCreate = () => {
        if (!store.subscription?.hasProAccess) {
            warningModal.value = {
                show: true,
                title: t('subscription.pro_required_title'),
                description: t('subscription.pro_required_desc'),
            }
            return
        }
        router.push(`${basePath}/create`)
    }

    const handleSuccessConfirm = () => {
        warningModal.value.show = false
        router.push('/payment')
    }
</script>
