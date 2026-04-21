import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importer les traductions
import frCommon from './traduction/fr/common.json';
import enCommon from './traduction/en/common.json';
import arCommon from './traduction/ar/common.json';

const resources = {
  fr: {
    common: frCommon
  },
  en: {
    common: enCommon
  },
  ar: {
    common: arCommon
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
