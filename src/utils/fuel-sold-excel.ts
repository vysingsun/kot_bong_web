// utils/fuel-sold-excel.ts  ← share between fuel_sold page AND server route
import type { ExcelColumn } from '@/utils/excel_generator'

const HEADERS = {
    en: {
        no: '#',
        date: 'Date',
        fuel: 'Fuel Type',
        qtyL: 'Qty (Liter)',
        qtyT: 'Qty (Ton)',
        priceU: 'Price/L (USD)',
        priceK: 'Price/L (KHR)',
        rate: 'Exchange Rate',
        totalU: 'Total (USD)',
        totalK: 'Total (KHR)',
        by: 'Created By',
        title: '⛽ FUEL SALES REPORT',
        sheet: 'Fuel Sales',
    },
    kh: {
        no: 'លរ',
        date: 'កាលបរិច្ឆេទ',
        fuel: 'ប្រភេទប្រេង',
        qtyL: 'បរិមាណ (លីត្រ)',
        qtyT: 'បរិមាណ (តោន)',
        priceU: 'តម្លៃ/លីត្រ (USD)',
        priceK: 'តម្លៃ/លីត្រ (KHR)',
        rate: 'អត្រាប្តូរប្រាក់',
        totalU: 'សរុប (USD)',
        totalK: 'សរុប (KHR)',
        by: 'បានកត់ត្រាដោយ',
        title: '⛽ របាយការណ៍លក់ប្រេង',
        sheet: 'លក់ប្រេង',
    },
}

const fmtD = (d: any) => {
    const dt = new Date(d)
    return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`
}
const createdBy = (item: any) => {
    const u = item.createdBy
    return u ? `${u.first_name || u.firstName || ''} ${u.last_name || u.lastName || ''}`.trim() || u.email : '—'
}

export const fuelSoldColumns = (lang: string): ExcelColumn[] => {
    const h = lang === 'kh' ? HEADERS.kh : HEADERS.en
    return [
        { key: '#', header: h.no, width: 6, align: 'center' },
        { key: 'createdAt', header: h.date, width: 16, align: 'center', getValue: item => fmtD(item.createdAt) },
        { key: 'fuel.fuel_name', header: h.fuel, width: 20, align: 'left' },
        { key: 'quantity_sold_liter', header: h.qtyL, width: 16, align: 'right', numFmt: '#,##0.000' },
        { key: 'quantity_sold_ton', header: h.qtyT, width: 14, align: 'right', numFmt: '#,##0.000' },
        { key: 'amount_per_liter_us', header: h.priceU, width: 16, align: 'right', numFmt: '"$"#,##0.0000' },
        { key: 'amount_per_liter_khr', header: h.priceK, width: 18, align: 'right', numFmt: '#,##0.00"៛"' },
        { key: 'exchange_rate', header: h.rate, width: 14, align: 'right', numFmt: '#,##0.00' },
        { key: 'total_amount_us', header: h.totalU, width: 16, align: 'right', numFmt: '"$"#,##0.00', isMoney: true },
        { key: 'total_amount_khr', header: h.totalK, width: 18, align: 'right', numFmt: '#,##0.00"៛"' },
        { key: 'createdBy', header: h.by, width: 22, align: 'left', getValue: createdBy },
    ]
}

export const fuelSoldTitle = (lang: string) => (lang === 'kh' ? HEADERS.kh.title : HEADERS.en.title)
export const fuelSoldSheet = (lang: string) => (lang === 'kh' ? HEADERS.kh.sheet : HEADERS.en.sheet)
export const fuelSoldTotalsKeys = [
    { colIndex: 3, key: 'quantity_sold_liter', numFmt: '#,##0.000"L"' },
    { colIndex: 4, key: 'quantity_sold_ton', numFmt: '#,##0.000"T"' },
    { colIndex: 8, key: 'total_amount_us', numFmt: '"$"#,##0.00' },
    { colIndex: 9, key: 'total_amount_khr', numFmt: '#,##0.00"៛"' },
]
