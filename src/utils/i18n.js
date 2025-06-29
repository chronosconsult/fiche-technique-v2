// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationFR from '../locales/fr/translation.json';
import translationEN from '../locales/en/translation.json';
import translationES from '../locales/es/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: translationFR },
      en: { translation: translationEN },
      es: { translation: translationES },
    },
    fallbackLng: 'fr',
    detection: {
      order: ['navigator'],
      caches: []
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
