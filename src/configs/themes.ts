export interface CompanyTheme {
    id: string
    name: string
    primaryColor: string
    primaryHover: string
    primaryDark: string
    primaryLight: string
    textOnPrimary: string
    secondaryColor: string
    logo: string
}

export const COMPANY_THEMES: Record<string, CompanyTheme> = {
    tela: {
        id: 'tela',
        name: 'Tela',
        primaryColor: '#149c49',
        primaryHover: '#11853e',
        primaryDark: '#0e6e33',
        primaryLight: '#43af6d',
        textOnPrimary: '#ffffff',
        secondaryColor: '#149c49',
        logo: new URL('../assets/images/tela_logo_landscape.png', import.meta.url).href,
    },
    total_energies: {
        id: 'total_energies',
        name: 'Total_Energies',
        primaryColor: '#fc0103',
        primaryHover: '#dc0103',
        primaryDark: '#c00102',
        primaryLight: '#fd3335',
        textOnPrimary: '#ffffff',
        secondaryColor: '#1A1A1A',
        logo: new URL('../assets/images/total_energies_logo.png', import.meta.url).href,
    },
    bvm_petroleum: {
        id: 'bvm_petroleum',
        name: 'BVM_Petroleum',
        primaryColor: '#4f4f4f', // Main gray
        primaryHover: '#55565a', // Darker gray for hover (15% darker)
        primaryDark: '#45464a', // Even darker gray for dark variant
        primaryLight: '#87888c', // Lighter gray for light variant
        textOnPrimary: '#ffffff', // White text on gray background
        secondaryColor: '#4f4f4f', // Gold/yellow accent color
        logo: new URL('../assets/images/bvm_logo_landscape.png', import.meta.url).href,
    },
    caltex: {
        id: 'caltex',
        name: 'Caltex',
        primaryColor: '#f00317',
        primaryHover: '#d60315',
        primaryDark: '#bc0213',
        primaryLight: '#f33548',
        textOnPrimary: '#ffffff',
        secondaryColor: '#000000',
        logo: new URL('../assets/images/caltex_logo_landscape.png', import.meta.url).href,
    },
    peace_petroleum: {
        id: 'peace_petroleum',
        name: 'Peace_Petroleum_Cambodia',
        primaryColor: '#082e72',
        primaryHover: '#072866',
        primaryDark: '#06225a',
        primaryLight: '#0a3a8e',
        textOnPrimary: '#ffffff',
        secondaryColor: '#082e72',
        logo: new URL('../assets/images/ppc_logo.png', import.meta.url).href,
    },
    lim_long: {
        id: 'lim_long',
        name: 'Lim_Long_Petroleum',
        primaryColor: '#2563eb', // Tailwind blue-600
        primaryHover: '#1d4ed8', // blue-700
        primaryDark: '#1e40af', // blue-800
        primaryLight: '#3b82f6', // blue-500
        textOnPrimary: '#ffffff',
        secondaryColor: '#2563eb',
        logo: new URL('../assets/images/lim_long_logo.jpg', import.meta.url).href,
    },
    kot_preng: {
        id: 'kot_preng',
        name: 'Kot_Preng',
        primaryColor: '#2563eb', // Tailwind blue-600
        primaryHover: '#1d4ed8', // blue-700
        primaryDark: '#1e40af', // blue-800
        primaryLight: '#3b82f6', // blue-500
        textOnPrimary: '#ffffff',
        secondaryColor: '#2563eb',
        logo: new URL('../assets/images/kotpreng.svg', import.meta.url).href,
    },
    sokimex: {
        id: 'sokimex',
        name: 'Sokimex',
        primaryColor: '#f00317',
        primaryHover: '#d60315',
        primaryDark: '#bc0213',
        primaryLight: '#f33548',
        textOnPrimary: '#ffffff',
        secondaryColor: '#000000',
        logo: new URL('../assets/images/sokimex_logo.png', import.meta.url).href,
    },
    tela_khmer: {
        id: 'tela_khmer',
        name: 'Tela_Khmer',
        primaryColor: '#f6c301',
        primaryHover: '#d9ad01',
        primaryDark: '#c29a01',
        primaryLight: '#f8d033',
        textOnPrimary: '#ffffff',
        secondaryColor: '#f6c301',
        logo: new URL('../assets/images/tela_khmer_logo.png', import.meta.url).href,
    },
}

// Get theme by company ID
export const getThemeByCompany = (companyId: string): CompanyTheme => {
    return COMPANY_THEMES[companyId.toLowerCase()] || COMPANY_THEMES.kot_preng
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

    // Default to kot_preng theme
    return COMPANY_THEMES.kot_preng
}
