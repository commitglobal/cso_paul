import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enJSON from './locales/en.json'
import roJSON from './locales/ro.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    cn: { ...roJSON }
  },
  lng: 'en'
})
