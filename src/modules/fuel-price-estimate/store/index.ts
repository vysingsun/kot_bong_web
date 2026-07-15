import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fuelPriceEstimateService } from '@/modules/fuel-price-estimate/services/api.service'
import { getFromCache } from '@/composables/useCache'
import { io, Socket } from 'socket.io-client'

// ── Interfaces ─────────────────────────────────────────────────────────────

export interface IEstimateImage {
    url: string
    publicId: string
}

export interface IEstimateAuthor {
    _id: string
    firstName: string
    lastName: string
    role?: {
        _id: string
        role_name: string
    }
}

export interface IComment {
    _id: string
    content: string
    images?: IEstimateImage[]
    postedBy: IEstimateAuthor
    createdAt: string
    updatedAt?: string
    estimate?: string | IEstimate
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
    const commentSubmitLoading = ref(false)

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
                // Backend returns newest-first (DESC). Reverse so we store oldest-first (ASC chat order).
                const ascending = [...data.data].reverse()
                if (page === 1) {
                    comments.value = ascending
                } else {
                    // Load-more: older messages go ABOVE existing → prepend
                    comments.value.unshift(...ascending)
                }
                commentPagination.value = data.pagination
            }
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            commentLoading.value = false
        }
    }

    const addComment = async (estimateId: string, formData: FormData): Promise<boolean> => {
        const tempId = `temp_${Date.now()}`
        try {
            commentSubmitLoading.value = true
            // Optimistic: push a placeholder bubble immediately
            const appData = getFromCache('app_data')
            const me = appData?.value
            const content = (formData.get('content') as string) || ''

            // Map optimistic images if any
            const tempImages: IEstimateImage[] = []
            const imageFiles = formData.getAll('images') as File[]
            if (imageFiles && imageFiles.length > 0) {
                imageFiles.forEach(file => {
                    if (file && file.name) {
                        tempImages.push({
                            url: URL.createObjectURL(file),
                            publicId: `temp_${Date.now()}_${file.name}`,
                        })
                    }
                })
            }

            const tempComment: IComment = {
                _id: tempId,
                content,
                images: tempImages,
                postedBy: {
                    _id: me?._id ?? '',
                    firstName: me?.firstName ?? '',
                    lastName: me?.lastName ?? '',
                    role: me?.role,
                },
                createdAt: new Date().toISOString(),
            }
            comments.value.push(tempComment)

            const { data } = await fuelPriceEstimateService.addComment(estimateId, formData)
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
            // Rollback on throw
            comments.value = comments.value.filter(c => c._id !== tempId)
            return false
        } finally {
            commentSubmitLoading.value = false
        }
    }

    const updateComment = async (commentId: string, formData: FormData): Promise<boolean> => {
        try {
            // Optimistic: update content in-place immediately so UI responds instantly
            const idx = comments.value.findIndex(c => c._id === commentId)
            const original = idx !== -1 ? { ...comments.value[idx] } : null
            if (idx !== -1 && original) {
                const newContent = formData.get('content') as string | null

                // Let's build updated images list optimistically:
                let updatedImages = original.images ? [...original.images] : []

                // Remove deleted images
                const removePublicIdsStr = formData.get('removePublicIds') as string | null
                if (removePublicIdsStr) {
                    try {
                        const toRemove = JSON.parse(removePublicIdsStr) as string[]
                        updatedImages = updatedImages.filter(img => !toRemove.includes(img.publicId))
                    } catch (e) {
                        console.error('Error parsing removePublicIds:', e)
                    }
                }

                // Add new files
                const newFiles = formData.getAll('images') as File[]
                if (newFiles && newFiles.length > 0) {
                    newFiles.forEach(file => {
                        if (file && file.name) {
                            updatedImages.push({
                                url: URL.createObjectURL(file),
                                publicId: `temp_${Date.now()}_${file.name}`,
                            })
                        }
                    })
                }

                comments.value[idx] = {
                    ...comments.value[idx],
                    content: newContent !== null ? newContent : original.content,
                    images: updatedImages,
                    updatedAt: new Date().toISOString(),
                }
            }
            const { data } = await fuelPriceEstimateService.updateComment(commentId, formData)
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

    let socket: Socket | null = null

    const initSocket = () => {
        if (socket) return

        const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || ''
        const getSocketUrl = () => {
            if (!apiBase) return window.location.origin
            if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
                const url = new URL(apiBase)
                return url.origin
            }
            return window.location.origin
        }

        socket = io(getSocketUrl(), {
            withCredentials: true,
            autoConnect: false,
        })

        socket.connect()

        socket.on('connect', () => {
            console.log('Socket.IO connected to server')
            // Re-join estimate room if we are currently viewing one
            if (currentEstimate.value) {
                socket?.emit('join-estimate', currentEstimate.value._id)
            }
        })

        socket.on('estimate:created', (newEst: IEstimate) => {
            const exists = estimates.value.some(e => e._id === newEst._id)
            if (!exists) {
                estimates.value.unshift(newEst)
            }
        })

        socket.on('estimate:updated', (updatedEst: IEstimate) => {
            const idx = estimates.value.findIndex(e => e._id === updatedEst._id)
            if (idx !== -1) {
                estimates.value[idx] = { ...estimates.value[idx], ...updatedEst }
            }
            if (currentEstimate.value?._id === updatedEst._id) {
                currentEstimate.value = { ...currentEstimate.value, ...updatedEst }
            }
        })

        socket.on('estimate:deleted', (deletedId: string) => {
            estimates.value = estimates.value.filter(e => e._id !== deletedId)
            if (currentEstimate.value?._id === deletedId) {
                currentEstimate.value = null
            }
        })

        socket.on('comment:created', (newComment: IComment) => {
            const exists = comments.value.some(c => c._id === newComment._id)
            if (!exists) {
                const appData = getFromCache('app_data')
                const me = appData?.value
                const isMyComment = newComment.postedBy._id === me?._id

                if (isMyComment) {
                    const tempIdx = comments.value.findIndex(c => c._id.startsWith('temp_'))
                    if (tempIdx !== -1) {
                        comments.value[tempIdx] = newComment
                        return
                    }
                }

                comments.value.push(newComment)
            }

            // Keep comment count in sync
            const estimateId =
                typeof newComment.estimate === 'string' ? newComment.estimate : (newComment as any).estimate?._id
            if (estimateId) {
                const est = estimates.value.find(e => e._id === estimateId)
                if (est) est.commentCount = (est.commentCount ?? 0) + 1
            } else if (currentEstimate.value) {
                currentEstimate.value.commentCount = (currentEstimate.value.commentCount ?? 0) + 1
            }
        })

        socket.on('comment:updated', (updatedComment: IComment) => {
            const idx = comments.value.findIndex(c => c._id === updatedComment._id)
            if (idx !== -1) {
                comments.value[idx] = updatedComment
            }
        })

        socket.on('comment:deleted', ({ commentId, estimateId }: { commentId: string; estimateId: string }) => {
            comments.value = comments.value.filter(c => c._id !== commentId)

            const est = estimates.value.find(e => e._id === estimateId)
            if (est) est.commentCount = Math.max(0, (est.commentCount ?? 0) - 1)
            if (currentEstimate.value?._id === estimateId) {
                currentEstimate.value.commentCount = Math.max(0, (currentEstimate.value.commentCount ?? 0) - 1)
            }
        })
    }

    const joinEstimateRoom = (estimateId: string) => {
        if (!socket) initSocket()
        socket?.emit('join-estimate', estimateId)
    }

    const leaveEstimateRoom = (estimateId: string) => {
        socket?.emit('leave-estimate', estimateId)
    }

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect()
            socket = null
        }
    }

    const reset = () => {
        estimates.value = []
        currentEstimate.value = null
        comments.value = []
        pagination.value = { total: 0, page: 1, limit: 20, totalPages: 1 }
        commentPagination.value = { total: 0, page: 1, limit: 50, totalPages: 1 }
        disconnectSocket()
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
        commentSubmitLoading,
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
        initSocket,
        joinEstimateRoom,
        leaveEstimateRoom,
        disconnectSocket,
        reset,
    }
})
