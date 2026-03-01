import i18n from '@/plugins/i18n'
const MODULE_NAME = i18n.global.t('fuel.fuel')
const MODULE_PATH = '/fuel'

export const routes = [
    {
        module: MODULE_NAME,
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/fuel/views/index.vue'),
    },
    {
        module: MODULE_NAME,
        name: i18n.global.t('fuel.fuel_management'),
        path: `${MODULE_PATH}/:mode/:id?`,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/fuel/views/form.vue'),
    },
]

const FUEL_ROUTES = [
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

export const FUEL = { FUEL_ROUTES, MODULE_NAME, MODULE_PATH }
