// import prefetchResources from '@/middlewares/prefetch-resources'
const MODULE_NAME = 'current_stock'
const MODULE_PATH = '/current-stock'
// const { t } = useI18n()
export const routes = [
    {
        module: MODULE_NAME,
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/current-stock/views/index.vue'),
    },
    {
        module: MODULE_NAME,
        name: 'fuel_stock.fuel_stock_management',
        path: `${MODULE_PATH}/:mode/:id?`,
        meta: {
            title: MODULE_NAME,
            roles: ['Admin'],
        },
        component: () => import('@/modules/fuel-stock/views/form.vue'),
    },
]

const CURRENT_STOCK_ROUTES = [
    {
        children: routes,
        initModule: MODULE_NAME.toLowerCase(),
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
            // middleware: [prefetchResources],
            moduleName: MODULE_NAME,
        },
        beforeEnter: async (to: any, from: any, next: any) => {
            next()
        },
    },
]

export const CURRENT_STOCK = { CURRENT_STOCK_ROUTES, MODULE_NAME, MODULE_PATH }
