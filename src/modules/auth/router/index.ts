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
]

export const AUTH = { AUTH_ROUTES, MODULE_NAME, MODULE_PATH }
