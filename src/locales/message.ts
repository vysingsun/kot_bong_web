import km_current_stock from '@/modules/current-stock/locales/km.json'
import en_current_stock from '@/modules/current-stock/locales/en.json'
import km_auth from '@/modules/auth/locales/km.json'
import en_auth from '@/modules/auth/locales/en.json'
import km_onboarding from '@/modules/OnboardingView/locales/km.json'
import en_onboarding from '@/modules/OnboardingView/locales/en.json'
import km_app from '@/modules/app/locales/km.json'
import en_app from '@/modules/app/locales/en.json'
import km_fuel from '@/modules/fuel/locales/km.json'
import en_fuel from '@/modules/fuel/locales/en.json'
import km_fuel_stock from '@/modules/fuel-stock/locales/km.json'
import en_fuel_stock from '@/modules/fuel-stock/locales/en.json'
import km_fuel_sold from '@/modules/fuel-sold/locales/km.json'
import en_fuel_sold from '@/modules/fuel-sold/locales/en.json'
import km_staff from '@/modules/staff/locales/km.json'
import en_staff from '@/modules/staff/locales/en.json'
import km_payment from '@/modules/payment/locales/km.json'
import en_payment from '@/modules/payment/locales/en.json'
import km_setting from '@/modules/setting/locales/km.json'
import en_setting from '@/modules/setting/locales/en.json'
import km_landing from '@/modules/landing/locales/km.json'
import en_landing from '@/modules/landing/locales/en.json'
import km_fuel_price_estimate from '@/modules/fuel-price-estimate/locales/km.json'
import en_fuel_price_estimate from '@/modules/fuel-price-estimate/locales/en.json'

const km = {
    ...km_auth,
    ...km_current_stock,
    ...km_onboarding,
    ...km_app,
    ...km_fuel,
    ...km_fuel_stock,
    ...km_fuel_sold,
    ...km_staff,
    ...km_payment,
    ...km_setting,
    ...km_landing,
    ...km_fuel_price_estimate,
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
    ...en_setting,
    ...en_landing,
    ...en_fuel_price_estimate,
}

export { km, en }
