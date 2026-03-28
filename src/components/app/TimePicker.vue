<template>
    <!-- Trigger button — stays inline in the form -->
    <div ref="rootRef">
        <button
            type="button"
            :disabled="disabled"
            @click="open = true"
            class="time-trigger w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all"
            :class="[
                disabled
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500'
                    : open
                      ? 'bg-white border-secondary ring-1 ring-secondary dark:bg-gray-700 dark:border-secondary dark:text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900 hover:border-secondary dark:bg-gray-600 dark:border-gray-500 dark:text-white',
            ]"
        >
            <!-- Clock icon -->
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

            <!-- Value or placeholder -->
            <span v-if="modelValue" class="flex-1 text-left font-medium">{{ displayValue }}</span>
            <span v-else class="flex-1 text-left text-gray-400 dark:text-gray-500">
                {{ placeholder || t('time_picker.placeholder') }}
            </span>

            <!-- Clear -->
            <svg
                v-if="modelValue && !disabled"
                @click.stop="clear"
                class="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>

    <!-- Modal — Teleported to body, centered on screen -->
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="open" class="modal-backdrop" @mousedown.self="open = false">
                <Transition name="modal-scale">
                    <div v-if="open" class="glass-modal">
                        <!-- Ambient blobs inside the modal -->
                        <div class="blob blob-1" />
                        <div class="blob blob-2" />

                        <!-- Handle bar -->
                        <div class="handle-bar" />

                        <!-- Header -->
                        <div class="modal-header">
                            <div>
                                <p class="modal-label">{{ t('time_picker.select_time') }}</p>
                                <p class="modal-preview">{{ displayPreview }}</p>
                            </div>
                            <!-- Close -->
                            <button type="button" class="close-btn" @click="open = false">
                                <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Scroll columns -->
                        <div class="columns-row">
                            <!-- Hour -->
                            <div class="col-wrap">
                                <p class="col-label">{{ t('time_picker.hour') }}</p>
                                <!-- selection rail -->
                                <div class="rail-wrap">
                                    <div class="selection-rail" />
                                    <div class="scroll-col" ref="hourWrapRef">
                                        <!-- padding items so selection sits centre -->
                                        <div class="scroll-pad" />
                                        <div
                                            v-for="h in hours12"
                                            :key="h"
                                            class="scroll-item"
                                            :class="{ active: h === selectedHour12 }"
                                        >
                                            {{ String(h).padStart(2, '0') }}
                                        </div>
                                        <div class="scroll-pad" />
                                    </div>
                                    <!-- fade masks -->
                                    <div class="fade-top" />
                                    <div class="fade-bot" />
                                </div>
                            </div>

                            <!-- Colon divider -->
                            <div class="colon">:</div>

                            <!-- Minute -->
                            <div class="col-wrap">
                                <p class="col-label">{{ t('time_picker.minute') }}</p>
                                <div class="rail-wrap">
                                    <div class="selection-rail" />
                                    <div class="scroll-col" ref="minWrapRef">
                                        <div class="scroll-pad" />
                                        <div
                                            v-for="m in minutes"
                                            :key="m"
                                            class="scroll-item"
                                            :class="{ active: m === selectedMinute }"
                                        >
                                            {{ String(m).padStart(2, '0') }}
                                        </div>
                                        <div class="scroll-pad" />
                                    </div>
                                    <div class="fade-top" />
                                    <div class="fade-bot" />
                                </div>
                            </div>

                            <!-- AM / PM -->
                            <div class="col-wrap ampm-wrap">
                                <p class="col-label">{{ t('time_picker.period') }}</p>
                                <div class="ampm-stack">
                                    <button
                                        type="button"
                                        class="ampm-btn"
                                        :class="{ 'ampm-active': period === 'AM' }"
                                        @click="period = 'AM'"
                                    >
                                        {{ t('time_picker.am') }}
                                    </button>
                                    <button
                                        type="button"
                                        class="ampm-btn"
                                        :class="{ 'ampm-active': period === 'PM' }"
                                        @click="period = 'PM'"
                                    >
                                        {{ t('time_picker.pm') }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="modal-footer">
                            <button type="button" class="cancel-btn" @click="open = false">
                                {{ t('time_picker.cancel') }}
                            </button>
                            <button type="button" class="confirm-btn" @click="confirm">
                                {{ t('time_picker.confirm') }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
    import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    const props = defineProps<{
        modelValue?: string // stored/emitted as 24-h "HH:MM"
        disabled?: boolean
        placeholder?: string
        required?: boolean
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', val: string): void
    }>()

    // ── Refs ──────────────────────────────────────────────────────────
    const open = ref(false)
    const rootRef = ref<HTMLElement | null>(null)
    const hourWrapRef = ref<HTMLElement | null>(null)
    const minWrapRef = ref<HTMLElement | null>(null)

    // ── Data ──────────────────────────────────────────────────────────
    const hours12 = Array.from({ length: 12 }, (_, i) => i + 1) // 1–12
    const minutes = Array.from({ length: 60 }, (_, i) => i) // 0–59
    const ITEM_H = 52 // must match .scroll-item height in CSS

    const selectedHour12 = ref(12)
    const selectedMinute = ref(0)
    const period = ref<'AM' | 'PM'>('AM')

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

    const applyParsed = (v?: string) => {
        const { h12, m, p } = parse24(v)
        selectedHour12.value = h12
        selectedMinute.value = m
        period.value = p
    }

    applyParsed(props.modelValue)
    watch(
        () => props.modelValue,
        v => applyParsed(v),
    )

    // ── Display ───────────────────────────────────────────────────────
    const periodLabel = (p: 'AM' | 'PM') => (p === 'AM' ? t('time_picker.am') : t('time_picker.pm'))

    const displayPreview = computed(() => {
        const h = String(selectedHour12.value).padStart(2, '0')
        const m = String(selectedMinute.value).padStart(2, '0')
        return `${h}:${m} ${periodLabel(period.value)}`
    })

    const displayValue = computed(() => {
        if (!props.modelValue) return ''
        const { h12, m, p } = parse24(props.modelValue)
        return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${periodLabel(p)}`
    })

    // ── 12h → 24h ────────────────────────────────────────────────────
    const to24h = (): string => {
        let h = selectedHour12.value
        if (period.value === 'AM') {
            if (h === 12) h = 0
        } else {
            if (h !== 12) h += 12
        }
        return `${String(h).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`
    }

    // ── Actions ───────────────────────────────────────────────────────
    const confirm = () => {
        emit('update:modelValue', to24h())
        open.value = false
    }

    const clear = () => emit('update:modelValue', '')

    // ── Scroll-to helpers (programmatic, no click needed) ────────────
    const scrollToIndex = (el: HTMLElement | null, zeroBasedIndex: number, smooth = false) => {
        if (!el) return
        el.scrollTo({ top: zeroBasedIndex * ITEM_H, behavior: smooth ? 'smooth' : 'instant' })
    }

    const scrollToCurrent = (smooth = false) => {
        scrollToIndex(hourWrapRef.value, selectedHour12.value - 1, smooth)
        scrollToIndex(minWrapRef.value, selectedMinute.value, smooth)
    }

    // ── Snap selection from scroll position (debounced) ───────────────
    let hourTimer: ReturnType<typeof setTimeout> | null = null
    let minTimer: ReturnType<typeof setTimeout> | null = null

    const onHourScroll = () => {
        if (hourTimer) clearTimeout(hourTimer)
        hourTimer = setTimeout(() => {
            const el = hourWrapRef.value
            if (!el) return
            // Round to nearest item, clamp 0–11 (indices for hours 1–12)
            const idx = Math.round(el.scrollTop / ITEM_H)
            const clamped = Math.max(0, Math.min(11, idx))
            selectedHour12.value = clamped + 1 // convert 0-based → 1-based hour
            // Snap scroll so the item sits perfectly in the rail
            scrollToIndex(el, clamped, true)
        }, 120) // 120 ms after scroll stops
    }

    const onMinScroll = () => {
        if (minTimer) clearTimeout(minTimer)
        minTimer = setTimeout(() => {
            const el = minWrapRef.value
            if (!el) return
            const idx = Math.round(el.scrollTop / ITEM_H)
            const clamped = Math.max(0, Math.min(59, idx))
            selectedMinute.value = clamped
            scrollToIndex(el, clamped, true)
        }, 120)
    }

    // ── Attach / detach scroll listeners ─────────────────────────────
    const attachListeners = () => {
        hourWrapRef.value?.addEventListener('scroll', onHourScroll, { passive: true })
        minWrapRef.value?.addEventListener('scroll', onMinScroll, { passive: true })
    }

    const detachListeners = () => {
        hourWrapRef.value?.removeEventListener('scroll', onHourScroll)
        minWrapRef.value?.removeEventListener('scroll', onMinScroll)
        if (hourTimer) clearTimeout(hourTimer)
        if (minTimer) clearTimeout(minTimer)
    }

    // ── Open → position columns, then attach listeners ────────────────
    watch(open, v => {
        if (v) {
            nextTick(() => {
                scrollToCurrent(false) // instant jump to current value
                // Attach after a tick so the initial programmatic scroll
                // doesn't fire onHourScroll / onMinScroll
                setTimeout(attachListeners, 50)
            })
        } else {
            detachListeners()
        }
    })

    // ── Prevent body scroll when modal open ──────────────────────────
    watch(open, v => {
        document.body.style.overflow = v ? 'hidden' : ''
    })

    onBeforeUnmount(() => {
        detachListeners()
        document.body.style.overflow = ''
    })
</script>

<style scoped>
    /* ── Trigger ── */
    .time-trigger {
        outline: none;
    }

    /* ══════════════════════════════════════════════
   BACKDROP
══════════════════════════════════════════════ */
    .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        /* frosted backdrop */
        background: rgba(15, 23, 42, 0.05);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
    }

    /* ══════════════════════════════════════════════
   LIQUID GLASS MODAL
══════════════════════════════════════════════ */
    .glass-modal {
        position: relative;
        width: 100%;
        max-width: 340px;
        border-radius: 28px;
        overflow: hidden;

        /* Liquid glass */
        background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.52) 50%,
            rgba(255, 255, 255, 0.64) 100%
        );
        backdrop-filter: blur(40px) saturate(180%);
        -webkit-backdrop-filter: blur(40px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.85);
        box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.6) inset,
            0 2px 0 rgba(255, 255, 255, 0.9) inset,
            0 32px 64px rgba(99, 102, 241, 0.18),
            0 8px 32px rgba(0, 0, 0, 0.12);
    }

    /* Ambient colour blobs inside the modal */
    .blob {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        filter: blur(40px);
    }
    .blob-1 {
        width: 180px;
        height: 180px;
        top: -60px;
        left: -40px;
        background: radial-gradient(circle, rgba(129, 140, 248, 0.3), transparent 70%);
    }
    .blob-2 {
        width: 160px;
        height: 160px;
        bottom: -40px;
        right: -30px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.25), transparent 70%);
    }

    /* Everything inside sits above blobs */
    .handle-bar,
    .modal-header,
    .columns-row,
    .modal-footer {
        position: relative;
        z-index: 1;
    }

    /* ── Handle bar ── */
    .handle-bar {
        width: 40px;
        height: 4px;
        border-radius: 9999px;
        background: rgba(99, 102, 241, 0.25);
        margin: 12px auto 0;
    }

    /* ── Header ── */
    .modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 16px 20px 12px;
    }

    .modal-label {
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #6366f1;
        margin-bottom: 4px;
    }

    .modal-preview {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #1e293b;
        line-height: 1;
    }

    .close-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.15s;
        flex-shrink: 0;
        margin-top: 2px;
    }
    .close-btn:hover {
        background: rgba(99, 102, 241, 0.2);
    }

    /* ══════════════════════════════════════════════
   SCROLL COLUMNS
══════════════════════════════════════════════ */
    .columns-row {
        display: flex;
        align-items: flex-start;
        padding: 0 12px 8px;
        gap: 0;
    }

    .col-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .ampm-wrap {
        flex: 0 0 auto;
        padding: 0 4px;
    }

    .col-label {
        font-size: 0.9125rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #94a3b8;
        margin-bottom: 6px;
    }

    .colon {
        font-size: 1.5rem;
        font-weight: 700;
        color: #cbd5e1;
        padding-top: 38px; /* aligns with scroll centre */
        width: 18px;
        text-align: center;
        flex-shrink: 0;
    }

    /* Rail container — needed for the sticky selection highlight and fade masks */
    .rail-wrap {
        position: relative;
        width: 100%;
        height: 156px; /* 3 items visible: 52px × 3 */
    }

    /* Glassy selection highlight behind the middle row */
    .selection-rail {
        position: absolute;
        left: 4px;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        height: 52px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.14), rgba(129, 140, 248, 0.1));
        border: 1px solid rgba(99, 102, 241, 0.22);
        box-shadow:
            0 2px 8px rgba(99, 102, 241, 0.1),
            0 1px 0 rgba(255, 255, 255, 0.7) inset;
        pointer-events: none;
        z-index: 2;
    }

    .scroll-col {
        position: absolute;
        inset: 0;
        overflow-y: scroll;
        scrollbar-width: none;
        scroll-behavior: smooth;
        /* Snap each item into the centre rail */
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;
        z-index: 1;
    }
    .scroll-col::-webkit-scrollbar {
        display: none;
    }

    /* Top/bottom padding spacers so first/last items can centre */
    .scroll-pad {
        height: 52px;
        flex-shrink: 0;
        scroll-snap-align: none;
    }

    .scroll-item {
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.0625rem;
        font-weight: 500;
        color: #94a3b8;
        cursor: pointer;
        border-radius: 12px;
        transition:
            color 0.15s,
            font-weight 0.15s,
            font-size 0.15s;
        user-select: none;
        /* Each item snaps to centre */
        scroll-snap-align: center;
    }
    .scroll-item:hover {
        color: #6366f1;
    }
    .scroll-item.active {
        color: #4f46e5;
        font-weight: 800;
        font-size: 1.2rem;
    }

    /* Fade masks — top and bottom of the column */
    .fade-top,
    .fade-bot {
        position: absolute;
        left: 0;
        right: 0;
        height: 52px;
        pointer-events: none;
        z-index: 3;
    }
    .fade-top {
        top: 0;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
    }
    .fade-bot {
        bottom: 0;
        background: linear-gradient(to top, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
    }

    /* ══════════════════════════════════════════════
   AM / PM
══════════════════════════════════════════════ */
    .ampm-stack {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-top: 4px;
    }

    .ampm-btn {
        padding: 9px 12px;
        border-radius: 12px;
        border: 1.5px solid rgba(203, 213, 225, 0.8);
        background: rgba(255, 255, 255, 0.5);
        color: #64748b;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.18s ease;
        white-space: nowrap;
        backdrop-filter: blur(4px);
    }
    .ampm-btn:hover {
        border-color: #6366f1;
        color: #6366f1;
        background: rgba(99, 102, 241, 0.08);
    }
    .ampm-active {
        background: linear-gradient(135deg, #6366f1, #818cf8) !important;
        border-color: transparent !important;
        color: #fff !important;
        box-shadow:
            0 4px 14px rgba(99, 102, 241, 0.35),
            0 1px 0 rgba(255, 255, 255, 0.25) inset;
    }

    /* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
    .modal-footer {
        display: flex;
        gap: 10px;
        padding: 12px 16px 18px;
        border-top: 1px solid rgba(226, 232, 240, 0.7);
    }

    .cancel-btn {
        flex: 1;
        padding: 11px 0;
        border-radius: 14px;
        border: 1.5px solid rgba(203, 213, 225, 0.8);
        background: rgba(255, 255, 255, 0.6);
        color: #64748b;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s;
        backdrop-filter: blur(4px);
    }
    .cancel-btn:hover {
        background: rgba(255, 255, 255, 0.85);
        color: #1e293b;
    }

    .confirm-btn {
        flex: 2;
        padding: 11px 0;
        border-radius: 14px;
        border: none;
        background: linear-gradient(135deg, #6366f1, #818cf8);
        color: white;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow:
            0 6px 20px rgba(99, 102, 241, 0.3),
            0 1px 0 rgba(255, 255, 255, 0.2) inset;
        transition:
            opacity 0.15s,
            transform 0.1s;
    }
    .confirm-btn:hover {
        opacity: 0.92;
    }
    .confirm-btn:active {
        transform: scale(0.98);
    }

    /* ══════════════════════════════════════════════
   DARK MODE
══════════════════════════════════════════════ */
    @media (prefers-color-scheme: dark) {
        .glass-modal {
            background: linear-gradient(
                145deg,
                rgba(30, 41, 59, 0.82) 0%,
                rgba(15, 23, 42, 0.75) 50%,
                rgba(30, 41, 59, 0.78) 100%
            );
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                0 2px 0 rgba(255, 255, 255, 0.06) inset,
                0 32px 64px rgba(0, 0, 0, 0.5),
                0 8px 32px rgba(99, 102, 241, 0.2);
        }
        .modal-preview {
            color: #f1f5f9;
        }
        .selection-rail {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(129, 140, 248, 0.16));
            border-color: rgba(129, 140, 248, 0.3);
            box-shadow:
                0 2px 8px rgba(99, 102, 241, 0.2),
                0 1px 0 rgba(255, 255, 255, 0.06) inset;
        }
        .scroll-item {
            color: #475569;
        }
        .scroll-item:hover {
            color: #818cf8;
        }
        .scroll-item.active {
            color: #a5b4fc;
        }
        .fade-top {
            background: linear-gradient(to bottom, rgba(15, 23, 42, 0.82), transparent);
        }
        .fade-bot {
            background: linear-gradient(to top, rgba(15, 23, 42, 0.82), transparent);
        }
        .colon {
            color: #334155;
        }
        .ampm-btn {
            border-color: rgba(71, 85, 105, 0.7);
            background: rgba(30, 41, 59, 0.5);
            color: #94a3b8;
        }
        .ampm-btn:hover {
            border-color: #818cf8;
            color: #818cf8;
            background: rgba(99, 102, 241, 0.12);
        }
        .modal-footer {
            border-top-color: rgba(71, 85, 105, 0.4);
        }
        .cancel-btn {
            border-color: rgba(71, 85, 105, 0.7);
            background: rgba(30, 41, 59, 0.5);
            color: #94a3b8;
        }
        .cancel-btn:hover {
            background: rgba(51, 65, 85, 0.8);
            color: #f1f5f9;
        }
    }

    /* ══════════════════════════════════════════════
   TRANSITIONS
══════════════════════════════════════════════ */
    /* backdrop fade */
    .modal-fade-enter-active {
        transition: opacity 0.25s ease;
    }
    .modal-fade-leave-active {
        transition: opacity 0.2s ease;
    }
    .modal-fade-enter-from,
    .modal-fade-leave-to {
        opacity: 0;
    }

    /* modal spring scale */
    .modal-scale-enter-active {
        transition: all 0.35s cubic-bezier(0.34, 1.45, 0.64, 1);
    }
    .modal-scale-leave-active {
        transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
    }
    .modal-scale-enter-from,
    .modal-scale-leave-to {
        opacity: 0;
        transform: scale(0.88) translateY(16px);
    }
</style>
