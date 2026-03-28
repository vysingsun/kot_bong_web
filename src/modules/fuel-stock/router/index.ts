import i18n from '@/plugins/i18n'
const MODULE_NAME = i18n.global.t('menu.stocksReport')
const MODULE_PATH = '/fuel-stock'

export const routes = [
    {
        module: MODULE_NAME,
        name: `${MODULE_NAME}`,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
            roles: ['Admin'],
        },
        component: () => import('@/modules/fuel-stock/views/index.vue'),
    },
    // {
    //     module: MODULE_NAME,
    //     name: `${MODULE_NAME}-Detail`,
    //     path: `${MODULE_PATH}/:mode/:id?`,
    //     meta: {
    //         title: MODULE_NAME,
    //     },
    //     component: () => import('@/modules/fuel-stock/views/form.vue'),
    // },
]

const FUEL_STOCK_ROUTES = [
    {
        children: routes,
        initModule: MODULE_NAME.toLowerCase(),
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
            moduleName: MODULE_NAME,
        },
        beforeEnter: async (to: any, from: any, next: any) => {
            next()
        },
    },
]

export const FUEL_STOCK = { FUEL_STOCK_ROUTES, MODULE_NAME, MODULE_PATH }
