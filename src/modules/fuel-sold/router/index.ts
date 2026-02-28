import i18n from '@/plugins/i18n'
const MODULE_NAME = i18n.global.t('fuel_sold.title')
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
    {
        module: MODULE_NAME,
        name: i18n.global.t('fuel_sold.fuel_sold_management'),
        path: `${MODULE_PATH}/:mode/:id?`,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/fuel-sold/views/form.vue'),
    },
    {
        module: MODULE_NAME,
        name: i18n.global.t('menu.salesReport'),
        path: `${MODULE_PATH}/report`,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/fuel-sold/views/report.vue'),
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
