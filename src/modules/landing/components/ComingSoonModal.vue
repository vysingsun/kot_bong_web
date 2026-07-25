<template>
    <Teleport to="body">
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
                style="background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px)"
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
                        class="relative w-full max-w-sm rounded-3xl overflow-hidden bg-gray-950 border border-white/10 shadow-2xl"
                    >
                        <button
                            class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            @click="emit('close')"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        <div class="relative flex flex-col items-center gap-4 px-8 pt-12 pb-10 text-center">
                            <div
                                class="absolute inset-0 pointer-events-none bg-landing-primary-600/10 blur-3xl"
                            ></div>
                            <div class="relative">
                                <div
                                    class="absolute inset-0 bg-landing-primary-500/20 blur-2xl scale-75 translate-y-6"
                                ></div>
                                <img
                                    src="@/assets/images/coming_soon.png"
                                    alt="Coming Soon"
                                    class="relative w-36 h-36 object-contain animate-landing-float"
                                />
                            </div>

                            <h3 class="relative text-2xl font-black text-white tracking-tight">
                                {{ t('coming_soon.title') }}
                            </h3>
                            <p class="relative text-sm text-gray-400 max-w-xs leading-relaxed">
                                {{ t('coming_soon.subtitle') }}
                            </p>

                            <div class="relative flex items-center gap-2 mt-1">
                                <span
                                    v-for="i in 3"
                                    :key="i"
                                    class="block w-2 h-2 rounded-full bg-landing-primary-500 animate-bounce"
                                    :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
                                />
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n'

    defineProps<{ show: boolean }>()
    const emit = defineEmits<{ close: [] }>()

    const { t } = useI18n()
</script>

<style scoped>
    @keyframes landing-float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .animate-landing-float {
        animation: landing-float 3.6s ease-in-out infinite;
    }
</style>
