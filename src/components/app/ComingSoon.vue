<template>
    <div
        class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950"
    >
        <!-- Subtle background decoration -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
            <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <!-- Back to Home button -->
        <button
            class="absolute top-5 left-5 z-10 rounded-full group flex items-center gap-2.5 p-3 font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-lg shadow-primary/25"
            @click="router.push('/')"
        >
            <svg
                class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>

        <!-- Language Switcher — top right -->
        <div class="absolute top-5 right-5 z-10">
            <LanguageSwitcher />
        </div>

        <!-- Center content -->
        <div class="relative flex flex-col items-center gap-6 px-6 text-center">
            <!-- Image with floating animation -->
            <div class="relative">
                <div class="absolute inset-0 bg-primary/10 blur-2xl scale-75 translate-y-8" />
                <img
                    src="@/assets/images/coming_soon.png"
                    alt="Coming Soon"
                    class="relative w-44 h-44 md:w-80 md:h-80 object-contain animate-float"
                />
            </div>

            <!-- Title -->
            <div class="relative">
                <h1
                    class="text-5xl md:text-6xl font-black tracking-tight text-primary"
                    style="
                        -webkit-text-stroke: 2px white;
                        paint-order: stroke fill;
                        text-shadow:
                            0 0 40px color-mix(in srgb, var(--color-primary, #007bff) 30%, transparent),
                            0 4px 24px rgba(0, 0, 0, 0.08);
                    "
                >
                    {{ t('coming_soon.title') }}
                </h1>
            </div>

            <!-- Translated subtitle -->
            <p
                class="text-lg md:text-xl font-medium text-primary/70 tracking-wide max-w-xs"
                style="-webkit-text-stroke: 0.5px white"
            >
                {{ t('coming_soon.subtitle') }}
            </p>

            <!-- Animated dots -->
            <div class="flex items-center gap-2 mt-2">
                <span
                    v-for="i in 3"
                    :key="i"
                    class="block w-2 h-2 rounded-full bg-primary animate-bounce"
                    :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import { useRouter } from 'vue-router'
    import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

    const { t } = useI18n()
    const router = useRouter()
</script>

<style scoped>
    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-14px);
        }
    }

    .animate-float {
        animation: float 3.6s ease-in-out infinite;
    }
</style>
