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
            v-if="isVisible"
            class="fixed inset-0 z-50 flex items-center justify-center px-4"
            style="background: rgba(15, 10, 10, 0.6); backdrop-filter: blur(4px)"
            @click.self="closeModal"
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
                    v-if="isVisible"
                    class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                >
                    <div class="p-8">
                        <!-- Icon -->
                        <div class="flex justify-center mb-5">
                            <div class="relative flex items-center justify-center w-20 h-20">
                                <!-- Pulsing ring -->
                                <div
                                    :class="pulsingRingClass"
                                    class="absolute inset-0 rounded-full animate-ping opacity-30"
                                />
                                <div :class="staticRingClass" class="absolute inset-0 rounded-full" />

                                <!-- Error Icon -->
                                <svg
                                    v-if="type === 'error'"
                                    class="relative w-9 h-9 text-red-600 dark:text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                    />
                                </svg>

                                <!-- Success Icon -->
                                <svg
                                    v-if="type === 'success'"
                                    class="relative w-9 h-9 text-green-600 dark:text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>

                                <!-- Warning Icon -->
                                <svg
                                    v-if="type === 'warning'"
                                    class="relative w-9 h-9 text-yellow-600 dark:text-yellow-500"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                    />
                                </svg>

                                <!-- Info Icon -->
                                <svg
                                    v-if="type === 'info'"
                                    class="relative w-9 h-9 text-blue-600 dark:text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Text -->
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-2 tracking-tight">
                            {{ title }}
                        </h3>

                        <!-- Slot for custom content/description -->
                        <div
                            v-if="$slots.default"
                            class="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-8"
                        >
                            <slot></slot>
                        </div>

                        <!-- Buttons -->
                        <div class="flex gap-3">
                            <button
                                :class="confirmButtonClass"
                                class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white active:scale-95 transition-all duration-150 shadow-lg"
                                @click="confirmAction"
                            >
                                {{ confirmLabel }}
                            </button>
                            <button
                                v-if="showCancelButton"
                                class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-150"
                                @click="closeModal"
                            >
                                {{ cancelLabel }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps({
        isVisible: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        confirmLabel: {
            type: String,
            default: "Yes, I'm sure",
        },
        cancelLabel: {
            type: String,
            default: 'No, cancel',
        },
        type: {
            type: String,
            default: 'info',
            validator: (value: string) => ['error', 'success', 'warning', 'info'].includes(value),
        },
        showCancelButton: {
            type: Boolean,
            default: true,
        },
    })

    const emit = defineEmits(['close', 'confirm'])

    const closeModal = () => {
        emit('close')
    }

    const confirmAction = () => {
        emit('confirm')
        closeModal()
    }

    // Computed classes for dynamic styling based on type
    const pulsingRingClass = computed(() => {
        const classes = {
            error: 'bg-red-100 dark:bg-red-900/30',
            success: 'bg-green-100 dark:bg-green-900/30',
            warning: 'bg-yellow-100 dark:bg-yellow-900/30',
            info: 'bg-blue-100 dark:bg-blue-900/30',
        }
        return classes[props.type as keyof typeof classes]
    })

    const staticRingClass = computed(() => {
        const classes = {
            error: 'bg-red-100 dark:bg-red-900/40',
            success: 'bg-green-100 dark:bg-green-900/40',
            warning: 'bg-yellow-100 dark:bg-yellow-900/40',
            info: 'bg-blue-100 dark:bg-blue-900/40',
        }
        return classes[props.type as keyof typeof classes]
    })

    const confirmButtonClass = computed(() => {
        const classes = {
            error: 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-red-900/30',
            success: 'bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-green-900/30',
            warning: 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200 dark:shadow-yellow-900/30',
            info: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/30',
        }
        return classes[props.type as keyof typeof classes]
    })
</script>
