const MODULE_NAME = 'Fuel-stock'
const MODULE_PATH = '/fuel-stock'

export const routes = [
    {
        module: MODULE_NAME,
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/fuel-stock/views/index.vue'),
    },
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
