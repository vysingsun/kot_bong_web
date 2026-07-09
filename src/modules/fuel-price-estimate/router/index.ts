const MODULE_NAME = 'fuel_price_estimate'
const MODULE_PATH = '/fuel-price-estimate'

export const routes = [
    {
        module: MODULE_NAME,
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
            roles: ['Super_Admin', 'Admin'],
        },
        component: () => import('@/modules/fuel-price-estimate/views/index.vue'),
    },
    {
        module: MODULE_NAME,
        name: `${MODULE_NAME}.detail`,
        path: `${MODULE_PATH}/:id`,
        meta: {
            title: MODULE_NAME,
            roles: ['Super_Admin', 'Admin'],
        },
        component: () => import('@/modules/fuel-price-estimate/views/detail.vue'),
    },
]

const FUEL_PRICE_ESTIMATE_ROUTES = [
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

export const FUEL_PRICE_ESTIMATE = { FUEL_PRICE_ESTIMATE_ROUTES, MODULE_NAME, MODULE_PATH }
