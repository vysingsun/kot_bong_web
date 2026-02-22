import kh_current_stock from '@/modules/current-stock/locales/kh.json'
import en_current_stock from '@/modules/current-stock/locales/en.json'
import kh_auth from '@/modules/auth/locales/kh.json'
import en_auth from '@/modules/auth/locales/en.json'
import kh_onboarding from '@/modules/OnboardingView/locales/kh.json'
import en_onboarding from '@/modules/OnboardingView/locales/en.json'
import kh_app from '@/modules/app/locales/kh.json'
import en_app from '@/modules/app/locales/en.json'
import kh_fuel from '@/modules/fuel/locales/kh.json'
import en_fuel from '@/modules/fuel/locales/en.json'

const kh = {
    ...kh_auth,
    ...kh_current_stock,
    ...kh_onboarding,
    ...kh_app,
    ...kh_fuel,
}

const en = {
    ...en_auth,
    ...en_current_stock,
    ...en_onboarding,
    ...en_app,
    ...en_fuel,
}

export { kh, en }
