// utils/excel_generator.ts
// ─── Browser-side port of services/excel_generator.js ──────────
// Uses ExcelJS (works in browser via npm: exceljs)
// Produces byte-for-byte identical styling to the server version.

import ExcelJS from 'exceljs'

// ══════════════════════════════════════════════════════════════
// PALETTE  (extracted from reference .xlsx)
// ══════════════════════════════════════════════════════════════
const C = {
    titleBg: 'FF1C64F2',
    titleFg: 'FFFFFFFF',

    subBg: 'FFD1E0FF',
    subFg: 'FF1E3A8A',

    headerBg: 'FF1C64F2',
    headerFg: 'FFFFFFFF',

    rowOdd: 'FFF0F7FF',
    rowEven: 'FFFFFFFF',
    dataFg: 'FF111827',

    moneyFg: 'FF057A55',

    totalBg: 'FFEFF6FF',
    totalLabelFg: 'FF1E3A8A',
    totalValueFg: 'FF1C64F2',

    borderThin: 'FFD1E0FF',
} as const

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════
export interface ExcelColumn {
    key: string // dot-notation field path
    header: string // column header label
    width?: number // column width in chars
    align?: 'left' | 'center' | 'right'
    numFmt?: string // Excel number-format string
    isMoney?: boolean // bold green font
    getValue?: (item: any, lang: string) => any
}

export interface ExcelTotal {
    colIndex: number // 0-based
    value: number
    numFmt?: string
}

export interface GenerateExcelOptions {
    title?: string
    sheetName?: string
    lang?: string
    start_date?: string
    end_date?: string
    allRecords?: boolean
    subInfo?: string
    columns: ExcelColumn[]
    rows: any[]
    totals?: ExcelTotal[]
    totalLabelSpan?: number
}

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════
const mkFill = (argb: string): ExcelJS.Fill => ({
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb },
})

const mkBorder = (style: ExcelJS.BorderStyle = 'thin'): Partial<ExcelJS.Borders> => {
    const s: ExcelJS.Border = { style, color: { argb: C.borderThin } }
    return { top: s, bottom: s, left: s, right: s }
}

const AL: Record<string, Partial<ExcelJS.Alignment>> = {
    center: { horizontal: 'center', vertical: 'middle', wrapText: false },
    left: { horizontal: 'left', vertical: 'middle', wrapText: false },
    right: { horizontal: 'right', vertical: 'middle', wrapText: false },
}

const fmtDate = (d?: string | Date | null): string => {
    if (!d) return ''
    const dt = new Date(d)
    const dd = String(dt.getDate()).padStart(2, '0')
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    return `${dd}/${mm}/${dt.getFullYear()}`
}

const LABELS: Record<string, Record<string, string>> = {
    en: { period: 'Period', generated: 'Generated', allRecords: 'All Records', total: 'TOTAL', records: 'records' },
    kh: {
        period: 'រយៈពេល',
        generated: 'បង្កើតនៅ',
        allRecords: 'កំណត់ត្រាទាំងអស់',
        total: 'សរុបរួម',
        records: 'កំណត់ត្រា',
    },
}

const resolvePath = (obj: any, path: string): any => path.split('.').reduce((o, k) => (o != null ? o[k] : null), obj)

// ══════════════════════════════════════════════════════════════
// generateExcel  — runs entirely in the browser, no API call
// Returns a Blob ready for download
// ══════════════════════════════════════════════════════════════
export const generateExcel = async ({
    title = 'REPORT',
    sheetName = 'Sheet1',
    lang = 'en',
    start_date,
    end_date,
    allRecords = false,
    subInfo = '',
    columns = [],
    rows = [],
    totals = [],
    totalLabelSpan = 3,
}: GenerateExcelOptions): Promise<Blob> => {
    const isKh = lang === 'kh'
    const L = LABELS[isKh ? 'kh' : 'en']
    const font = isKh ? 'Kantumruy Pro' : 'Calibri'
    const NCOLS = columns.length

    const wb = new ExcelJS.Workbook()
    wb.creator = 'Fuel Management System'
    wb.created = new Date()

    const ws = wb.addWorksheet(sheetName, {
        pageSetup: {
            paperSize: 9,
            orientation: 'landscape',
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            margins: { left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
        },
        views: [{ state: 'frozen', ySplit: 3, xSplit: 0 }],
        properties: { tabColor: { argb: C.headerBg } },
    } as any)

    ws.columns = columns.map(c => ({ width: c.width ?? 16 }))

    // ── ROW 1 — Title banner ──────────────────────────────────
    ws.mergeCells(1, 1, 1, NCOLS)
    const r1 = ws.getRow(1)
    r1.height = 40
    const r1c1 = r1.getCell(1)
    r1c1.value = title
    r1c1.fill = mkFill(C.titleBg)
    r1c1.font = { name: font, size: isKh ? 15 : 17, bold: true, color: { argb: C.titleFg } }
    r1c1.alignment = { ...AL.center }

    // ── ROW 2 — Sub-info bar ──────────────────────────────────
    ws.mergeCells(2, 1, 2, NCOLS)
    const r2 = ws.getRow(2)
    r2.height = 20
    const dateStr =
        !allRecords && start_date && end_date ? `${fmtDate(start_date)}  →  ${fmtDate(end_date)}` : L.allRecords
    const r2c1 = r2.getCell(1)
    r2c1.value = [`${L.period}: ${dateStr}`, subInfo, `${L.generated}: ${fmtDate(new Date())}`]
        .filter(Boolean)
        .join('     ')
    r2c1.fill = mkFill(C.subBg)
    r2c1.font = { name: font, size: isKh ? 9 : 10, color: { argb: C.subFg } }
    r2c1.alignment = { ...AL.center }

    // ── ROW 3 — Column headers ────────────────────────────────
    const r3 = ws.getRow(3)
    r3.height = 32
    columns.forEach((col, i) => {
        const cell = r3.getCell(i + 1)
        cell.value = col.header
        cell.fill = mkFill(C.headerBg)
        cell.font = { name: font, size: isKh ? 10 : 11, bold: true, color: { argb: C.headerFg } }
        cell.alignment = { ...AL.center }
        cell.border = mkBorder('thin')
    })

    if (rows.length > 0) {
        ws.autoFilter = { from: { row: 3, column: 1 }, to: { row: 3, column: NCOLS } }
    }

    // ── ROWS 4+ — Data ────────────────────────────────────────
    rows.forEach((item, idx) => {
        const dr = ws.getRow(idx + 4)
        dr.height = 22
        const bgArgb = idx % 2 === 0 ? C.rowOdd : C.rowEven

        columns.forEach((col, ci) => {
            const cell = dr.getCell(ci + 1)
            const val =
                typeof col.getValue === 'function' ? col.getValue(item, lang) : (resolvePath(item, col.key) ?? '')

            cell.value = val
            cell.fill = mkFill(bgArgb)
            cell.font = {
                name: font,
                size: isKh ? 9 : 10,
                bold: !!col.isMoney,
                color: { argb: col.isMoney ? C.moneyFg : C.dataFg },
            }
            cell.alignment = { ...AL[col.align ?? 'left'] }
            cell.border = mkBorder('thin')
            if (col.numFmt) cell.numFmt = col.numFmt
        })
    })

    // ── TOTALS ROW ────────────────────────────────────────────
    if (rows.length > 0 && totals.length > 0) {
        const trn = rows.length + 4
        const tr = ws.getRow(trn)
        tr.height = 26
        const span = Math.min(totalLabelSpan, NCOLS)

        ws.mergeCells(trn, 1, trn, span)
        const lc = tr.getCell(1)
        lc.value = `${L.total}  (${rows.length.toLocaleString()} ${L.records})`
        lc.fill = mkFill(C.totalBg)
        lc.font = { name: font, size: isKh ? 10 : 11, bold: true, color: { argb: C.totalLabelFg } }
        lc.alignment = { ...AL.center }
        lc.border = mkBorder('medium')

        for (let ci = span + 1; ci <= NCOLS; ci++) {
            const cell = tr.getCell(ci)
            cell.fill = mkFill(C.totalBg)
            cell.border = mkBorder('medium')
        }

        totals.forEach(({ colIndex, value, numFmt }) => {
            if (colIndex < span) return
            const cell = tr.getCell(colIndex + 1)
            cell.value = value ?? 0
            cell.fill = mkFill(C.totalBg)
            cell.font = { name: font, size: isKh ? 10 : 11, bold: true, color: { argb: C.totalValueFg } }
            cell.alignment = { ...AL.right }
            cell.border = mkBorder('medium')
            if (numFmt) cell.numFmt = numFmt
        })
    }

    // ── EMPTY STATE ───────────────────────────────────────────
    if (rows.length === 0) {
        ws.mergeCells(4, 1, 4, NCOLS)
        const er = ws.getRow(4)
        er.height = 40
        const ec = er.getCell(1)
        ec.value = isKh ? 'មិនមានទិន្នន័យ' : 'No data available'
        ec.fill = mkFill('FFFAFAFA')
        ec.font = { name: font, size: 11, italic: true, color: { argb: 'FF9CA3AF' } }
        ec.alignment = { ...AL.center }
        ec.border = mkBorder('thin')
    }

    ws.pageSetup.printTitlesRow = '1:3'

    // ── Write to Blob (browser) ───────────────────────────────
    const buffer = await wb.xlsx.writeBuffer()
    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
}

// ══════════════════════════════════════════════════════════════
// triggerDownload  — saves the Blob as a file in the browser
// ══════════════════════════════════════════════════════════════
export const triggerDownload = (blob: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}
