import i18n from 'i18next'
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from 'react-i18next'
import XHR from 'i18next-xhr-backend'
import languageJP from './jp/translation.json';
import languageEN from './en/translation.json';

i18n
    .use(XHR)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            jp: {
                translations: languageJP
            },
            en: {
                translations: languageEN
            }
        },
        // lng: "jp",
        fallbackLng: 'jp',
        supportedLngs: ['jp', 'en'],
        nonExplicitSupportedLngs: true,
        debug: false,
        ns: ["translations"],
        defaultNS: "translations",
        keySeparator: ".",
        interpolation: {
            escapeValue: false,
            formatSeparator: ","
        },
        react: {
            useSuspense: false,
            bindI18n: 'languageChanged loaded',
            bindStore: 'added removed',
            nsMode: 'default'
        }
    });

// (i18n.language !== 'en' && i18n.language !== 'jp') && i18n.changeLanguage('jp');
i18n.changeLanguage('jp')
export default i18n;