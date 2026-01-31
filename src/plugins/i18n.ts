import { createI18n } from 'vue-i18n'
import { en, kh } from '@/locales/message'

const savedLocale = localStorage.getItem('locale') || 'en'
const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: savedLocale,
    fallbackLocale: 'en', // Fallback locale if translation not available
    messages: {
        kh,
        en,
    },
})

export default i18n
