import { isUnauthenticated } from '@/middlewares/auth'
const MODULE_NAME = 'Auth'
const MODULE_PATH = '/auth'

export const routes = [
    {
        module: MODULE_NAME,
        name: 'Login',
        path: `${MODULE_PATH}/login`,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/auth/views/login.vue'),
    },
    {
        module: MODULE_NAME,
        name: 'Register',
        path: `${MODULE_PATH}/register`,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/auth/views/register.vue'),
    },
]

const oauthCallbackRoutes = [
    {
        module: MODULE_NAME,
        name: 'GoogleAuthSuccess',
        path: `${MODULE_PATH}/google/success`,
        meta: {
            title: MODULE_NAME,
            requiresAuth: false,
        },
        component: () => import('@/modules/auth/views/GoogleAuthSuccess.vue'),
    },
    {
        module: MODULE_NAME,
        name: 'FacebookAuthSuccess',
        path: `${MODULE_PATH}/facebook/success`,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/auth/views/FacebookAuthSuccess.vue'),
    },
]

const AUTH_ROUTES = [
    {
        children: routes,
        name: MODULE_NAME,
        path: MODULE_PATH,
        beforeEnter: isUnauthenticated,
        meta: {
            title: MODULE_NAME,
            moduleName: MODULE_NAME,
        },
    },
    ...oauthCallbackRoutes,
    {
        module: MODULE_NAME,
        name: 'ForgotPassword',
        path: `${MODULE_PATH}/forgot-password`,
        meta: {
            title: 'Forgot Password',
            requiresAuth: false,
        },
        component: () => import('@/modules/auth/views/ForgotPassword.vue'),
    },
]

export const AUTH = { AUTH_ROUTES, MODULE_NAME, MODULE_PATH }
