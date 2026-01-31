import en_current_stock from '@/modules/current-stock/locales/en.json'
import kh_current_stock from '@/modules/current-stock/locales/kh.json'
import en_auth from '@/modules/auth/locales/en.json'
import kh_auth from '@/modules/auth/locales/kh.json'

const en = {
    ...en_auth,
    ...en_current_stock,
}
const kh = {
    ...kh_auth,
    ...kh_current_stock,
}

export { en, kh }
