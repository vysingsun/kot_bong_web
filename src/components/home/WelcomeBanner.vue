<script setup lang="ts">
    import { computed } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { useThemeStore } from '@/stores/theme'

    interface Props {
        firstName?: string
        lastName?: string
        stationName?: string
        customBannerImage?: string // Optional custom banner image
    }

    const props = defineProps<Props>()
    const { t } = useI18n()
    const themeStore = useThemeStore()

    // Use custom banner image if provided, otherwise use default flame icon
    const hasBannerImage = computed(() => !!props.customBannerImage)
</script>

<template>
    <div class="relative bg-primary w-full h-24 rounded-lg overflow-hidden shadow-lg">
        <!-- Content -->
        <div class="relative z-10 font-semibold text-on-primary text-sm absolute top-2 left-3">
            <div class="text-lg">{{ t('home.welcome') }} {{ firstName }} {{ lastName }}</div>
            <div class="pt-1 text-sm opacity-90">ស្ថានីយ៍រួមប្រេង និងឧស្ម័នឥន្ធនៈ</div>
        </div>

        <!-- Banner Image or Icon -->
        <div class="absolute right-0 bottom-0 h-full">
            <!-- Custom Banner Image (if provided) -->
            <img
                v-if="hasBannerImage"
                :src="customBannerImage"
                alt="banner"
                class="h-full w-auto object-cover rounded-r-lg"
            />

            <!-- Default Flame Icon with Decorative Circle -->
            <div v-else class="relative h-full flex items-end justify-end">
                <!-- Decorative Circle Background -->
                <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full"></div>
                <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/30 rounded-full"></div>

                <!-- Flame Icon Container -->
                <div class="relative w-20 h-20 rounded-tl-3xl rounded-br-lg flex items-end justify-end mb-2 mr-2">
                    <!-- Flame Icon (using primary color) -->
                    <svg
                        aria-hidden="true"
                        class="mr-1 w-12 h-12 text-white dark:text-primary-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Curved Decorative Element -->
        <svg class="absolute right-0 top-0 h-full w-auto opacity-10" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path d="M0,100 Q50,0 100,50 T200,100 Z" fill="white" />
        </svg>
    </div>
</template>
