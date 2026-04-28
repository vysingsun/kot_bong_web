import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Default_header from '@/layouts/default_header.vue'
import { MODULE_APP_ROUTES } from '@/modules'
import { AUTH } from '@/modules/auth/router/index'
import { isAuthenticated } from '@/middlewares/auth'
import { ONBOARDINGVIEW } from '@/modules/OnboardingView/router'
import { useAppStore } from '@/modules/app/store'
import { getFromCache, setCache } from '@/composables/useCache'
import { useThemeStore } from '@/stores/theme'
import { appService } from '@/modules/app/services/api.service'
import { getRoleName } from '@/composables/useAuth'

// Routes that skip all guards
const PUBLIC_ROUTES = ['Login', 'Register', 'Policy', 'not-found', 'ForgotPassword']

const router = createRouter({
    history: createWebHistory('/app/'),
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
        {
            path: '/fuelsalesgraph',
            name: 'menu.salesGraph',
            beforeEnter: isAuthenticated,
            component: Default_header,
            children: [
                {
                    path: '',
                    name: 'menu.salesGraph',
                    component: () => import('@/components/home/SideNavs/FuelSalesGraph.vue'),
                },
            ],
        },
        {
            path: '/fuelstockgraph',
            name: 'menu.stockGraph',
            beforeEnter: isAuthenticated,
            component: Default_header,
            children: [
                {
                    path: '',
                    name: 'menu.stockGraph',
                    component: () => import('@/components/home/SideNavs/FuelStocksGraph.vue'),
                },
            ],
        },
        {
            path: '/overview',
            name: 'menu.overview',
            beforeEnter: isAuthenticated,
            component: Default_header,
            children: [
                {
                    path: '',
                    name: 'menu.overview',
                    component: () => import('@/components/home/SideNavs/OverView.vue'),
                },
            ],
        },
        {
            name: 'payment',
            path: '/payment',
            beforeEnter: isAuthenticated,
            meta: {
                title: 'payment',
                roles: ['Admin'],
            },
            component: () => import('@/modules/payment/views/form.vue'),
        },
        // ── No isAuthenticated — avoids infinite redirect loop ──
        {
            name: 'suspended',
            path: '/suspended',
            component: () => import('@/components/home/SuspendedAccount.vue'),
        },
        {
            path: '/unauthorized',
            name: 'Unauthorized',
            component: () => import('@/components/home/Unauthorized.vue'),
            meta: { title: 'Unauthorized' },
        },
        {
            path: '/account-deleted',
            name: 'AccountDeleted',
            component: () => import('@/components/home/AccountDeleted.vue'),
            meta: { title: 'Account Deactivated' },
        },
    ],
})

router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore()

    // Skip all checks for public routes
    if (PUBLIC_ROUTES.includes(to.name as string)) {
        appStore.loading = false
        return next()
    }

    // ── Fetch user if not in cache ─────────────────────────
    let appData = getFromCache('app_data')

    if (!appData?.value) {
        try {
            const res = await appService.init()
            const result = res.data
            setCache('app_data', result.data)
            const themeStore = useThemeStore()
            themeStore.initializeTheme()
            appData = getFromCache('app_data')
        } catch {
            return next({ name: 'Login' })
        }
    }

    // ── Still no data → go to login ────────────────────────
    if (!appData?.value) {
        return next({ name: 'Login' })
    }

    const user = appData.value
    const isSuspended = user?.isSuspended === true
    const isUserRole = user?.role?.role_name === 'User'

    // Soft Delected Acc
    const isDeleted = user?.isDeleted
    if (isDeleted && to.path !== '/account-deleted') {
        return next('/account-deleted')
    }
    // ── Suspended staff ────────────────────────────────────
    if (isSuspended && isUserRole) {
        // Already on /suspended — allow, stop redirect loop
        if (to.name === 'suspended') {
            appStore.loading = false
            return next()
        }
        // Any other route → force to /suspended
        return next({ name: 'suspended' })
    }

    // ── Non-suspended user manually visits /suspended ──────
    if (to.name === 'suspended') {
        return next({ name: 'home' })
    }

    const allowedRoles = to.meta.roles as string[] | undefined

    if (allowedRoles && allowedRoles.length > 0) {
        const role = getRoleName()
        if (!allowedRoles.includes(role)) {
            return next('/unauthorized') // or next('/') or next(false)
        }
    }

    appStore.loading = true
    next()
})

router.afterEach(() => {
    const appStore = useAppStore()
    setTimeout(() => {
        appStore.loading = false
    }, 200)
})

export default router
