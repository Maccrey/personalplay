// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'ko', 'ja'];
export const DEFAULT_LANGUAGE = 'en';

// Detect browser language
export function detectBrowserLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();

  return SUPPORTED_LANGUAGES.includes(langCode) ? langCode : DEFAULT_LANGUAGE;
}

// Get current language from localStorage or browser
export function getCurrentLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const storedLang = localStorage.getItem('language');
  if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
    return storedLang;
  }

  return detectBrowserLanguage();
}

// Set language to localStorage
export function setLanguage(lang) {
  if (typeof window === 'undefined') return;

  if (SUPPORTED_LANGUAGES.includes(lang)) {
    localStorage.setItem('language', lang);
  }
}
