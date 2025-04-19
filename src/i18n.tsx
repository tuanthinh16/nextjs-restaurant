import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../public/locales/en/common.json';
import vi from '../public/locales/vi/common.json';
import ko from '../public/locales/ko/common.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { common: en },
        vi: { common: vi },
        ko: { common: ko },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    ns: ['common'], // Namespace used in translations
    defaultNS: 'common',
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;