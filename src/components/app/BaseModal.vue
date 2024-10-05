<template>
    <div v-if="isVisible"
        class="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50">
        <div class="relative p-4 w-full max-w-md">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- <button @click="closeModal"
                    class="absolute top-3 right-2.5 text-gray-400 hover:bg-gray-200 rounded-lg text-sm w-8 h-8">
                    <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button> -->
                <div class="p-4 md:p-5 text-center">
                    <svg v-if="type === 'error'"
                        class="bg-red-100 p-2 rounded-lg mx-auto mb-4 text-red-500 w-12 h-12 dark:text-gray-200"
                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <svg v-if="type === 'success'" aria-hidden="true"
                        class="w-12 h-12 bg-green-100 p-2 rounded-full mx-auto text-green-400 dark:text-green-300"
                        fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"></path>
                    </svg>
                    <svg v-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor"
                        class="w-12 h-12 bg-yellow-50 p-2 rounded-full mx-auto text-yellow-300">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{{ title }}</h3>
                    <slot></slot>
                    <div class="mt-5 flex justify-center">
                        <button @click="confirmAction" :class="buttonClass"
                            class="text-white px-5 py-2.5 mr-2 rounded-lg">
                            {{ confirmLabel }}
                        </button>
                        <button v-if="type === 'error'" @click="closeModal"
                            class="bg-gray-200 text-gray-900 py-2.5 px-5 rounded-lg">
                            {{ cancelLabel }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
    isVisible: Boolean,
    title: String,
    confirmLabel: {
        type: String,
        default: 'Yes, I\'m sure',
    },
    cancelLabel: {
        type: String,
        default: 'No, cancel',
    },
    type: String,
})
const emit = defineEmits(['close', 'confirm'])

const closeModal = () => {
    emit('close')
}

const confirmAction = () => {
    emit('confirm')
    closeModal()
}
// Computed class for dynamic button color
const buttonClass = computed(() => {
    return props.type === 'error' ? 'bg-red-600 hover:bg-red-800' : 'bg-blue-600 hover:bg-blue-800'
})

</script>