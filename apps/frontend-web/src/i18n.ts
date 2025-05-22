import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esCommon from './locales/es/common.json';
import enCommon from './locales/en/common.json';

i18n
  .use(LanguageDetector)            // Detecta el idioma del navegador
  .use(initReactI18next)            // Conecta con React
  .init({
    resources: {
      es: { common: esCommon },
      en: { common: enCommon },
    },
    fallbackLng: 'es',              // Si no encuentra, usa español
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring','cookie','localStorage','navigator'],
      caches: ['cookie'],
    },
  });

export default i18n;
