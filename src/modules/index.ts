import { CURRENT_STOCK } from '@/modules/current-stock/router/index'
import { FUEL_STOCK } from '@/modules/fuel-stock/router/index'
import { FUEL_SOLD } from '@/modules/fuel-sold/router/index'
import { FUEL } from '@/modules/fuel/router/index'
import { STAFF } from '@/modules/staff/router/index'
import { PAYMENT } from '@/modules/payment/router/index'

export const MODULE_APP_ROUTES = [
    ...CURRENT_STOCK.CURRENT_STOCK_ROUTES,
    ...FUEL_STOCK.FUEL_STOCK_ROUTES,
    ...FUEL_SOLD.FUEL_SOLD_ROUTES,
    ...FUEL.FUEL_ROUTES,
    ...STAFF.STAFF_ROUTES,
    ...PAYMENT.PAYMENT_ROUTES,
]
