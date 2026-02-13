<script setup lang="ts">
    import { ref } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    interface Props {
        show: boolean
        title?: string
        description?: string
        errorMessage?: string
        buttonText?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        title: '',
        description: '',
        errorMessage: '',
        buttonText: '',
    })

    const emit = defineEmits<{
        close: []
        confirm: []
    }>()

    const showErrorDetails = ref(false)

    const handleConfirm = () => {
        showErrorDetails.value = false
        emit('confirm')
        emit('close')
    }

    const getTitle = () => {
        return props.title || t('common.error.title')
    }

    const getDescription = () => {
        return props.description || t('common.error.description')
    }

    const getButtonText = () => {
        return props.buttonText || t('common.error.tryAgain')
    }
</script>

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
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            @click.self="emit('close')"
        >
            <Transition
                enter-active-class="transition ease-out duration-300 transform"
                enter-from-class="scale-95 opacity-0"
                enter-to-class="scale-100 opacity-100"
                leave-active-class="transition ease-in duration-200 transform"
                leave-from-class="scale-100 opacity-100"
                leave-to-class="scale-95 opacity-0"
            >
                <div v-if="show" class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
                    <!-- Error Icon -->
                    <div class="mb-6 flex justify-center">
                        <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>

                    <!-- Title -->
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                        {{ getTitle() }}
                    </h3>

                    <!-- Description -->
                    <p class="text-gray-600 dark:text-gray-400 mb-4 text-center">
                        {{ getDescription() }}
                    </p>

                    <!-- See more toggle (only show if there's an error message) -->
                    <div v-if="errorMessage" class="mb-6">
                        <button
                            @click="showErrorDetails = !showErrorDetails"
                            class="w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            <span>{{ showErrorDetails ? t('common.error.seeLess') : t('common.error.seeMore') }}</span>
                            <svg
                                class="w-4 h-4 transition-transform"
                                :class="{ 'rotate-180': showErrorDetails }"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        <!-- Error details (hidden by default) -->
                        <Transition
                            enter-active-class="transition-all duration-200 ease-out"
                            enter-from-class="opacity-0 max-h-0"
                            enter-to-class="opacity-100 max-h-40"
                            leave-active-class="transition-all duration-200 ease-in"
                            leave-from-class="opacity-100 max-h-40"
                            leave-to-class="opacity-0 max-h-0"
                        >
                            <div
                                v-if="showErrorDetails"
                                class="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 overflow-auto max-h-40"
                            >
                                <p class="text-sm text-red-800 dark:text-red-300 break-words">
                                    {{ errorMessage }}
                                </p>
                            </div>
                        </Transition>
                    </div>

                    <!-- Confirm Button -->
                    <button
                        @click="handleConfirm"
                        class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                    >
                        {{ getButtonText() }}
                    </button>
                </div>
            </Transition>
        </div>
    </Transition>
</template>
