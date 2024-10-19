const MODULE_NAME = 'Fuel-Sold'
const MODULE_PATH = '/fuel-sold'

export const routes = [
    {
        module: MODULE_NAME,
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/fuel-sold/views/index.vue'),
    },
]

const FUEL_SOLD_ROUTES = [
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

export const FUEL_SOLD = { FUEL_SOLD_ROUTES, MODULE_NAME, MODULE_PATH }
