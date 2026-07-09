<script setup lang="ts">
import { ref, onMounted, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFuelPriceEstimateStore } from '@/modules/fuel-price-estimate/store'
import type { IEstimate } from '@/modules/fuel-price-estimate/store'
import { useFormatDate } from '@/composables/useFormatDate'
import { getFromCache } from '@/composables/useCache'
import { AuthKey } from '@/composables/useAuth'
import DeleteModal from '@/components/app/DeleteModal.vue'

const { isSuperAdmin } = inject(AuthKey)!
const { t } = useI18n()
const router = useRouter()
const store = useFuelPriceEstimateStore()
const { formatDateTime } = useFormatDate()

const appData = getFromCache('app_data')
const currentUserId = appData?.value?._id as string
const isMe = (est: IEstimate) => est.postedBy?._id === currentUserId

// In-feed estimate creation
const content = ref('')
const selectedFiles = ref<File[]>([])
const previews = ref<string[]>([])
const error = ref('')
const MAX_IMAGES = 5

const canSubmit = computed(() => content.value.trim() || selectedFiles.value.length > 0)

const displayEstimates = computed(() => {
    return [...store.estimates].reverse()
})

const onFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    const files = Array.from(input.files ?? [])
    const remaining = MAX_IMAGES - selectedFiles.value.length
    const toAdd = files.slice(0, remaining)
    selectedFiles.value.push(...toAdd)
    toAdd.forEach(f => previews.value.push(URL.createObjectURL(f)))
    input.value = ''
}

const removeImage = (index: number) => {
    URL.revokeObjectURL(previews.value[index])
    selectedFiles.value.splice(index, 1)
    previews.value.splice(index, 1)
}

const handleSubmit = async () => {
    if (!canSubmit.value) {
        error.value = t('fuel_price_estimate.error_content_required')
        return
    }
    error.value = ''
    const fd = new FormData()
    if (content.value.trim()) fd.append('content', content.value.trim())
    selectedFiles.value.forEach(f => fd.append('images', f))

    const ok = await store.createEstimate(fd)
    if (ok) {
        content.value = ''
        selectedFiles.value = []
        previews.value = []
    } else {
        error.value = t('fuel_price_estimate.error_general')
    }
}

const deleteModal = ref({ show: false, id: '' })
const errorModal = ref({ show: false, description: '', message: '' })
const lightboxSrc = ref('')

onMounted(async () => {
    await store.fetchAll()
})

const handleLoadMore = async () => {
    if (store.pagination.page < store.pagination.totalPages) {
        await store.fetchAll(store.pagination.page + 1)
    }
}

const goDetail = (estimate: IEstimate) => {
    router.push(`/fuel-price-estimate/${estimate._id}`)
}

const onDeleteClick = (estimate: IEstimate) => {
    deleteModal.value = { show: true, id: estimate._id }
}

const handleDeleteConfirm = async () => {
    const ok = await store.deleteEstimate(deleteModal.value.id)
    deleteModal.value.show = false
    if (!ok) {
        errorModal.value = { show: true, description: t('fuel_price_estimate.error_general'), message: '' }
    }
}
</script>

<template>
    <!-- Telegram-channel-style full-height layout -->
    <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">

        <!-- ── Channel header (like Telegram top bar) ── -->
        <div class="shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
            <div class="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
                <div class="flex items-center gap-3">
                    <!-- Channel avatar -->
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0 shadow">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                            {{ t('fuel_price_estimate.title') }}
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500">
                            {{ store.pagination.total }} {{ t('fuel_price_estimate.comments') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Scrollable area ── -->
        <div class="flex-1 overflow-y-auto pb-24">
            <div class="max-w-2xl mx-auto w-full px-3 py-4 space-y-4">

                <!-- Loading skeletons -->
                <div v-if="store.loading" class="space-y-4 pt-2">
                    <div v-for="n in 3" :key="n" class="animate-pulse flex items-start gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div class="flex flex-col gap-1 w-full max-w-xs md:max-w-md">
                            <div class="bg-white dark:bg-gray-800 rounded-e-xl rounded-es-xl p-4 space-y-3 shadow-sm">
                                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div class="h-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-else-if="store.estimates.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
                    <div class="w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow flex items-center justify-center mb-4">
                        <svg class="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 font-semibold">{{ t('fuel_price_estimate.no_posts') }}</p>
                    <p class="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-xs">{{ t('fuel_price_estimate.no_posts_desc') }}</p>
                </div>

                <!-- ── Channel messages (Flowbite chat bubble pattern) ── -->
                <template v-else>
                    <div
                        v-for="est in displayEstimates"
                        :key="est._id"
                        class="space-y-4"
                    >
                        <!-- Others — left aligned -->
                        <div v-if="!isMe(est)" class="flex items-start gap-2.5">
                            <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center shrink-0 text-xs font-bold text-gray-600 dark:text-gray-300">
                                {{ est.postedBy?.firstName?.[0] ?? '?' }}{{ est.postedBy?.lastName?.[0] ?? '' }}
                            </div>
                            <div class="flex flex-col gap-1 w-full max-w-xs md:max-w-md">
                                <!-- Bubble card -->
                                <div
                                    class="w-full flex flex-col leading-1.5 p-3.5 border border-gray-200 bg-gray-50 rounded-e-xl rounded-es-xl dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors shadow-sm"
                                    @click="goDetail(est)"
                                >
                                    <div class="flex items-center space-x-2 mb-1">
                                        <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ est.postedBy?.firstName }} {{ est.postedBy?.lastName }}</span>
                                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(est.createdAt) }}</span>
                                    </div>
                                    <p class="text-sm text-gray-900 dark:text-white whitespace-pre-line line-clamp-5">{{ est.content }}</p>

                                    <!-- Images grid inside bubble -->
                                    <div v-if="est.images?.length" class="mt-2.5">
                                        <div
                                            class="grid gap-1 rounded-lg overflow-hidden"
                                            :class="{
                                                'grid-cols-1': est.images.length === 1,
                                                'grid-cols-2': est.images.length === 2 || est.images.length === 4,
                                                'grid-cols-3': est.images.length >= 3,
                                            }"
                                        >
                                            <div
                                                v-for="(img, i) in est.images.slice(0, 4)"
                                                :key="i"
                                                class="relative overflow-hidden"
                                                :class="{ 'col-span-2': est.images.length === 3 && i === 0 }"
                                                @click.stop="lightboxSrc = img.url"
                                            >
                                                <img
                                                    :src="img.url"
                                                    :alt="`Image ${i + 1}`"
                                                    class="w-full object-cover hover:scale-105 transition-transform duration-300"
                                                    :class="est.images.length === 1 ? 'max-h-60' : 'h-28'"
                                                />
                                                <div
                                                    v-if="i === 3 && est.images.length > 4"
                                                    class="absolute inset-0 bg-black/60 flex items-center justify-center"
                                                >
                                                    <span class="text-white text-base font-bold">+{{ est.images.length - 4 }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Bubble footer (comment count & date) -->
                                    <div class="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                                        <button
                                            class="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-hover transition-colors"
                                            @click.stop="goDetail(est)"
                                        >
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span>{{ est.commentCount ?? 0 }} {{ t('fuel_price_estimate.comments') }}</span>
                                        </button>
                                    </div>
                                </div>
                                <!-- Actions below bubble -->
                                <div v-if="isSuperAdmin" class="flex gap-3 ms-1">
                                    <button class="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" @click.stop="router.push(`/fuel-price-estimate/${est._id}`)">{{ t('fuel_price_estimate.edit') }}</button>
                                    <button class="text-xs text-gray-400 hover:text-red-500" @click.stop="onDeleteClick(est)">{{ t('fuel_price_estimate.delete') }}</button>
                                </div>
                            </div>
                        </div>

                        <!-- Me — right aligned -->
                        <div v-else class="flex items-start gap-2.5 justify-end">
                            <div class="flex flex-col gap-1 w-full max-w-xs md:max-w-md items-end">
                                <!-- Bubble card -->
                                <div
                                    class="w-full flex flex-col leading-1.5 p-3.5 bg-blue-600 rounded-s-xl rounded-ee-xl cursor-pointer hover:bg-blue-700 transition-colors shadow-sm"
                                    @click="goDetail(est)"
                                >
                                    <div class="flex items-center justify-end space-x-2 mb-1">
                                        <span class="text-xs text-blue-200">{{ formatDateTime(est.createdAt) }}</span>
                                    </div>
                                    <p class="text-sm text-white whitespace-pre-line line-clamp-5">{{ est.content }}</p>

                                    <!-- Images grid inside bubble -->
                                    <div v-if="est.images?.length" class="mt-2.5">
                                        <div
                                            class="grid gap-1 rounded-lg overflow-hidden"
                                            :class="{
                                                'grid-cols-1': est.images.length === 1,
                                                'grid-cols-2': est.images.length === 2 || est.images.length === 4,
                                                'grid-cols-3': est.images.length >= 3,
                                            }"
                                        >
                                            <div
                                                v-for="(img, i) in est.images.slice(0, 4)"
                                                :key="i"
                                                class="relative overflow-hidden"
                                                :class="{ 'col-span-2': est.images.length === 3 && i === 0 }"
                                                @click.stop="lightboxSrc = img.url"
                                            >
                                                <img
                                                    :src="img.url"
                                                    :alt="`Image ${i + 1}`"
                                                    class="w-full object-cover hover:scale-105 transition-transform duration-300"
                                                    :class="est.images.length === 1 ? 'max-h-60' : 'h-28'"
                                                />
                                                <div
                                                    v-if="i === 3 && est.images.length > 4"
                                                    class="absolute inset-0 bg-black/60 flex items-center justify-center"
                                                >
                                                    <span class="text-white text-base font-bold">+{{ est.images.length - 4 }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Bubble footer (comment count) -->
                                    <div class="flex items-center justify-between mt-3 pt-2 border-t border-blue-500/60">
                                        <button
                                            class="flex items-center gap-1 text-xs font-medium text-blue-200 hover:text-white transition-colors"
                                            @click.stop="goDetail(est)"
                                        >
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <span>{{ est.commentCount ?? 0 }} {{ t('fuel_price_estimate.comments') }}</span>
                                        </button>
                                    </div>
                                </div>
                                <!-- Actions below bubble -->
                                <div v-if="isSuperAdmin" class="flex gap-3 me-1">
                                    <button class="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" @click.stop="router.push(`/fuel-price-estimate/${est._id}`)">{{ t('fuel_price_estimate.edit') }}</button>
                                    <button class="text-xs text-gray-400 hover:text-red-500" @click.stop="onDeleteClick(est)">{{ t('fuel_price_estimate.delete') }}</button>
                                </div>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 text-xs font-bold text-blue-700 dark:text-blue-300">
                                {{ est.postedBy?.firstName?.[0] ?? '?' }}{{ est.postedBy?.lastName?.[0] ?? '' }}
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Load more -->
                <div v-if="store.pagination.page < store.pagination.totalPages" class="flex justify-center pt-3 pb-2">
                    <button
                        class="px-5 py-2 text-sm font-medium text-primary bg-white dark:bg-gray-800 border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors shadow-sm"
                        :disabled="store.loading"
                        @click="handleLoadMore"
                    >
                        {{ t('fuel_price_estimate.load_more') }}
                    </button>
                </div>

            </div>
        </div>

        <!-- ── Bottom announcement input bar (or read-only banner) ── -->
        <div class="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
            <div v-if="isSuperAdmin" class="max-w-2xl mx-auto px-3 py-3 space-y-2">
                <!-- Image previews row -->
                <div v-if="previews.length" class="flex flex-wrap gap-2 pb-2 border-b border-gray-150 dark:border-gray-700">
                    <div
                        v-for="(src, i) in previews"
                        :key="i"
                        class="relative group w-16 h-16 shrink-0"
                    >
                        <img :src="src" class="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                        <button
                            class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center shadow-md transition-colors"
                            @click="removeImage(i)"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <!-- Input area -->
                <div class="flex items-end gap-2">
                    <!-- Attach image button -->
                    <label
                        v-if="selectedFiles.length < MAX_IMAGES"
                        class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-150 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-sm"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <input type="file" accept="image/*" multiple class="hidden" @change="onFileChange" />
                    </label>

                    <textarea
                        id="new-post-content"
                        v-model="content"
                        rows="1"
                        :placeholder="t('fuel_price_estimate.post_content_placeholder')"
                        class="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition max-h-28"
                        style="field-sizing: content"
                        @keydown.enter.exact.prevent="handleSubmit"
                    />

                    <button
                        id="submit-estimate-btn"
                        :disabled="store.submitLoading || !canSubmit"
                        class="w-10 h-10 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
                        @click="handleSubmit"
                    >
                        <svg v-if="store.submitLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        <svg v-else class="w-4 h-4 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <div v-if="error" class="text-xs text-red-500 px-1">{{ error }}</div>
            </div>
            
            <!-- Read-only footer if not Super Admin -->
            <div v-else class="max-w-2xl mx-auto px-4 py-3.5 text-center text-sm text-gray-500 dark:text-gray-400">
                {{ t('fuel_price_estimate.admin_view_only') }}
            </div>
        </div>

        <!-- ── Lightbox ── -->
        <Teleport to="body">
            <Transition name="fade">
                <div
                    v-if="lightboxSrc"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    @click="lightboxSrc = ''"
                >
                    <img :src="lightboxSrc" class="max-w-[92vw] max-h-[88vh] rounded-xl object-contain shadow-2xl" @click.stop />
                    <button
                        class="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors"
                        @click="lightboxSrc = ''"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </Transition>
        </Teleport>

        <!-- Modals -->
        <DeleteModal
            :show="deleteModal.show"
            :title="t('fuel_price_estimate.confirm_delete_title')"
            :description="t('fuel_price_estimate.confirm_delete_desc')"
            @close="deleteModal.show = false"
            @confirm="handleDeleteConfirm"
        />
        <ErrorModal
            :show="errorModal.show"
            :description="errorModal.description"
            :error-message="errorModal.message"
            @confirm="errorModal.show = false"
        />
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
