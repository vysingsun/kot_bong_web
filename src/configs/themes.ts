export interface CompanyTheme {
    id: string
    name: string
    primaryColor: string
    primaryHover: string
    primaryDark: string
    primaryLight: string
    textOnPrimary: string
}

export const COMPANY_THEMES: Record<string, CompanyTheme> = {
    tela: {
        id: 'tela',
        name: 'Tela',
        primaryColor: '#f6c301',
        primaryHover: '#d9ad01',
        primaryDark: '#c29a01',
        primaryLight: '#f8d033',
        textOnPrimary: '#000000',
    },
    total_energies: {
        id: 'total_energies',
        name: 'Total Energies',
        primaryColor: '#fc0103',
        primaryHover: '#dc0103',
        primaryDark: '#c00102',
        primaryLight: '#fd3335',
        textOnPrimary: '#ffffff',
    },
    bvm_petroleum: {
        id: 'bvm_petroleum',
        name: 'BVM Petroleum',
        primaryColor: '#e9b643',
        primaryHover: '#d4a33c',
        primaryDark: '#c29235',
        primaryLight: '#edc566',
        textOnPrimary: '#000000',
    },
    caltex: {
        id: 'caltex',
        name: 'Caltex',
        primaryColor: '#f00317',
        primaryHover: '#d60315',
        primaryDark: '#bc0213',
        primaryLight: '#f33548',
        textOnPrimary: '#ffffff',
    },
    peace_petroleum: {
        id: 'peace_petroleum',
        name: 'Peace Petroleum Cambodia',
        primaryColor: '#082e72',
        primaryHover: '#072866',
        primaryDark: '#06225a',
        primaryLight: '#0a3a8e',
        textOnPrimary: '#ffffff',
    },
    ppt: {
        id: 'ppt',
        name: 'PPT',
        primaryColor: '#2563eb', // Tailwind blue-600
        primaryHover: '#1d4ed8', // blue-700
        primaryDark: '#1e40af', // blue-800
        primaryLight: '#3b82f6', // blue-500
        textOnPrimary: '#ffffff',
    },
}

// Get theme by company ID
export const getThemeByCompany = (companyId: string): CompanyTheme => {
    return COMPANY_THEMES[companyId.toLowerCase()] || COMPANY_THEMES.ppt
}

// Get theme from station name
export const getThemeByStationName = (stationName: string): CompanyTheme => {
    const normalizedName = stationName.toLowerCase().replace(/\s+/g, '_')

    // Try exact match
    if (COMPANY_THEMES[normalizedName]) {
        return COMPANY_THEMES[normalizedName]
    }

    // Try partial match
    for (const [key, theme] of Object.entries(COMPANY_THEMES)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            return theme
        }
    }

    // Default to PPT theme
    return COMPANY_THEMES.ppt
}
