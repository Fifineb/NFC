import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./traduction/fr/common.json";
import en from "./traduction/en/common.json";
import ar from "./traduction/ar/common.json";

i18n
.use(initReactI18next)
.init({
  resources: {
    fr: {
      translation: fr,
    },
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
  },

  lng: "fr",

  fallbackLng: "fr",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
