import i18n from '@/plugins/i18n'
const MODULE_NAME = 'Subscription'
const MODULE_PATH = '/subscription'

export const routes = [
    {
        module: MODULE_NAME,
        name: i18n.global.t('payment.subscription'),
        path: MODULE_PATH,
        meta: {
            title: MODULE_NAME,
        },
        component: () => import('@/modules/payment/views/index.vue'),
    },
]

const PAYMENT_ROUTES = [
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

export const PAYMENT = { PAYMENT_ROUTES, MODULE_NAME, MODULE_PATH }
