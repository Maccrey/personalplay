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
      await signIn();
    } catch (error) {
      alert(t('auth.signInError') || 'Sign in failed. Please try again.');
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
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          cursor: isSigningIn ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          opacity: isSigningIn ? 0.6 : 1
        }}
        onMouseOver={(e) => {
          if (!isSigningIn) {
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
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
        {isSigningIn ? (t('auth.signingIn') || 'Signing in...') : (t('auth.signIn') || 'Sign in with Google')}
      </button>
    );
  }

  // Logged in - show user menu
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '24px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }}
      >
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%'
            }}
          />
        )}
        <span>{user.displayName || user.email}</span>
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
