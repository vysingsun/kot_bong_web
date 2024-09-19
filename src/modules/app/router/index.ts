
import prefetchResources from '@/middlewares/prefetch-resources'

const MODULE_NAME = 'App'
const MODULE_PATH = '/app'

export const routes = [
    {
        module: MODULE_NAME,
        name: 'list',
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/app/views/index.vue'),
    },
]

const APP_ROUTES = [
    {
        children: routes,
        initModule: MODULE_NAME.toLowerCase(),
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
            middleware: [prefetchResources],
            moduleName: MODULE_NAME,
        },
        beforeEnter: async (to: any, from: any, next: any) => {
            next()
        },
    },
]

export const APP = { APP_ROUTES, MODULE_NAME, MODULE_PATH }
        