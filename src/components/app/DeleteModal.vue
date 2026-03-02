<template>
    <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center px-4"
            style="background: rgba(15, 10, 10, 0.6); backdrop-filter: blur(4px)"
            @click.self="emit('close')"
        >
            <Transition
                enter-active-class="transition ease-out duration-300 transform"
                enter-from-class="scale-90 opacity-0 translate-y-4"
                enter-to-class="scale-100 opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-200 transform"
                leave-from-class="scale-100 opacity-100"
                leave-to-class="scale-90 opacity-0"
            >
                <div
                    v-if="show"
                    class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                >
                    <!-- Red top accent bar -->
                    <!-- <div class="h-1.5 w-full bg-gradient-to-r from-red-500 via-rose-500 to-red-400" /> -->

                    <div class="p-8">
                        <!-- Icon -->
                        <div class="flex justify-center mb-5">
                            <div class="relative flex items-center justify-center w-20 h-20">
                                <!-- Pulsing ring -->
                                <div
                                    class="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/30 animate-ping opacity-30"
                                />
                                <div class="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/40" />
                                <!-- Trash icon -->
                                <svg
                                    class="relative w-9 h-9 text-[#f00317]"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Text -->
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-2 tracking-tight">
                            {{ title || t('common.delete.title') }}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-8">
                            {{ description || t('common.delete.description') }}
                        </p>

                        <!-- Buttons: Cancel left, Delete right -->
                        <div class="flex gap-3">
                            <button
                                class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#f00317] hover:bg-red-600 active:scale-95 transition-all duration-150 shadow-lg shadow-red-200 dark:shadow-red-900/30"
                                @click="handleConfirm"
                            >
                                {{ confirmText || t('common.delete.action') }}
                            </button>
                            <button
                                class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-150"
                                @click="emit('close')"
                            >
                                {{ cancelText || t('common.cancel') }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    interface Props {
        show: boolean
        title?: string
        description?: string
        confirmText?: string
        cancelText?: string
    }

    withDefaults(defineProps<Props>(), {
        title: '',
        description: '',
        confirmText: '',
        cancelText: '',
    })

    const emit = defineEmits<{
        close: []
        confirm: []
    }>()

    const handleConfirm = () => {
        emit('confirm')
        emit('close')
    }
</script>
