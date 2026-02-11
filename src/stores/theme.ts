import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getThemeByStationName, type CompanyTheme, COMPANY_THEMES } from '@/configs/themes'
import { getFromCache, setCache } from '@/composables/useCache'

export const useThemeStore = defineStore('theme', () => {
    const currentTheme = ref<CompanyTheme>(COMPANY_THEMES.ppt)

    // Apply theme to document
    const applyTheme = (theme: CompanyTheme) => {
        const root = document.documentElement

        root.style.setProperty('--color-primary', theme.primaryColor)
        root.style.setProperty('--color-primary-hover', theme.primaryHover)
        root.style.setProperty('--color-primary-dark', theme.primaryDark)
        root.style.setProperty('--color-primary-light', theme.primaryLight)
        root.style.setProperty('--color-text-on-primary', theme.textOnPrimary)

        // Save to cache
        setCache('theme', theme.id)

        currentTheme.value = theme
    }

    // Initialize theme from app_data or cache
    const initializeTheme = () => {
        const appData = getFromCache('app_data')

        if (appData && appData.value?.stations?.[0]?.station_name) {
            const stationName = appData.value.stations[0].station_name
            const theme = getThemeByStationName(stationName)
            applyTheme(theme)
        } else {
            // Try to get from cache
            const cachedThemeId = getFromCache('theme')
            if (cachedThemeId && cachedThemeId.value) {
                const theme = COMPANY_THEMES[cachedThemeId.value] || COMPANY_THEMES.ppt
                applyTheme(theme)
            } else {
                // Default theme
                applyTheme(COMPANY_THEMES.ppt)
            }
        }
    }

    // Set theme by company ID
    const setTheme = (companyId: string) => {
        const theme = COMPANY_THEMES[companyId] || COMPANY_THEMES.ppt
        applyTheme(theme)
    }

    return {
        currentTheme,
        applyTheme,
        initializeTheme,
        setTheme,
    }
})
