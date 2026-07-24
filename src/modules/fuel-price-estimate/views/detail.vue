<script setup lang="ts">
    import { ref, onMounted, onUnmounted, inject, nextTick } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import { useFuelPriceEstimateStore } from '@/modules/fuel-price-estimate/store'
    import type { IComment } from '@/modules/fuel-price-estimate/store'
    import { useFormatDate } from '@/composables/useFormatDate'
    import { getFromCache } from '@/composables/useCache'
    import { AuthKey } from '@/composables/useAuth'
    import DeleteModal from '@/components/app/DeleteModal.vue'

    const { isSuperAdmin, isAdmin } = inject(AuthKey)!
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const store = useFuelPriceEstimateStore()
    const { formatDateTime } = useFormatDate()

    const estimateId = route.params.id as string
    const appData = getFromCache('app_data')
    const currentUserId = appData?.value?._id as string

    // Edit estimate
    const isEditing = ref(false)
    const editContent = ref('')
    const editFiles = ref<File[]>([])
    const editPreviews = ref<string[]>([])
    const editExistingImages = ref<{ url: string; publicId: string }[]>([])
    const removedPublicIds = ref<string[]>([])
    const MAX_IMAGES = 5

    // Comment
    const commentInput = ref('')
    const editingComment = ref<IComment | null>(null)
    const editCommentText = ref('')
    const commentListRef = ref<HTMLElement | null>(null)
    const savingCommentId = ref<string | null>(null) // tracks which comment is syncing to server

    // Lightbox
    const lightboxSrc = ref('')

    // Modals
    const deleteEstimateModal = ref(false)
    const deleteCommentModal = ref({ show: false, id: '' })
    const errorModal = ref({ show: false, description: '', message: '' })

    const scrollToBottom = () => {
        nextTick(() => {
            if (commentListRef.value) {
                commentListRef.value.scrollTop = commentListRef.value.scrollHeight
            }
        })
    }

    onMounted(async () => {
        store.joinEstimateRoom(estimateId)
        await store.fetchById(estimateId)
        await store.fetchComments(estimateId)
        scrollToBottom()
    })

    onUnmounted(() => {
        store.leaveEstimateRoom(estimateId)
    })

    const handleScroll = async () => {
        if (!commentListRef.value) return

        // Scroll UP to top loads older comments (like Telegram: pull up to see history)
        const { scrollTop } = commentListRef.value
        if (
            scrollTop < 50 &&
            !store.commentLoading &&
            store.commentPagination.page < store.commentPagination.totalPages
        ) {
            const previousScrollHeight = commentListRef.value.scrollHeight

            await store.fetchComments(estimateId, store.commentPagination.page + 1)

            // After prepending older messages, restore scroll position so user stays at the same spot
            nextTick(() => {
                if (commentListRef.value) {
                    const newScrollHeight = commentListRef.value.scrollHeight
                    commentListRef.value.scrollTop = newScrollHeight - previousScrollHeight + scrollTop
                }
            })
        }
    }

    const startEdit = () => {
        editContent.value = store.currentEstimate?.content ?? ''
        editExistingImages.value = [...(store.currentEstimate?.images ?? [])]
        removedPublicIds.value = []
        editFiles.value = []
        editPreviews.value = []
        isEditing.value = true
    }
    const cancelEdit = () => {
        isEditing.value = false
    }

    const removeExistingImage = (publicId: string) => {
        removedPublicIds.value.push(publicId)
        editExistingImages.value = editExistingImages.value.filter(i => i.publicId !== publicId)
    }

    const onEditFileChange = (e: Event) => {
        const input = e.target as HTMLInputElement
        const toAdd = Array.from(input.files ?? []).slice(
            0,
            MAX_IMAGES - editExistingImages.value.length - editFiles.value.length,
        )
        editFiles.value.push(...toAdd)
        toAdd.forEach(f => editPreviews.value.push(URL.createObjectURL(f)))
        input.value = ''
    }

    const removeNewImage = (i: number) => {
        URL.revokeObjectURL(editPreviews.value[i])
        editFiles.value.splice(i, 1)
        editPreviews.value.splice(i, 1)
    }

    const submitEdit = async () => {
        const fd = new FormData()
        if (editContent.value.trim()) fd.append('content', editContent.value.trim())
        editFiles.value.forEach(f => fd.append('images', f))
        if (removedPublicIds.value.length) fd.append('removePublicIds', JSON.stringify(removedPublicIds.value))
        const ok = await store.updateEstimate(estimateId, fd)
        if (ok) {
            isEditing.value = false
        } else errorModal.value = { show: true, description: t('fuel_price_estimate.error_general'), message: '' }
    }

    const handleDeleteEstimate = async () => {
        const ok = await store.deleteEstimate(estimateId)
        deleteEstimateModal.value = false
        if (ok) router.push('/fuel-price-estimate')
    }

    // Comment attachments state
    const commentFiles = ref<File[]>([])
    const commentPreviews = ref<string[]>([])

    // Edit comment attachments state
    const editCommentFiles = ref<File[]>([])
    const editCommentPreviews = ref<string[]>([])
    const editCommentExistingImages = ref<{ url: string; publicId: string }[]>([])
    const editCommentRemovedPublicIds = ref<string[]>([])

    const onCommentFileChange = (e: Event) => {
        const input = e.target as HTMLInputElement
        const toAdd = Array.from(input.files ?? []).slice(0, MAX_IMAGES - commentFiles.value.length)
        commentFiles.value.push(...toAdd)
        toAdd.forEach(f => commentPreviews.value.push(URL.createObjectURL(f)))
        input.value = ''
    }

    const removeCommentFile = (i: number) => {
        URL.revokeObjectURL(commentPreviews.value[i])
        commentFiles.value.splice(i, 1)
        commentPreviews.value.splice(i, 1)
    }

    const onEditCommentFileChange = (e: Event) => {
        const input = e.target as HTMLInputElement
        const toAdd = Array.from(input.files ?? []).slice(
            0,
            MAX_IMAGES - editCommentExistingImages.value.length - editCommentFiles.value.length,
        )
        editCommentFiles.value.push(...toAdd)
        toAdd.forEach(f => editCommentPreviews.value.push(URL.createObjectURL(f)))
        input.value = ''
    }

    const removeCommentNewImage = (i: number) => {
        URL.revokeObjectURL(editCommentPreviews.value[i])
        editCommentFiles.value.splice(i, 1)
        editCommentPreviews.value.splice(i, 1)
    }

    const removeCommentExistingImage = (publicId: string) => {
        editCommentRemovedPublicIds.value.push(publicId)
        editCommentExistingImages.value = editCommentExistingImages.value.filter(img => img.publicId !== publicId)
    }

    const postComment = async () => {
        if (!commentInput.value.trim() && commentFiles.value.length === 0) return

        const originalCommentText = commentInput.value
        const originalFiles = [...commentFiles.value]
        const originalPreviews = [...commentPreviews.value]

        // Clear input field immediately
        commentInput.value = ''
        commentFiles.value = []
        commentPreviews.value = []

        // Scroll to bottom immediately
        scrollToBottom()

        const fd = new FormData()
        fd.append('content', originalCommentText.trim())
        originalFiles.forEach(f => fd.append('images', f))

        const ok = await store.addComment(estimateId, fd)
        if (ok) {
            scrollToBottom()
        } else {
            // Rollback text input and previews
            commentInput.value = originalCommentText
            commentFiles.value = originalFiles
            commentPreviews.value = originalPreviews
            errorModal.value = { show: true, description: t('fuel_price_estimate.error_general'), message: '' }
        }
    }

    const startEditComment = (c: IComment) => {
        editingComment.value = c
        editCommentText.value = c.content
        editCommentExistingImages.value = [...(c.images ?? [])]
        editCommentFiles.value = []
        editCommentPreviews.value = []
        editCommentRemovedPublicIds.value = []
    }

    const cancelEditComment = () => {
        editingComment.value = null
    }

    const saveEditComment = async () => {
        if (!editingComment.value) return
        if (
            !editCommentText.value.trim() &&
            editCommentExistingImages.value.length === 0 &&
            editCommentFiles.value.length === 0
        )
            return

        const id = editingComment.value._id
        const newText = editCommentText.value.trim()
        const newFiles = [...editCommentFiles.value]
        const newPreviews = [...editCommentPreviews.value]
        const existingImages = [...editCommentExistingImages.value]
        const removedPublicIdsList = [...editCommentRemovedPublicIds.value]

        // Close the form immediately — the store already updates the bubble optimistically
        editingComment.value = null
        savingCommentId.value = id

        const fd = new FormData()
        fd.append('content', newText)
        newFiles.forEach(f => fd.append('images', f))
        if (removedPublicIdsList.length) {
            fd.append('removePublicIds', JSON.stringify(removedPublicIdsList))
        }

        const ok = await store.updateComment(id, fd)
        savingCommentId.value = null

        if (!ok) {
            // Rollback: reopen the edit form so user can try again
            const c = store.comments.find(c => c._id === id)
            if (c) {
                editingComment.value = c
                editCommentText.value = newText
                editCommentExistingImages.value = existingImages
                editCommentFiles.value = newFiles
                editCommentPreviews.value = newPreviews
                editCommentRemovedPublicIds.value = removedPublicIdsList
            }
            errorModal.value = { show: true, description: t('fuel_price_estimate.error_general'), message: '' }
        }
    }

    const onDeleteComment = (id: string) => {
        deleteCommentModal.value = { show: true, id }
    }
    const handleDeleteComment = async () => {
        const ok = await store.deleteComment(deleteCommentModal.value.id, estimateId)
        deleteCommentModal.value.show = false
        if (!ok) errorModal.value = { show: true, description: t('fuel_price_estimate.error_general'), message: '' }
    }

    // Super_Admin can delete any comment, but can only edit their OWN
    // Admin can only edit and delete their own comments
    const canEdit = (c: IComment) => c.postedBy._id === currentUserId
    const canDelete = (c: IComment) => isSuperAdmin.value || c.postedBy._id === currentUserId
    const isMe = (c: IComment) => c.postedBy._id === currentUserId
</script>

<template>
    <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
        <!-- ── Top bar ── -->
        <div class="shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
            <div class="max-w-2xl mx-auto flex items-center gap-3 px-4 py-3">
                <button
                    class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                    @click="router.push('/fuel-price-estimate')"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div
                    class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0"
                >
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {{ t('fuel_price_estimate.detail_title') }}
                    </p>
                    <p class="text-xs text-gray-400">
                        {{ store.comments.length }} {{ t('fuel_price_estimate.comments') }}
                    </p>
                </div>
                <div v-if="isSuperAdmin && !isEditing && store.currentEstimate" class="flex items-center gap-1">
                    <button
                        class="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        @click="startEdit"
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
                    <button
                        class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        @click="deleteEstimateModal = true"
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
                </div>
            </div>
        </div>

        <!-- ── Scrollable area ── -->
        <div ref="commentListRef" class="flex-1 overflow-y-auto pb-24" @scroll="handleScroll">
            <div class="max-w-2xl mx-auto px-3 py-4 space-y-2">
                <!-- Loading — shown only before the estimate card is first fetched -->
                <div v-if="store.loading && !store.currentEstimate" class="space-y-4 animate-pulse pt-2">
                    <!-- Channel post skeleton -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 space-y-3 border-gray-200 dark:border-gray-700"
                    >
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                        </div>
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                        <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    </div>
                    <!-- Comment skeletons -->
                    <div v-for="n in 4" :key="n" class="flex gap-2">
                        <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                        <div class="flex-1 space-y-1.5 max-w-xs">
                            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                        </div>
                    </div>
                </div>

                <template v-if="store.currentEstimate">
                    <!-- ── Channel post card (Telegram channel bubble style) ── -->
                    <div class="mb-3">
                        <!-- Channel badge label -->
                        <div class="flex items-center gap-2 mb-1 px-1">
                            <div
                                class="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0"
                            >
                                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <span class="text-xs font-semibold text-primary">{{ t('fuel_price_estimate.title') }}</span>
                            <span class="text-xs text-gray-400 ml-auto">{{
                                t('fuel_price_estimate.channel_post')
                            }}</span>
                        </div>

                        <!-- Bubble card -->
                        <div
                            class="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm shadow-sm overflow-hidden border-primary/60"
                        >
                            <!-- View mode -->
                            <template v-if="!isEditing">
                                <p
                                    v-if="store.currentEstimate.content"
                                    class="px-4 pt-3 pb-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line"
                                >
                                    {{ store.currentEstimate.content }}
                                </p>
                                <div v-if="store.currentEstimate.images?.length" class="px-4 py-3">
                                    <div
                                        class="grid gap-1 rounded-xl overflow-hidden"
                                        :class="{
                                            'grid-cols-1': store.currentEstimate.images.length === 1,
                                            'grid-cols-2': store.currentEstimate.images.length >= 2,
                                        }"
                                    >
                                        <img
                                            v-for="(img, i) in store.currentEstimate.images"
                                            :key="i"
                                            :src="img.url"
                                            class="w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            :class="store.currentEstimate.images.length === 1 ? 'max-h-72' : 'h-44'"
                                            @click="lightboxSrc = img.url"
                                        />
                                    </div>
                                </div>
                                <!-- Footer: edited badge + timestamp -->
                                <div
                                    class="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-700/60"
                                >
                                    <span
                                        v-if="
                                            store.currentEstimate.updatedAt &&
                                                new Date(store.currentEstimate.updatedAt).getTime() >
                                                new Date(store.currentEstimate.createdAt).getTime()
                                        "
                                        class="flex items-center gap-1 text-xs text-gray-400 italic"
                                    >
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        {{ t('fuel_price_estimate.edited') }}
                                    </span>
                                    <span v-else />
                                    <span class="text-xs text-gray-400 tabular-nums">{{
                                        formatDateTime(store.currentEstimate.createdAt)
                                    }}</span>
                                </div>
                            </template>

                            <!-- Edit mode (Super_Admin only) -->
                            <template v-else>
                                <div class="px-4 py-4 space-y-3">
                                    <textarea
                                        v-model="editContent"
                                        rows="4"
                                        :placeholder="t('fuel_price_estimate.post_content_placeholder')"
                                        class="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    />
                                    <!-- Existing images -->
                                    <div v-if="editExistingImages.length" class="flex flex-wrap gap-2">
                                        <div
                                            v-for="img in editExistingImages"
                                            :key="img.publicId"
                                            class="relative group w-16 h-16"
                                        >
                                            <img :src="img.url" class="w-full h-full object-cover rounded-lg" />
                                            <button
                                                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                @click="removeExistingImage(img.publicId)"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                    <!-- New previews -->
                                    <div v-if="editPreviews.length" class="flex flex-wrap gap-2">
                                        <div v-for="(src, i) in editPreviews" :key="i" class="relative group w-16 h-16">
                                            <img :src="src" class="w-full h-full object-cover rounded-lg" />
                                            <button
                                                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                @click="removeNewImage(i)"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <label
                                            v-if="editExistingImages.length + editFiles.length < MAX_IMAGES"
                                            class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary cursor-pointer transition-colors"
                                        >
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {{ t('fuel_price_estimate.attach_images') }}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                class="hidden"
                                                @change="onEditFileChange"
                                            />
                                        </label>
                                        <div class="flex gap-2 ml-auto">
                                            <button
                                                class="px-3 py-1.5 text-xs rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                @click="cancelEdit"
                                            >
                                                {{ t('fuel_price_estimate.cancel') }}
                                            </button>
                                            <button
                                                :disabled="store.submitLoading"
                                                class="px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-lg flex items-center gap-1"
                                                @click="submitEdit"
                                            >
                                                <svg
                                                    v-if="store.submitLoading"
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
                                                        d="M4 12a8 8 0 018-8v8z"
                                                    />
                                                </svg>
                                                {{
                                                    store.submitLoading
                                                        ? t('fuel_price_estimate.saving')
                                                        : t('fuel_price_estimate.save')
                                                }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- ── Divider ── -->
                    <div class="flex items-center gap-2 py-1">
                        <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span class="text-xs text-gray-400 shrink-0">
                            {{ store.comments.length }} {{ t('fuel_price_estimate.comments') }}</span
                        >
                        <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <!-- ── Comments skeleton — only when initially empty (first load) ── -->
                    <div
                        v-if="store.commentLoading && store.comments.length === 0"
                        class="space-y-3 pt-1 animate-pulse"
                    >
                        <div v-for="n in 5" :key="n" class="flex gap-2">
                            <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                            <div class="flex-1 space-y-1.5 max-w-xs md:max-w-md">
                                <div class="flex gap-2">
                                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-14" />
                                </div>
                                <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                            </div>
                        </div>
                    </div>

                    <!-- ── No comments ── -->
                    <div
                        v-else-if="!store.commentLoading && store.comments.length === 0"
                        class="py-6 text-center text-sm text-gray-400"
                    >
                        {{ t('fuel_price_estimate.no_comments') }}
                    </div>

                    <!-- ── Comment bubbles (Flowbite chat bubble) ── -->
                    <div v-if="store.comments.length > 0" class="space-y-4 pb-2">
                        <!-- Top spinner: loading older messages when scrolled up -->
                        <div v-if="store.commentLoading" class="flex items-center justify-center gap-2 py-2">
                            <svg class="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <span class="text-xs text-gray-400">Loading older comments…</span>
                        </div>

                        <div v-for="comment in store.comments" :key="comment._id">
                            <!-- Edit inline mode -->
                            <div
                                v-if="editingComment?._id === comment._id"
                                :class="isMe(comment) ? 'flex justify-end' : 'flex'"
                            >
                                <div
                                    class="w-full max-w-xs md:max-w-md space-y-1.5 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                                >
                                    <textarea
                                        v-model="editCommentText"
                                        rows="2"
                                        class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        @keydown.enter.exact.prevent="saveEditComment"
                                    />

                                    <!-- Existing comment images -->
                                    <div v-if="editCommentExistingImages.length" class="flex flex-wrap gap-2">
                                        <div
                                            v-for="img in editCommentExistingImages"
                                            :key="img.publicId"
                                            class="relative group w-14 h-14"
                                        >
                                            <img :src="img.url" class="w-full h-full object-cover rounded-lg" />
                                            <button
                                                type="button"
                                                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                                @click="removeCommentExistingImage(img.publicId)"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>

                                    <!-- New comment previews -->
                                    <div v-if="editCommentPreviews.length" class="flex flex-wrap gap-2">
                                        <div
                                            v-for="(src, i) in editCommentPreviews"
                                            :key="i"
                                            class="relative group w-14 h-14"
                                        >
                                            <img :src="src" class="w-full h-full object-cover rounded-lg" />
                                            <button
                                                type="button"
                                                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                                @click="removeCommentNewImage(i)"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-between">
                                        <label
                                            v-if="
                                                editCommentExistingImages.length + editCommentFiles.length < MAX_IMAGES
                                            "
                                            class="flex items-center gap-1 text-xs text-gray-400 hover:text-primary cursor-pointer transition-colors"
                                        >
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            Attach Photos
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                class="hidden"
                                                @change="onEditCommentFileChange"
                                            />
                                        </label>
                                        <div class="flex gap-2 ml-auto">
                                            <button
                                                class="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                @click="cancelEditComment"
                                            >
                                                {{ t('fuel_price_estimate.cancel') }}
                                            </button>
                                            <button
                                                class="text-xs px-3 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                                                @click="saveEditComment"
                                            >
                                                {{ t('fuel_price_estimate.save_comment') }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Others — left aligned -->
                            <div v-else-if="!isMe(comment)" class="flex items-start gap-2.5">
                                <div
                                    v-if="comment.postedBy?.role?.role_name === 'Super_Admin'"
                                    class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0 text-xs font-bold text-white shadow-sm"
                                >
                                    📢
                                </div>
                                <div
                                    v-else
                                    class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center shrink-0 text-xs font-bold text-gray-600 dark:text-gray-300"
                                >
                                    {{ comment.postedBy?.firstName?.[0] }}{{ comment.postedBy?.lastName?.[0] }}
                                </div>
                                <div class="flex flex-col gap-1 w-full max-w-xs md:max-w-md">
                                    <div
                                        class="flex flex-col leading-1.5 p-3 border border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700 dark:border-gray-600 w-full shadow-sm"
                                    >
                                        <div class="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
                                            <span class="text-sm font-semibold text-gray-900 dark:text-white"
                                                >{{ comment.postedBy?.firstName }}
                                                {{ comment.postedBy?.lastName }}</span
                                            >
                                            <span
                                                v-if="comment.postedBy?.role?.role_name === 'Super_Admin'"
                                                class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
                                            >
                                                {{ t('fuel_price_estimate.channel_post') }}
                                            </span>
                                            <span class="text-xs text-gray-500 dark:text-gray-400">{{
                                                formatDateTime(comment.createdAt)
                                            }}</span>
                                        </div>
                                        <p
                                            v-if="comment.content"
                                            class="text-sm text-gray-900 dark:text-white whitespace-pre-line"
                                        >
                                            {{ comment.content }}
                                        </p>
                                        <div v-if="comment.images?.length" class="mt-1.5">
                                            <div
                                                class="grid gap-1 rounded-lg overflow-hidden"
                                                :class="{
                                                    'grid-cols-1': comment.images.length === 1,
                                                    'grid-cols-2': comment.images.length >= 2,
                                                }"
                                            >
                                                <img
                                                    v-for="(img, idx) in comment.images"
                                                    :key="idx"
                                                    :src="img.url"
                                                    class="w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                    :class="comment.images.length === 1 ? 'max-h-48' : 'h-24'"
                                                    @click="lightboxSrc = img.url"
                                                />
                                            </div>
                                        </div>
                                        <span
                                            v-if="
                                                comment.updatedAt &&
                                                new Date(comment.updatedAt).getTime() >
                                                    new Date(comment.createdAt).getTime()
                                            "
                                            class="text-xs text-gray-400 italic mt-1"
                                            >✏ {{ t('fuel_price_estimate.edited') }}</span
                                        >
                                        <!-- Saving indicator -->
                                        <span
                                            v-if="savingCommentId === comment._id"
                                            class="flex items-center gap-1 text-xs text-gray-400 italic mt-1 animate-pulse"
                                        >
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            saving…
                                        </span>
                                    </div>
                                    <div v-if="canEdit(comment) || canDelete(comment)" class="flex gap-3 ms-1">
                                        <button
                                            v-if="canEdit(comment)"
                                            class="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                            @click="startEditComment(comment)"
                                        >
                                            {{ t('fuel_price_estimate.edit_comment') }}
                                        </button>
                                        <button
                                            v-if="canDelete(comment)"
                                            class="text-xs text-gray-400 hover:text-red-500"
                                            @click="onDeleteComment(comment._id)"
                                        >
                                            {{ t('fuel_price_estimate.delete_comment') }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Me — right aligned -->
                            <div v-else class="flex items-start gap-2.5 justify-end">
                                <div class="flex flex-col gap-1 w-full max-w-xs md:max-w-md items-end">
                                    <div
                                        class="flex flex-col leading-1.5 p-3 bg-blue-600 rounded-s-xl rounded-ee-xl w-full shadow-sm"
                                    >
                                        <div class="flex items-center justify-between mb-1">
                                            <span
                                                v-if="comment.postedBy?.role?.role_name === 'Super_Admin'"
                                                class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/30 text-blue-100"
                                            >
                                                {{ t('fuel_price_estimate.channel_post') }}
                                            </span>
                                            <span v-else />
                                            <span class="text-xs text-blue-200">{{
                                                formatDateTime(comment.createdAt)
                                            }}</span>
                                        </div>
                                        <p v-if="comment.content" class="text-sm text-white whitespace-pre-line">
                                            {{ comment.content }}
                                        </p>
                                        <div v-if="comment.images?.length" class="mt-1.5">
                                            <div
                                                class="grid gap-1 rounded-lg overflow-hidden"
                                                :class="{
                                                    'grid-cols-1': comment.images.length === 1,
                                                    'grid-cols-2': comment.images.length >= 2,
                                                }"
                                            >
                                                <img
                                                    v-for="(img, idx) in comment.images"
                                                    :key="idx"
                                                    :src="img.url"
                                                    class="w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                    :class="comment.images.length === 1 ? 'max-h-48' : 'h-24'"
                                                    @click="lightboxSrc = img.url"
                                                />
                                            </div>
                                        </div>
                                        <span
                                            v-if="
                                                comment.updatedAt &&
                                                new Date(comment.updatedAt).getTime() >
                                                    new Date(comment.createdAt).getTime()
                                            "
                                            class="text-xs text-blue-200 italic mt-1 text-right"
                                            >✏ {{ t('fuel_price_estimate.edited') }}</span
                                        >
                                        <!-- Saving indicator -->
                                        <span
                                            v-if="savingCommentId === comment._id"
                                            class="flex items-center justify-end gap-1 text-xs text-blue-200 italic mt-1 animate-pulse"
                                        >
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            saving…
                                        </span>
                                    </div>
                                    <div v-if="canEdit(comment) || canDelete(comment)" class="flex gap-3 me-1">
                                        <button
                                            v-if="canEdit(comment)"
                                            class="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                            @click="startEditComment(comment)"
                                        >
                                            {{ t('fuel_price_estimate.edit_comment') }}
                                        </button>
                                        <button
                                            v-if="canDelete(comment)"
                                            class="text-xs text-gray-400 hover:text-red-500"
                                            @click="onDeleteComment(comment._id)"
                                        >
                                            {{ t('fuel_price_estimate.delete_comment') }}
                                        </button>
                                    </div>
                                </div>
                                <div
                                    v-if="comment.postedBy?.role?.role_name === 'Super_Admin'"
                                    class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shrink-0 text-xs font-bold text-white shadow-sm"
                                >
                                    📢
                                </div>
                                <div
                                    v-else
                                    class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 text-xs font-bold text-blue-700 dark:text-blue-300"
                                >
                                    {{ comment.postedBy?.firstName?.[0] }}{{ comment.postedBy?.lastName?.[0] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- ── Fixed comment input bar (Super_Admin and Admin) ── -->
        <div
            class="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
        >
            <div v-if="isAdmin" class="max-w-2xl mx-auto px-3 py-2 space-y-2">
                <!-- Previews of images to be attached to comment -->
                <div v-if="commentPreviews.length" class="flex flex-wrap gap-2 pb-1">
                    <div v-for="(src, i) in commentPreviews" :key="i" class="relative group w-14 h-14">
                        <img :src="src" class="w-full h-full object-cover rounded-lg" />
                        <button
                            type="button"
                            class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                            @click="removeCommentFile(i)"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div class="flex items-end gap-2">
                    <!-- Photo attachment button -->
                    <label
                        v-if="commentFiles.length < MAX_IMAGES"
                        class="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <input type="file" accept="image/*" multiple class="hidden" @change="onCommentFileChange" />
                    </label>

                    <textarea
                        id="add-comment-input"
                        v-model="commentInput"
                        rows="1"
                        :placeholder="t('fuel_price_estimate.add_comment')"
                        class="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition max-h-28"
                        style="field-sizing: content"
                        @keydown.enter.exact.prevent="postComment"
                    />

                    <button
                        id="post-comment-btn"
                        :disabled="store.commentSubmitLoading || (!commentInput.trim() && commentFiles.length === 0)"
                        class="w-10 h-10 rounded-full bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
                        @click="postComment"
                    >
                        <svg
                            v-if="store.commentSubmitLoading"
                            class="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Lightbox -->
        <Teleport to="body">
            <div
                v-if="lightboxSrc"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                @click="lightboxSrc = ''"
            >
                <img :src="lightboxSrc" class="max-w-[92vw] max-h-[88vh] rounded-xl object-contain" @click.stop />
                <button
                    class="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center"
                    @click="lightboxSrc = ''"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </Teleport>

        <!-- Modals -->
        <DeleteModal
            :show="deleteEstimateModal"
            :title="t('fuel_price_estimate.confirm_delete_title')"
            :description="t('fuel_price_estimate.confirm_delete_desc')"
            @close="deleteEstimateModal = false"
            @confirm="handleDeleteEstimate"
        />
        <DeleteModal
            :show="deleteCommentModal.show"
            :title="t('fuel_price_estimate.confirm_delete_comment_title')"
            :description="t('fuel_price_estimate.confirm_delete_comment_desc')"
            @close="deleteCommentModal.show = false"
            @confirm="handleDeleteComment"
        />
        <ErrorModal
            :show="errorModal.show"
            :description="errorModal.description"
            :error-message="errorModal.message"
            @confirm="errorModal.show = false"
        />
    </div>
</template>
