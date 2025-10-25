import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getUserResults, deleteUserResult } from '@/lib/user-results';
import AuthButton from '@/components/AuthButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function MyResultsPage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    if (user) {
      loadResults();
    } else if (!loading) {
      setLoadingResults(false);
    }
  }, [user, loading]);

  const loadResults = async () => {
    try {
      const userResults = await getUserResults(user.uid);
      setResults(userResults);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleDelete = async (resultId) => {
    if (!confirm(t('myResults.confirmDelete'))) {
      return;
    }

    try {
      await deleteUserResult(resultId);
      setResults(results.filter(r => r.id !== resultId));
    } catch (error) {
      console.error('Error deleting result:', error);
      alert('Failed to delete result');
    }
  };

  if (loading || loadingResults) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
        <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>
          {t('myResults.title')}
        </h1>
        <p style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
          {t('auth.loginToSave')}
        </p>
        <AuthButton />
      </div>
    );
  }

  return (
    <>
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
      >
        <AuthButton />
        <LanguageSwitcher />
      </div>

      <header style={{
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-md) 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none'
          }}>
            PersonaPlay
          </Link>
        </div>
      </header>

      <div className="container" style={{ padding: 'var(--spacing-2xl)' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          marginBottom: 'var(--spacing-md)',
          textAlign: 'center'
        }}>
          {t('myResults.title')}
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          {t('myResults.description')}
        </p>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
            <p style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
              {t('myResults.noResults')}
            </p>
            <Link
              href="/"
              className="btn btn-primary"
              style={{ textDecoration: 'none', padding: 'var(--spacing-md) var(--spacing-xl)' }}
            >
              {t('myResults.takeTests')}
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--spacing-lg)',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {results.map((result) => (
              <div
                key={result.id}
                style={{
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: 'var(--spacing-lg)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: 'var(--spacing-sm)',
                  color: 'var(--color-primary)'
                }}>
                  {result.testTitle}
                </h3>
                
                <p style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-text-secondary)'
                }}>
                  {t('myResults.result')}: {result.resultTitle}
                </p>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#999',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  {t('myResults.testTaken')}: {result.createdAt?.toLocaleDateString()}
                </p>

                <div style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)'
                }}>
                  <Link
                    href={`/result/${result.testId}?r=${result.resultKey}`}
                    style={{
                      flex: 1,
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      background: 'var(--color-primary)',
                      color: 'white',
                      textDecoration: 'none',
                      textAlign: 'center',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#7c3aed';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'var(--color-primary)';
                    }}
                  >
                    {t('myResults.viewResult')}
                  </Link>

                  <button
                    onClick={() => handleDelete(result.id)}
                    style={{
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      background: '#fee',
                      color: '#d32f2f',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#fdd';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#fee';
                    }}
                  >
                    {t('myResults.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
