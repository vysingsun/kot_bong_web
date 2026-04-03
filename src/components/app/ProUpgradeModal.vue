<!-- ProUpgradeModal.vue -->
<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="show"
                class="fixed inset-0 z-50 flex items-center justify-center p-4"
                style="background: rgba(0, 0, 0, 0.1); backdrop-filter: blur(2px)"
                @click.self="$emit('close')"
            >
                <div
                    class="relative w-full max-w-sm rounded-3xl overflow-hidden text-gray-800"
                    style="
                        background: rgba(255, 255, 255, 0.8);
                        border: 1px solid rgba(255, 255, 255, 0.8);
                        box-shadow:
                            0 8px 32px rgba(255, 255, 255, 0.5),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2);
                        backdrop-filter: blur(24px);
                        -webkit-backdrop-filter: blur(24px);
                    "
                >
                    <!-- Top highlight edge -->
                    <div
                        style="
                            height: 1px;
                            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), transparent);
                        "
                    />

                    <div class="px-7 pt-8 pb-7">
                        <!-- Close -->
                        <button
                            class="absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                            style="background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(255, 255, 255, 0.92)"
                            @click="$emit('close')"
                        >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        <!-- Icon -->
                        <div class="flex justify-center mb-5">
                            <div
                                class="w-14 h-14 rounded-full flex items-center justify-center"
                                style="
                                    background: rgba(255, 255, 255, 0.06);
                                    border: 1px solid rgba(255, 255, 255, 0.15);
                                    box-shadow: 0 0 20px #2563eb33;
                                "
                            >
                                <svg class="w-7 h-7" fill="#2563eb" viewBox="0 0 20 20">
                                    <path
                                        fill-rule="evenodd"
                                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Title -->
                        <h2 class="text-center text-xl font-semibold text-gray-800 mb-1.5 tracking-tight">
                            {{ t('subscription.modal_title') }}
                        </h2>
                        <p class="text-center text-sm mb-6">
                            {{ t('subscription.modal_subtitle') }}
                        </p>

                        <!-- Feature pills -->
                        <div class="flex gap-2 mb-6">
                            <div
                                v-for="pill in pills"
                                :key="pill.key"
                                class="flex-1 flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-2xl text-center"
                                style="background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.1)"
                            >
                                <div
                                    class="w-7 h-7 rounded-lg flex items-center justify-center"
                                    :style="`background: ${pill.bg}`"
                                >
                                    <svg
                                        v-if="pill.key === 'staff'"
                                        class="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="#fbbf24"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <svg
                                        v-if="pill.key === 'reports'"
                                        class="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="#818cf8"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <svg
                                        v-if="pill.key === 'support'"
                                        class="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="#4ade80"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <span class="text-xs leading-tight">{{ t(pill.label) }}</span>
                            </div>
                        </div>

                        <!-- Divider -->
                        <div class="mb-5" style="height: 1px; background: rgba(255, 255, 255, 0.08)" />

                        <!-- CTA -->
                        <button
                            class="relative w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 overflow-hidden mb-2.5 transition-all hover:brightness-110"
                            style="
                                background: rgba(255, 255, 255, 0.82);
                                border: 1px solid rgba(255, 255, 255);
                                box-shadow: 0 0 20px #2563eb33;
                            "
                            @click="$emit('confirm')"
                        >
                            <span class="upgrade-shine" />
                            <svg class="w-4 h-4" fill="#2563eb" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            {{ t('subscription.upgrade_now') }} — $10/{{ t('subscription.month') }}
                        </button>

                        <button
                            class="w-full py-2.5 rounded-xl text-sm transition-colors"
                            style="background: transparent; border: none"
                            @click="$emit('close')"
                        >
                            {{ t('subscription.maybe_later') }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n'

    defineProps<{ show: boolean }>()
    defineEmits(['close', 'confirm'])

    const { t } = useI18n()

    const pills = [
        { key: 'staff', bg: 'rgba(251,191,36,0.15)', label: 'subscription.pill_staff' },
        { key: 'reports', bg: 'rgba(99,102,241,0.15)', label: 'subscription.pill_reports' },
        { key: 'support', bg: 'rgba(34,197,94,0.12)', label: 'subscription.pill_support' },
    ]
</script>

<style scoped>
    .modal-enter-active,
    .modal-leave-active {
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .modal-enter-from,
    .modal-leave-to {
        opacity: 0;
        transform: scale(0.92);
    }

    .upgrade-shine {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        animation: shine 3s infinite;
    }
    @keyframes shine {
        0% {
            transform: translateX(-100%);
        }
        40%,
        100% {
            transform: translateX(200%);
        }
    }
</style>
