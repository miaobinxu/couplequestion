import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// Import translation files
import en from './translations/en.json';
import es from './translations/es.json';

// Define available languages
export const LANGUAGES = {
  en: 'English',
  es: 'Español',
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

// Get device language
const getDeviceLanguage = (): LanguageCode => {
  const locales = RNLocalize.getLocales();
  const deviceLanguage = locales[0]?.languageCode;
  
  // Check if device language is supported, otherwise default to English
  if (deviceLanguage && Object.keys(LANGUAGES).includes(deviceLanguage)) {
    return deviceLanguage as LanguageCode;
  }
  
  return 'en';
};

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    debug: __DEV__,
    
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Helper function to change language
export const changeLanguage = (languageCode: LanguageCode) => {
  return i18n.changeLanguage(languageCode);
};

// Helper function to get current language
export const getCurrentLanguage = (): LanguageCode => {
  return i18n.language as LanguageCode;
};

// Helper function to get available languages
export const getAvailableLanguages = () => {
  return Object.entries(LANGUAGES).map(([code, name]) => ({
    code: code as LanguageCode,
    name,
  }));
};
