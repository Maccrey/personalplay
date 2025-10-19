/**
 * Save Result Button Component
 * Automatically saves result for logged-in users
 * Shows login prompt for non-logged-in users
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { saveUserResult } from '@/lib/user-results';

export default function SaveResultButton({ testId, resultKey, testTitle, resultTitle }) {
  const { user, signIn } = useAuth();
  const { t, locale } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Auto-save when user is logged in
  useEffect(() => {
    if (user && testId && resultKey && !saved) {
      handleSave();
    }
  }, [user, testId, resultKey]);

  const handleSave = async () => {
    if (saving || saved) return;

    setSaving(true);
    try {
      await saveUserResult(user.uid, {
        testId,
        resultKey,
        testTitle,
        resultTitle,
        locale
      });

      setSaved(true);

      // Show success message briefly
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving result:', error);
      alert(t('auth.saveError') || 'Failed to save result');
    } finally {
      setSaving(false);
    }
  };

  const handleSignInToSave = async () => {
    try {
      await signIn();
      // After sign in, the useEffect will auto-save
    } catch (error) {
      // Error is already handled in signIn
    }
  };

  if (!user) {
    // Not logged in - show login prompt
    return (
      <div
        style={{
          background: 'rgba(102, 126, 234, 0.05)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '12px',
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          marginTop: 'var(--spacing-xl)'
        }}
      >
        <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
          {t('auth.loginToSave')}
        </p>
        <button
          onClick={handleSignInToSave}
          style={{
            padding: '10px 20px',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {t('auth.signIn')}
        </button>
      </div>
    );
  }

  if (saved) {
    // Show success message
    return (
      <div
        style={{
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '12px',
          padding: 'var(--spacing-md)',
          textAlign: 'center',
          marginTop: 'var(--spacing-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <span style={{ color: '#4CAF50', fontSize: '20px' }}>✓</span>
        <span style={{ color: '#4CAF50', fontWeight: '600' }}>
          {t('auth.resultSaved')}
        </span>
      </div>
    );
  }

  // Logged in and saving/saved
  return null; // Auto-save happens silently
}
