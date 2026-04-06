<template>
    <div class="min-h-full">
        <header class="bg-primary">
            <div class="relative mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <button
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
                    @click="goBack"
                >
                    <svg
                        class="w-6 h-6 text-white dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m15 19-7-7 7-7"
                        />
                    </svg>
                </button>
                <h3 class="text-white font-semibold flex justify-center text-xl tracking-tight">
                    {{ t(routeName) }}
                </h3>
            </div>
        </header>
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<script setup lang="ts">
    import { useRoute, useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()

    const routeName = route.name as string

    const goBack = () => {
        const pathSegments = route.path.split('/').filter(segment => segment !== '')

        if (pathSegments.length >= 3 && (pathSegments[1] === 'view' || pathSegments[1] === 'edit')) {
            router.push(`/${pathSegments[0]}`)
        } else {
            const newPath = pathSegments.slice(0, -1).join('/')
            router.push(`/${newPath}`)
        }
    }
</script>
