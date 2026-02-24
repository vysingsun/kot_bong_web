// import prefetchResources from '@/middlewares/prefetch-resources'
import i18n from '@/plugins/i18n' // Ensure you import the i18n instance
const MODULE_NAME = i18n.global.t('current_stock')
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
        name: `${MODULE_NAME}-Detail`,
        path: `${MODULE_PATH}/:mode/:id?`,
        meta: {
            title: MODULE_NAME,
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
