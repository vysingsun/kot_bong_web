import { createI18n } from 'vue-i18n'
import { en, kh } from '@/locales/message'

const i18n = createI18n({
    // legacy: false, // Use Composition API
    // locale: 'en', // Default locale
    locale: 'kh', // Default locale
    fallbackLocale: 'en', // Fallback locale if translation not available
    messages: {
        kh,
        en,
    },
})

export default i18n
