import { useTranslation as useI18nTranslation } from 'react-i18next';
import { LanguageCode, changeLanguage, getCurrentLanguage, getAvailableLanguages } from '@/src/localization/i18n';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  return {
    // Translation function
    t,
    
    // Current language
    currentLanguage: getCurrentLanguage(),
    
    // Available languages
    availableLanguages: getAvailableLanguages(),
    
    // Change language function
    changeLanguage: (languageCode: LanguageCode) => changeLanguage(languageCode),
    
    // Check if language is RTL (for future Arabic/Hebrew support)
    isRTL: i18n.dir() === 'rtl',
    
    // i18n instance for advanced usage
    i18n,
  };
};

export default useTranslation;
