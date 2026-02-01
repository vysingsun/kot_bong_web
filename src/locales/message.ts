import kh_current_stock from '@/modules/current-stock/locales/kh.json'
import en_current_stock from '@/modules/current-stock/locales/en.json'
import kh_auth from '@/modules/auth/locales/kh.json'
import en_auth from '@/modules/auth/locales/en.json'
import kh_onboarding from '@/modules/OnboardingView/locales/kh.json'
import en_onboarding from '@/modules/OnboardingView/locales/en.json'

const kh = {
    ...kh_auth,
    ...kh_current_stock,
    ...kh_onboarding,
}

const en = {
    ...en_auth,
    ...en_current_stock,
    ...en_onboarding,
}

export { kh, en }
