import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enJSON from "./locales/en/translation.json";
import roJSON from "./locales/ro/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    resources: {
      en: { translation: enJSON },
      ro: { translation: roJSON },
    },
    supportedLngs: ["en", "ro"],
    fallbackLng: "en",
    load: "languageOnly",
    lng: import.meta.env.DEV && import.meta.env.VITE_LNG_CIMODE ? "cimode" : undefined,
    debug: import.meta.env.DEV,
  });

export default i18n;
