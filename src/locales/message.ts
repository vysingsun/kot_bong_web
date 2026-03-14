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
import kh_fuel_stock from '@/modules/fuel-stock/locales/kh.json'
import en_fuel_stock from '@/modules/fuel-stock/locales/en.json'
import kh_fuel_sold from '@/modules/fuel-sold/locales/kh.json'
import en_fuel_sold from '@/modules/fuel-sold/locales/en.json'
import kh_staff from '@/modules/staff/locales/kh.json'
import en_staff from '@/modules/staff/locales/en.json'
import kh_payment from '@/modules/payment/locales/kh.json'
import en_payment from '@/modules/payment/locales/en.json'

const kh = {
    ...kh_auth,
    ...kh_current_stock,
    ...kh_onboarding,
    ...kh_app,
    ...kh_fuel,
    ...kh_fuel_stock,
    ...kh_fuel_sold,
    ...kh_staff,
    ...kh_payment,
}

const en = {
    ...en_auth,
    ...en_current_stock,
    ...en_onboarding,
    ...en_app,
    ...en_fuel,
    ...en_fuel_stock,
    ...en_fuel_sold,
    ...en_staff,
    ...en_payment,
}

export { kh, en }
