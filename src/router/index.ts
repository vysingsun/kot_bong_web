import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Default_header from '@/layouts/default_header.vue'
import { MODULE_APP_ROUTES } from '@/modules'
import { AUTH } from '@/modules/auth/router/index'
import { isAuthenticated } from '@/middlewares/auth'
import { ONBOARDINGVIEW } from '@/modules/OnboardingView/router'
import { useAppStore } from '@/modules/app/store'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            beforeEnter: isAuthenticated,
            component: HomeView,
        },
        ...AUTH.AUTH_ROUTES,
        {
            path: '/',
            name: 'Product',
            beforeEnter: isAuthenticated,
            component: Default_header,
            children: [...MODULE_APP_ROUTES],
        },
        ...ONBOARDINGVIEW.ONBOARDINGVIEW_ROUTES,
        {
            path: '/profile',
            name: 'Profile',
            beforeEnter: isAuthenticated,
            component: () => import('@/modules/app/views/form.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/components/app/404.vue'),
        },
        {
            path: '/comingsoon',
            name: 'ComingSoon',
            beforeEnter: isAuthenticated,
            component: () => import('@/components/app/ComingSoon.vue'),
        },
        {
            path: '/policy',
            name: 'Policy',
            component: () => import('@/components/home/Policy.vue'),
        },
    ],
})

router.beforeEach((to, from, next) => {
    const appStore = useAppStore()

    // Show loading when navigating
    appStore.loading = true

    next()
})

router.afterEach(() => {
    const appStore = useAppStore()

    // Hide loading after navigation completes
    setTimeout(() => {
        appStore.loading = false
    }, 200) // Small delay for smooth transition
})

export default router
