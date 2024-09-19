const MODULE_NAME = 'Auth'
const MODULE_PATH = '/auth'

export const routes = [
  {
    module: MODULE_NAME,
    name: MODULE_NAME,
    path: `${MODULE_PATH}/login`,
    meta: {
      title: MODULE_NAME
    },
    component: () => import('@/modules/auth/views/login.vue')
  }
]

const AUTH_ROUTES = [
  {
    children: routes,
    initModule: MODULE_NAME.toLowerCase(),
    name: MODULE_NAME,
    path: MODULE_PATH,
    meta: {
      title: MODULE_NAME,
      //   middleware: [prefetchResources],
      moduleName: MODULE_NAME
    },
    beforeEnter: async (to: any, from: any, next: any) => {
      next()
    }
  }
]

export const AUTH = { AUTH_ROUTES, MODULE_NAME, MODULE_PATH }
