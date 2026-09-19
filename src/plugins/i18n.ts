import { createI18n } from 'vue-i18n'
import { en, km } from '@/locales/message'

const savedLocale = localStorage.getItem('locale') || 'km'
const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: savedLocale,
    fallbackLocale: 'km', // Fallback locale if translation not available
    messages: {
        km,
        en,
    },
})

export default i18n
