import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/locales/en.json';
import ko from '@/locales/ko.json';
import ja from '@/locales/ja.json';

const translations = {
  en,
  ko,
  ja,
};

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value === 'string') {
      // Replace parameters like {{count}}
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }

    return key;
  };

  return { t, language };
}
