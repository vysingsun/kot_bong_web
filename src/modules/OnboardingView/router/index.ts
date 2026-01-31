import { isAuthenticated } from '@/middlewares/auth'
const MODULE_NAME = 'Onboarding'
const MODULE_PATH = '/onboarding'

export const routes = [
    {
        module: MODULE_NAME,
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/OnboardingView/views/index.vue'),
    },
]

const ONBOARDINGVIEW_ROUTES = [
    {
        children: routes,
        initModule: MODULE_NAME.toLowerCase(),
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
            moduleName: MODULE_NAME,
        },
        beforeEnter: isAuthenticated,
    },
]

export const ONBOARDINGVIEW = { ONBOARDINGVIEW_ROUTES, MODULE_NAME, MODULE_PATH }
