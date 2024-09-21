import { useAppStore } from '@/modules/app/store/index'
export function isAuthenticated(to, form, next) {
  const appStore = useAppStore()
  appStore
    .init()
    .then(() => {
        next()
    //   const returnUrl = from.query.returnUrl
    //   if (returnUrl !== to.path) {
    //     next(returnUrl)
    //   } else {
    //     next()
    //   }
    })
    .catch((error) => {
        next({ name: 'Login' })
    //   if (error.response.status == HTTP_STATUS.UNAUTHORIZED) {
    //     const returnUrl = sessionStorage.getItem('returnUrl')
    //     next({ name: 'Login', query: { returnUrl: returnUrl } })
    //   }
    })
}
