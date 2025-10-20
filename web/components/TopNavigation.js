/**
 * Top Navigation Component
 * Displays AuthButton and LanguageSwitcher with responsive mobile support
 */

import AuthButton from './AuthButton';
import LanguageSwitcher from './LanguageSwitcher';

export default function TopNavigation() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}
      className="top-navigation"
    >
      <AuthButton />
      <LanguageSwitcher />

      <style jsx>{`
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .top-navigation {
            top: 12px !important;
            right: 12px !important;
            gap: 8px !important;
          }
        }

        @media (max-width: 480px) {
          .top-navigation {
            top: 10px !important;
            right: 10px !important;
            gap: 6px !important;
          }
        }
      `}</style>
    </div>
  );
}
