import i18n from '@/plugins/i18n'
const MODULE_NAME = i18n.global.t('Setting')
const MODULE_PATH = '/setting'

export const routes = [
    {
        module: MODULE_NAME,
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
            roles: ['Admin'],
        },
        component: () => import('@/modules/setting/views/index.vue'),
    },
]

const SETTING_ROUTES = [
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

export const SETTING = { SETTING_ROUTES, MODULE_NAME, MODULE_PATH }
