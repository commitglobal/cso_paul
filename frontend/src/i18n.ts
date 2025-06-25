import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enJSON from './locales/en.json'
import roJSON from './locales/ro.json'

i18n
  .use(LanguageDetector)  // Add this line
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enJSON },
      ro: { translation: roJSON }
    },
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
