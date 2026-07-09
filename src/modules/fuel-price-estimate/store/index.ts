import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fuelPriceEstimateService } from '@/modules/fuel-price-estimate/services/api.service'
import { getFromCache } from '@/composables/useCache'

// ── Interfaces ─────────────────────────────────────────────────────────────

export interface IEstimateImage {
    url: string
    publicId: string
}

export interface IEstimateAuthor {
    _id: string
    firstName: string
    lastName: string
}

export interface IComment {
    _id: string
    content: string
    postedBy: IEstimateAuthor
    createdAt: string
    updatedAt?: string
}

export interface IEstimate {
    _id: string
    content?: string
    images: IEstimateImage[]
    postedBy: IEstimateAuthor
    createdAt: string
    updatedAt?: string
    commentCount?: number
    comments?: IComment[]
}

export interface IPagination {
    total: number
    page: number
    limit: number
    totalPages: number
}

// ── Store ───────────────────────────────────────────────────────────────────

export const useFuelPriceEstimateStore = defineStore('fuelPriceEstimateStore', () => {
    // ── State ────────────────────────────────────────────────────────────
    const estimates = ref<IEstimate[]>([])
    const currentEstimate = ref<IEstimate | null>(null)
    const comments = ref<IComment[]>([])
    const pagination = ref<IPagination>({ total: 0, page: 1, limit: 20, totalPages: 1 })
    const commentPagination = ref<IPagination>({ total: 0, page: 1, limit: 50, totalPages: 1 })
    const loading = ref(false)
    const commentLoading = ref(false)
    const submitLoading = ref(false)

    // ── Estimates ────────────────────────────────────────────────────────

    const fetchAll = async (page = 1, limit = 20) => {
        try {
            loading.value = true
            const { data } = await fuelPriceEstimateService.getAll({ page, limit })
            if (data.success) {
                if (page === 1) {
                    estimates.value = data.data
                } else {
                    // Append for "load more"
                    estimates.value.push(...data.data)
                }
                pagination.value = data.pagination
            }
        } catch (error) {
            console.error('Error fetching estimates:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchById = async (id: string) => {
        try {
            loading.value = true
            const { data } = await fuelPriceEstimateService.getById(id)
            if (data.success) {
                currentEstimate.value = data.data
                // Populate embedded comments if returned
                if (data.data.comments) {
                    comments.value = data.data.comments
                }
            }
        } catch (error) {
            console.error('Error fetching estimate:', error)
        } finally {
            loading.value = false
        }
    }

    const createEstimate = async (formData: FormData): Promise<boolean> => {
        try {
            submitLoading.value = true
            const { data } = await fuelPriceEstimateService.create(formData)
            if (data.success) {
                // Prepend to feed
                estimates.value.unshift(data.data)
                return true
            }
            return false
        } catch (error) {
            console.error('Error creating estimate:', error)
            return false
        } finally {
            submitLoading.value = false
        }
    }

    const updateEstimate = async (id: string, formData: FormData): Promise<boolean> => {
        try {
            submitLoading.value = true
            // Optimistic: immediately update local content so UI feels instant
            const newContent = formData.get('content') as string | null
            if (currentEstimate.value?._id === id && newContent !== null) {
                currentEstimate.value = {
                    ...currentEstimate.value,
                    content: newContent,
                    updatedAt: new Date().toISOString(),
                }
            }
            const { data } = await fuelPriceEstimateService.update(id, formData)
            if (data.success) {
                const idx = estimates.value.findIndex(e => e._id === id)
                if (idx !== -1) estimates.value[idx] = data.data
                if (currentEstimate.value?._id === id) currentEstimate.value = data.data
                return true
            }
            // Rollback on failure — refetch
            await fetchById(id)
            return false
        } catch (error) {
            console.error('Error updating estimate:', error)
            await fetchById(id)
            return false
        } finally {
            submitLoading.value = false
        }
    }

    const deleteEstimate = async (id: string): Promise<boolean> => {
        try {
            const { data } = await fuelPriceEstimateService.delete(id)
            if (data.success) {
                estimates.value = estimates.value.filter(e => e._id !== id)
                return true
            }
            return false
        } catch (error) {
            console.error('Error deleting estimate:', error)
            return false
        }
    }

    // ── Comments ─────────────────────────────────────────────────────────

    const fetchComments = async (estimateId: string, page = 1, limit = 50) => {
        try {
            commentLoading.value = true
            const { data } = await fuelPriceEstimateService.getComments(estimateId, { page, limit })
            if (data.success) {
                comments.value = data.data
                commentPagination.value = data.pagination
            }
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            commentLoading.value = false
        }
    }

    const addComment = async (estimateId: string, content: string): Promise<boolean> => {
        try {
            commentLoading.value = true
            // Optimistic: push a placeholder bubble immediately
            const tempId = `temp_${Date.now()}`
            const appData = getFromCache('app_data')
            const me = appData?.value
            const tempComment: IComment = {
                _id: tempId,
                content,
                postedBy: {
                    _id: me?._id ?? '',
                    firstName: me?.firstName ?? '',
                    lastName: me?.lastName ?? '',
                },
                createdAt: new Date().toISOString(),
            }
            comments.value.push(tempComment)

            const { data } = await fuelPriceEstimateService.addComment(estimateId, content)
            if (data.success) {
                // Replace temp with real server record
                const idx = comments.value.findIndex(c => c._id === tempId)
                if (idx !== -1) comments.value[idx] = data.data
                else comments.value.push(data.data)
                // Keep feed comment count in sync
                const est = estimates.value.find(e => e._id === estimateId)
                if (est) est.commentCount = (est.commentCount ?? 0) + 1
                return true
            }
            // Rollback optimistic add on failure
            comments.value = comments.value.filter(c => c._id !== tempId)
            return false
        } catch (error) {
            console.error('Error adding comment:', error)
            return false
        } finally {
            commentLoading.value = false
        }
    }

    const updateComment = async (commentId: string, content: string): Promise<boolean> => {
        try {
            // Optimistic: update content in-place immediately so UI responds instantly
            const idx = comments.value.findIndex(c => c._id === commentId)
            const original = idx !== -1 ? { ...comments.value[idx] } : null
            if (idx !== -1) {
                comments.value[idx] = {
                    ...comments.value[idx],
                    content,
                    updatedAt: new Date().toISOString(),
                }
            }
            const { data } = await fuelPriceEstimateService.updateComment(commentId, content)
            if (data.success) {
                // Reconcile with real server record
                const i = comments.value.findIndex(c => c._id === commentId)
                if (i !== -1) comments.value[i] = data.data
                return true
            }
            // Rollback on failure
            if (idx !== -1 && original) comments.value[idx] = original
            return false
        } catch (error) {
            console.error('Error updating comment:', error)
            return false
        }
    }

    const deleteComment = async (commentId: string, estimateId?: string): Promise<boolean> => {
        try {
            // Optimistic: remove immediately from UI
            const deleted = comments.value.find(c => c._id === commentId)
            const deletedIdx = comments.value.findIndex(c => c._id === commentId)
            if (deletedIdx !== -1) comments.value.splice(deletedIdx, 1)

            const { data } = await fuelPriceEstimateService.deleteComment(commentId)
            if (data.success) {
                // Decrement commentCount on the feed list
                if (estimateId) {
                    const est = estimates.value.find(e => e._id === estimateId)
                    if (est && est.commentCount) est.commentCount = Math.max(0, est.commentCount - 1)
                }
                return true
            }
            // Rollback on failure
            if (deleted && deletedIdx !== -1) comments.value.splice(deletedIdx, 0, deleted)
            return false
        } catch (error) {
            console.error('Error deleting comment:', error)
            return false
        }
    }

    const reset = () => {
        estimates.value = []
        currentEstimate.value = null
        comments.value = []
        pagination.value = { total: 0, page: 1, limit: 20, totalPages: 1 }
        commentPagination.value = { total: 0, page: 1, limit: 50, totalPages: 1 }
    }

    return {
        // state
        estimates,
        currentEstimate,
        comments,
        pagination,
        commentPagination,
        loading,
        commentLoading,
        submitLoading,
        // actions
        fetchAll,
        fetchById,
        createEstimate,
        updateEstimate,
        deleteEstimate,
        fetchComments,
        addComment,
        updateComment,
        deleteComment,
        reset,
    }
})
