<script lang="ts" setup>
    import { ref, onMounted, watch } from 'vue'
    import ShapeBgAnimate from './ShapeBgAnimate.vue'
    import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
    import { useI18n } from 'vue-i18n'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const { t, locale } = useI18n()

    const displayNumber = ref(0)
    onMounted(() => {
        const target = 404
        const duration = 1000
        const step = target / (duration / 16)
        const timer = setInterval(() => {
            displayNumber.value = Math.min(Math.round(displayNumber.value + step), target)
            if (displayNumber.value >= target) clearInterval(timer)
        }, 16)
    })

    const typedText = ref('')
    const startTyping = () => {
        typedText.value = ''
        const fullText = t('notFound.typing')
        let i = 0
        const timer = setInterval(() => {
            typedText.value += fullText[i]
            i++
            if (i >= fullText.length) clearInterval(timer)
        }, 80)
    }

    onMounted(() => startTyping())
    watch(locale, () => {
        startTyping()
    })
</script>

<template>
    <div class="wrapper">
        <!-- Background layer -->
        <ShapeBgAnimate class="bg-layer" />

        <!-- Content layer -->
        <div class="container">
            <!-- Top bar with language switcher -->
            <div class="topbar">
                <LanguageSwitcher />
            </div>

            <!-- Center content -->
            <div class="content">
                <h1 class="title">{{ displayNumber }}</h1>
                <p class="typing">{{ typedText }}<span class="cursor">|</span></p>
                <p class="subtitle">{{ t('notFound.subtitle') }}</p>
                <button class="btn-home" @click="router.push('/')">← {{ t('notFound.button') }}</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .wrapper {
        position: relative;
        width: 100%;
        height: 100vh;
        background-color: #f9fafb;
        overflow: hidden;
    }

    :deep(.bg-layer),
    .bg-layer {
        position: absolute !important;
        inset: 0 !important;
        z-index: 0 !important;
        pointer-events: none !important;
    }

    .container {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column; /* ← stack topbar + content vertically */
    }

    .topbar {
        display: flex;
        justify-content: flex-end; /* ← push switcher to the right */
        padding: 1.25rem;
    }

    .content {
        flex: 1; /* ← take remaining height */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
    }

    .title {
        font-size: clamp(5rem, 20vw, 12rem);
        font-weight: 700;
        color: #3b82f6;
        line-height: 1;
        margin: 0 0 1rem 0;
        text-shadow:
            0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0, 0, 0, 0.1),
            0 0 5px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.3),
            0 3px 5px rgba(0, 0, 0, 0.2),
            0 5px 10px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.2),
            0 20px 20px rgba(0, 0, 0, 0.15);
    }

    .typing {
        font-size: 1.2rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        color: #6b7280;
        margin-bottom: 1rem;
        min-height: 1.8rem;
    }

    .cursor {
        display: inline-block;
        animation: blink 0.8s ease-in-out infinite;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    .subtitle {
        font-size: 0.9rem;
        color: #9ca3af;
        padding: 0.5rem 0 2rem 0;
        max-width: 360px;
        margin: 0 auto;
        line-height: 1.6;
    }

    .btn-home {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.6rem 1.5rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #374151;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-home:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
    }
</style>
