/**
 * Authentication Button Component
 * Shows login/logout button with user info
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';

export default function AuthButton() {
  const { user, loading, signIn, signOut } = useAuth();
  const { t } = useTranslation();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      console.log('Sign in button clicked');
      await signIn();
      console.log('Sign in completed');
    } catch (error) {
      console.error('Sign in error in AuthButton:', error);
      let errorMessage = t('auth.signInError') || 'Sign in failed. Please try again.';

      // Provide specific error messages
      if (error.code === 'auth/popup-blocked') {
        errorMessage = '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'Firebase Console에서 도메인을 인증해주세요: maccrey.github.io';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Firebase Console에서 Google 로그인을 활성화해주세요.';
      } else if (error.message) {
        errorMessage += '\n\n' + error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowMenu(false);
    } catch (error) {
      alert(t('auth.signOutError') || 'Sign out failed. Please try again.');
    }
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (!user) {
    // Not logged in - show sign in button
    return (
      <button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="auth-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: isSigningIn ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--color-text)',
          transition: 'all 0.2s ease',
          minWidth: '80px',
          height: '38px',
          whiteSpace: 'nowrap',
          opacity: isSigningIn ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!isSigningIn) {
            e.currentTarget.style.background = 'var(--color-bg-tertiary)';
            e.currentTarget.style.borderColor = 'var(--color-primary)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-bg-secondary)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink: 0 }} className="auth-icon">
          <path
            fill="#4285F4"
            d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
          />
          <path
            fill="#34A853"
            d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
          />
          <path
            fill="#FBBC05"
            d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"
          />
          <path
            fill="#EA4335"
            d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
          />
        </svg>
        <span style={{ fontSize: '14px', lineHeight: '1' }} className="auth-text">
          {isSigningIn ? (t('auth.signingIn') || '로그인 중...') : (t('auth.signIn') || '로그인')}
        </span>

        <style jsx>{`
          /* Mobile optimizations */
          @media (max-width: 768px) {
            .auth-button {
              padding: 7px 12px !important;
              min-width: 70px !important;
              height: 36px !important;
              font-size: 13px !important;
            }
            .auth-text {
              font-size: 13px !important;
            }
          }

          @media (max-width: 480px) {
            .auth-button {
              padding: 6px 10px !important;
              min-width: 60px !important;
              height: 34px !important;
              gap: 4px !important;
            }
            .auth-icon {
              width: 14px !important;
              height: 14px !important;
            }
            .auth-text {
              font-size: 12px !important;
            }
          }
        `}</style>
      </button>
    );
  }

  // Logged in - show user menu
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="auth-user-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--color-text)',
          transition: 'all 0.2s ease',
          minWidth: '80px',
          height: '38px',
          whiteSpace: 'nowrap'
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
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="user-avatar"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%'
            }}
          />
        )}
        <span className="user-name">{user.displayName || user.email}</span>

        <style jsx>{`
          /* Mobile optimizations */
          @media (max-width: 768px) {
            .auth-user-button {
              padding: 7px 10px !important;
              min-width: 70px !important;
              height: 36px !important;
              font-size: 13px !important;
            }
            .user-name {
              font-size: 13px !important;
            }
            .user-avatar {
              width: 22px !important;
              height: 22px !important;
            }
          }

          @media (max-width: 480px) {
            .auth-user-button {
              padding: 6px 8px !important;
              min-width: 60px !important;
              height: 34px !important;
              gap: 6px !important;
            }
            .user-name {
              font-size: 12px !important;
              max-width: 80px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .user-avatar {
              width: 20px !important;
              height: 20px !important;
            }
          }
        `}</style>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowMenu(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99
            }}
          />

          {/* Menu */}
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '200px',
              zIndex: 100,
              overflow: 'hidden'
            }}
          >
            <Link
              href="/my-results"
              style={{
                display: 'block',
                padding: '12px 16px',
                color: '#333',
                textDecoration: 'none',
                fontSize: '14px',
                borderBottom: '1px solid #eee',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
              }}
              onClick={() => setShowMenu(false)}
            >
              {t('auth.myResults') || 'My Results'}
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: '#d32f2f',
                textAlign: 'left',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fff5f5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              {t('auth.signOut') || 'Sign Out'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
