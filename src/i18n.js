import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
 
import Backend from 'i18next-xhr-backend';

import translationIT from "./locales/it/translation.json";
import translationEN from "./locales/en/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  it: {
    translation: translationIT,
  },
};

i18n
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // connect with React
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    lng: 'en',
    fallbackLng: 'en',
    whitelist: ['en', 'it'],
    resources,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });
 
export default i18n;