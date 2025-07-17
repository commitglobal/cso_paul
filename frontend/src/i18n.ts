import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enJSON from './locales/en/translation.json'
import roJSON from './locales/ro/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enJSON },
      ro: { translation: roJSON }
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    interpolation: {
      escapeValue: false
    },
    debug: import.meta.env.DEV
  })

export default i18n
