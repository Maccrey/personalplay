import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentLanguage, setLanguage as saveLanguage, DEFAULT_LANGUAGE } from '@/utils/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const currentLang = getCurrentLanguage();
    setLanguageState(currentLang);
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    saveLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
