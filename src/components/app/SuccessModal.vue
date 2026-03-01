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
                <div
                    v-if="show"
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
                >
                    <!-- Icon -->
                    <div class="mb-6 relative">
                        <div
                            class="w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-scale-in"
                            :class="iconBgClass"
                        >
                            <!-- Success -->
                            <svg
                                v-if="type === 'success'"
                                class="w-12 h-12 animate-check"
                                :class="iconColorClass"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="3"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <!-- Error -->
                            <svg
                                v-else-if="type === 'error'"
                                class="w-12 h-12"
                                :class="iconColorClass"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="3"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            <!-- Warning -->
                            <svg
                                v-else-if="type === 'warning'"
                                class="w-12 h-12"
                                :class="iconColorClass"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="3"
                                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                                />
                            </svg>
                            <!-- Info -->
                            <svg
                                v-else
                                class="w-12 h-12"
                                :class="iconColorClass"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="3"
                                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"
                                />
                            </svg>
                        </div>

                        <!-- Confetti (success only) -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div
                                v-for="i in 8"
                                :key="i"
                                class="absolute w-2 h-2 rounded-full animate-confetti"
                                :style="{
                                    backgroundColor: ['#19b23e'][i % 1],
                                    animationDelay: `${i * 0.1}s`,
                                }"
                            ></div>
                        </div>
                    </div>

                    <!-- Title -->
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {{ title || t(`common.${type}.title`) }}
                    </h3>

                    <!-- Description -->
                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                        {{ description || t(`common.${type}.description`) }}
                    </p>

                    <!-- Actions -->
                    <div v-if="!loading" class="flex gap-3 justify-center">
                        <button
                            v-if="showCancelButton"
                            class="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            @click="emit('close')"
                        >
                            {{ cancelText || t('common.cancel') }}
                        </button>
                        <button
                            class="px-6 py-2.5 rounded-xl text-white font-medium transition-colors"
                            :class="buttonBgClass"
                            @click="handleConfirm"
                        >
                            {{ buttonText || t(`common.${type}.action`) }}
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    type ModalType = 'success' | 'error' | 'warning' | 'info'

    interface Props {
        show: boolean
        type?: ModalType
        title?: string
        description?: string
        buttonText?: string
        cancelText?: string
        showCancelButton?: boolean
        loading?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        type: 'success',
        title: '',
        description: '',
        buttonText: '',
        cancelText: '',
        showCancelButton: false,
        loading: false,
    })

    const emit = defineEmits<{
        close: []
        confirm: []
    }>()

    const handleConfirm = () => {
        emit('confirm')
        emit('close')
    }

    const iconBgClass = computed(() => ({
        'bg-green-100 dark:bg-green-900': props.type === 'success',
        'bg-red-100 dark:bg-red-900': props.type === 'error',
        'bg-yellow-100 dark:bg-yellow-900': props.type === 'warning',
        'bg-blue-100 dark:bg-blue-900': props.type === 'info',
    }))

    const iconColorClass = computed(() => ({
        'text-[#19b23e]': props.type === 'success',
        'text-red-600': props.type === 'error',
        'text-yellow-500': props.type === 'warning',
        'text-blue-600': props.type === 'info',
    }))

    const buttonBgClass = computed(() => ({
        'bg-blue-600 hover:bg-green-700': props.type === 'success',
        'bg-red-600 hover:bg-red-700': props.type === 'error',
        'bg-yellow-500 hover:bg-yellow-600': props.type === 'warning',
        'bg-blue-600 hover:bg-blue-700': props.type === 'info',
    }))
</script>

<style scoped>
    @keyframes scale-in {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes check {
        0% {
            stroke-dashoffset: 50;
        }
        100% {
            stroke-dashoffset: 0;
        }
    }

    @keyframes confetti {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(var(--x), var(--y)) rotate(360deg);
            opacity: 0;
        }
    }

    .animate-scale-in {
        animation: scale-in 0.5s ease-out forwards;
    }

    .animate-check .checkmark {
        stroke-dasharray: 50;
        stroke-dashoffset: 50;
        animation: check 0.5s ease-out 0.3s forwards;
    }

    .animate-confetti {
        --x: 0px;
        --y: 0px;
        animation: confetti 1s ease-out forwards;
    }

    .animate-confetti:nth-child(1) {
        --x: 60px;
        --y: -80px;
    }
    .animate-confetti:nth-child(2) {
        --x: -60px;
        --y: -80px;
    }
    .animate-confetti:nth-child(3) {
        --x: 80px;
        --y: 0px;
    }
    .animate-confetti:nth-child(4) {
        --x: -80px;
        --y: 0px;
    }
    .animate-confetti:nth-child(5) {
        --x: 70px;
        --y: 70px;
    }
    .animate-confetti:nth-child(6) {
        --x: -70px;
        --y: 70px;
    }
    .animate-confetti:nth-child(7) {
        --x: 40px;
        --y: -70px;
    }
    .animate-confetti:nth-child(8) {
        --x: -40px;
        --y: -70px;
    }
</style>
