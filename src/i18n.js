import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { translation as translationTH } from './locales/TH';
import { translation as translationEN } from './locales/EN';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (cb) => {
    cb('th');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    react: { useSuspense: false },
    resources: {
      th: {
        translation: { ...translationTH },
      },
      en: {
        translation: { ...translationEN },
      },
    },
  });

export default i18next;
