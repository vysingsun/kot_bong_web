<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { initFlowbite } from 'flowbite'
    import { useAuthStore } from '@/modules/auth/store/index'
    import { useModal } from '@/composables/useModal'
    import { getFromCache } from '@/composables/useCache'
    import type { IUser } from '@/data/constants'
    import BaseLoading from '@/components/app/BaseLoading.vue'
    import BaseModal from '@/components/app/BaseModal.vue'
    import ShapeBgAnimate from '@/components/app/ShapeBgAnimate.vue'
    import AppHeader from '@/components/home/AppHeader.vue'
    import WelcomeBanner from '@/components/home/WelcomeBanner.vue'
    import QuickActions from '@/components/home/QuickActions.vue'
    import ButtonNavigation from '@/components/home/BottomNavigation.vue'
    import SideNav from '@/components/home/SideNav.vue'
    const { isVisible, showModal, closeModal } = useModal()
    const loading = ref(false)
    const authStore = useAuthStore()
    const user = ref<IUser>()

    // Optional: Custom banner image (can be stored in user data or company config)
    const customBannerImage = ref<string | undefined>(undefined)

    const onLogout = async () => {
        await authStore.logout()
    }

    const handleConfirm = () => {
        loading.value = true
        onLogout()
    }

    onMounted(() => {
        initFlowbite()
        const appData = getFromCache('app_data')?.value
        user.value = appData

        // You can set custom banner image from user data if available
        // customBannerImage.value = appData?.customBanner
    })
</script>

<template>
    <BaseLoading v-if="loading" />
    <div class="antialiased h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <AppHeader :userName="`${user?.firstName} ${user?.lastName}`" :userEmail="user?.email" :onLogout="showModal" />

        <!-- Sidebar -->
        <aside
            id="drawer-navigation"
            class="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        >
            <SideNav />
        </aside>

        <ShapeBgAnimate />

        <!-- Main Content -->
        <main class="p-4 md:ml-64 pt-20 relative z-10">
            <div class="space-y-4 mb-4">
                <!-- Welcome Banner -->
                <WelcomeBanner
                    :firstName="user?.firstName"
                    :lastName="user?.lastName"
                    :customBannerImage="customBannerImage"
                />

                <!-- Quick Actions -->
                <QuickActions :onLogout="showModal" />
            </div>
        </main>

        <!-- Bottom Navigation (keep your existing bottom nav) -->
        <ButtonNavigation />
    </div>

    <!-- Logout Confirmation Modal -->
    <BaseModal
        :isVisible="isVisible"
        type="error"
        :title="$t('home.logout_confirmation')"
        @confirm="handleConfirm"
        @close="closeModal"
    />
</template>
