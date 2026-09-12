<template>
    <section
        class="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950"
    >
        <!-- Decorative wave — anchored to the section's own top-right corner.
             The header has no background of its own now, so this washes
             straight through the header and down the right side of the Hero. -->
        <svg
            class="absolute top-0 right-0 w-[30rem] h-[30rem] lg:w-[52rem] lg:h-[43rem] max-w-[110%] text-blue-400 dark:text-blue-400 pointer-events-none"
            viewBox="280 7 393 298"
            fill="none"
            preserveAspectRatio="none"
        >
            <path
                opacity=".16"
                d="M319.883 7C301.96 44.568 306.667 82.98 334 122.238c41 58.887 138.227 21.23 183.906 98.434 30.453 51.469 82.151 79.28 155.094 83.433V7H319.883z"
                fill="currentColor"
            />
        </svg>

        <div class="relative max-w-screen-2xl mx-auto px-4 sm:px-4 lg:px-6 py-32 lg:py-40 w-full">
            <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                <!-- Left: Text Content -->
                <div class="flex-1 text-center lg:text-left">
                    <!-- Badge -->
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-landing-primary-100 dark:bg-landing-primary-600/20 border border-landing-primary-300 dark:border-landing-primary-500/30 text-landing-primary-700 dark:text-landing-primary-300 text-sm font-medium mb-8 animate-landing-fade-in"
                    >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fill-rule="evenodd"
                                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        {{ t('landing.hero.badge') }}
                    </div>

                    <!-- Title -->
                    <h1
                        class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6 animate-landing-fade-up"
                    >
                        {{ t('landing.hero.title') }}<br />
                        <span class="landing-highlight-text">{{ t('landing.hero.titleHighlight') }}</span
                        ><br />
                        <span class="text-gray-700 dark:text-gray-200">{{ t('landing.hero.titleEnd') }}</span>
                    </h1>

                    <p
                        class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 animate-landing-fade-up landing-animate-delay-200"
                    >
                        {{ t('landing.hero.subtitle') }}
                    </p>

                    <!-- CTA Buttons -->
                    <div
                        class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-landing-fade-up landing-animate-delay-300"
                    >
                        <a
                            href="#download"
                            class="landing-btn-primary text-base px-8 py-4"
                            @click.prevent="scrollTo('download')"
                        >
                            <svg
                                class="w-5 h-5 mr-2 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            {{ t('landing.hero.cta') }}
                        </a>
                        <a
                            href="#features"
                            class="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-landing-primary-300 dark:border-white/20 text-landing-primary-700 dark:text-white font-semibold text-base hover:bg-landing-primary-50 dark:hover:bg-white/10 active:scale-95 transition-all"
                            @click.prevent="scrollTo('features')"
                        >
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {{ t('landing.hero.watchDemo') }}
                        </a>
                    </div>

                    <!-- Trust badge -->
                    <div
                        class="mt-6 flex items-center justify-center lg:justify-start gap-2 animate-landing-fade-up landing-animate-delay-400"
                    >
                        <svg class="w-5 h-5 text-landing-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <span class="text-sm text-landing-green-600 dark:text-landing-green-400 font-medium">{{
                            t('landing.hero.trustBadge')
                        }}</span>
                    </div>
                </div>

                <!-- Right: Illustration — shown above the text on mobile, to
                     the right of it from lg upward. -->
                <div
                    class="order-first lg:order-none flex-1 flex justify-center lg:justify-end animate-landing-fade-up landing-animate-delay-200 w-full"
                >
                    <div class="relative w-[75%] lg:w-full max-w-lg">
                        <!-- Glow -->
                        <div
                            class="absolute inset-0 bg-landing-primary-400/20 dark:bg-landing-primary-600/30 blur-3xl rounded-full"
                        ></div>
                        <img
                            src="@/assets/images/base-station-blue.svg"
                            alt="Gas station illustration"
                            class="relative w-full animate-landing-float"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- Scroll indicator -->
        <a
            href="#features"
            class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-landing-primary-500 transition-colors"
        >
            <span class="text-xs font-medium">{{ locale === 'kh' ? 'រំកិលចុះ' : 'Scroll down' }}</span>
            <div class="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
                <div class="w-1 h-2 bg-current rounded-full animate-bounce"></div>
            </div>
        </a>
    </section>
</template>

<script setup lang="ts">
    import { useI18n } from 'vue-i18n'
    import { useLandingScroll } from '@/modules/landing/composables/useLandingScroll'
    const { t, locale } = useI18n()
    const { scrollTo } = useLandingScroll()
</script>
