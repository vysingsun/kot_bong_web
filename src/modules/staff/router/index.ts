const MODULE_NAME = 'staff.title'
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
        name: 'staff.staff_management',
        path: `${MODULE_PATH}/:mode/:id?`,
        meta: {
            title: MODULE_NAME,
            roles: ['Admin'],
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
