import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { SUPPORTED_LANGUAGES } from '@/utils/i18n';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
    // Reload page to apply language change
    window.location.reload();
  };

  const languageNames = {
    en: 'EN',
    ko: '한',
    ja: '日',
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lang-switcher-button"
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--color-text)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s ease',
          minWidth: '80px',
          height: '38px',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-bg-tertiary)';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-bg-secondary)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        <span style={{ fontSize: '16px', lineHeight: '1', flexShrink: 0 }} className="lang-icon">🌐</span>
        <span style={{ lineHeight: '1' }} className="lang-name">{languageNames[language]}</span>
        <span style={{ fontSize: '10px', marginLeft: '2px', lineHeight: '1' }} className="lang-arrow">
          {isOpen ? '▲' : '▼'}
        </span>

        <style jsx>{`
          /* Mobile optimizations */
          @media (max-width: 768px) {
            .lang-switcher-button {
              padding: 7px 12px !important;
              min-width: 70px !important;
              height: 36px !important;
              font-size: 13px !important;
            }
            .lang-icon {
              font-size: 14px !important;
            }
            .lang-name {
              font-size: 13px !important;
            }
          }

          @media (max-width: 480px) {
            .lang-switcher-button {
              padding: 6px 10px !important;
              min-width: 60px !important;
              height: 34px !important;
              gap: 4px !important;
            }
            .lang-icon {
              font-size: 13px !important;
            }
            .lang-name {
              font-size: 12px !important;
            }
            .lang-arrow {
              font-size: 9px !important;
            }
          }
        `}</style>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            minWidth: '150px',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: language === lang ? 'var(--color-bg-tertiary)' : 'transparent',
                color: 'var(--color-text)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: language === lang ? '600' : '400',
                transition: 'background 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-tertiary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = language === lang ? 'var(--color-bg-tertiary)' : 'transparent';
              }}
            >
              {language === lang && <span style={{ color: 'var(--color-primary)' }}>✓</span>}
              <span>{t(`language.${lang}`)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
