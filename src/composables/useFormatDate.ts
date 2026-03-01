import { useI18n } from 'vue-i18n'

export const useFormatDate = () => {
    const { locale } = useI18n()

    const khmerDigits: Record<string, string> = {
        '0': '០',
        '1': '១',
        '2': '២',
        '3': '៣',
        '4': '៤',
        '5': '៥',
        '6': '៦',
        '7': '៧',
        '8': '៨',
        '9': '៩',
    }

    const khmerMonths = [
        'មករា',
        'កុម្ភៈ',
        'មីនា',
        'មេសា',
        'ឧសភា',
        'មិថុនា',
        'កក្កដា',
        'សីហា',
        'កញ្ញា',
        'តុលា',
        'វិច្ឆិកា',
        'ធ្នូ',
    ]

    const englishMonths = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const toKhmerDigits = (num: number): string => {
        return String(num)
            .split('')
            .map(d => khmerDigits[d] ?? d)
            .join('')
    }

    const formatDate = (date: Date | string | null | undefined): string => {
        if (!date) return ''
        const d = new Date(date)
        if (isNaN(d.getTime())) return ''

        const day = d.getDate()
        const month = d.getMonth()
        const year = d.getFullYear()

        if (locale.value === 'kh') {
            return `${toKhmerDigits(day)} ${khmerMonths[month]} ${toKhmerDigits(year)}`
        }

        return `${String(day).padStart(2, '0')} ${englishMonths[month]} ${year}`
    }

    const formatDateShort = (date: Date | string | null | undefined): string => {
        if (!date) return ''
        const d = new Date(date)
        if (isNaN(d.getTime())) return ''

        const day = d.getDate()
        const month = d.getMonth() + 1
        const year = d.getFullYear()

        if (locale.value === 'kh') {
            return `${toKhmerDigits(day)}/${toKhmerDigits(month)}/${toKhmerDigits(year)}`
        }

        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
    }

    return { formatDate, formatDateShort }
}
