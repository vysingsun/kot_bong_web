import i18n from '@/plugins/i18n'
const MODULE_NAME = i18n.global.t('staff.title')
const MODULE_PATH = '/staff'

export const routes = [
    {
        module: MODULE_NAME,
        name: MODULE_NAME,
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/staff/views/index.vue'),
    },
    {
        module: MODULE_NAME,
        name: i18n.global.t('staff.staff_management'),
        path: `${MODULE_PATH}/:mode/:id?`,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/staff/views/form.vue'),
    },
]

const STAFF_ROUTES = [
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

export const STAFF = { STAFF_ROUTES, MODULE_NAME, MODULE_PATH }
