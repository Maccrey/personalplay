import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { getUserResults, deleteUserResult } from '@/lib/user-results';
import { getAllTests } from '@/lib/tests-data';
import AuthButton from '@/components/AuthButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import KakaoAd from '@/components/KakaoAd';

import useMobileDetect from '@/hooks/useMobileDetect';

export default function MyResultsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t, language } = useTranslation();
  const [results, setResults] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const isMobile = useMobileDetect();

  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      try {
        if (user) {
          const userResults = await getUserResults(user.uid);
          setResults(userResults);
        }
        const tests = await getAllTests(language);
        setAllTests(tests);
      } catch (error) {
        console.error('Error loading page data:', error);
      } finally {
        setLoadingData(false);
      }
    }

    if (!loading) {
      loadData();
    }
  }, [user, loading, language]);

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

  if (loading || loadingData) {
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

  const adUnitId = isMobile ? "DAN-6oOCRNxDTOh53uVz" : "DAN-jxGC1Y8xxofhQlxD";
  const adWidth = isMobile ? 320 : 728;
  const adHeight = isMobile ? 100 : 90;

  const combinedTests = allTests.map(test => {
    const result = results.find(r => r.testId === test.id);
    return { ...test, result };
  });

  return (
    <>
      <header className="page-header" style={{
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-md) 0'
      }}>
        <div className="container header-inner" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--spacing-sm)'
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
          <div className="header-actions" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            <AuthButton />
            <LanguageSwitcher />
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .page-header .header-inner {
              flex-direction: column;
              align-items: center;
            }
            .page-header .header-actions {
              justify-content: center;
              order: -1;
              width: 100%;
            }
            .page-header .header-inner :global(a) {
              text-align: center;
            }
          }
        `}</style>
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

        {combinedTests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
            <p style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
              {t('myResults.noTests')}
            </p>
            <Link
              href="/"
              className="btn btn-primary"
              style={{ textDecoration: 'none', padding: 'var(--spacing-md) var(--spacing-xl)' }}
            >
              {t('myResults.goHome')}
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
            {combinedTests.map(({ id, title, result }) => {
              const isCompleted = !!result;
              return (
                <div
                  key={id}
                  style={{
                    background: isCompleted ? '#f8f9fa' : 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: 'var(--spacing-lg)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s',
                    opacity: isCompleted ? 0.7 : 1,
                  }}
                >
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-primary)'
                  }}>
                    {title}
                  </h3>
                  
                  {isCompleted ? (
                    <>
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
                        {t('myResults.testTaken')}: {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
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
                        >
                          {t('myResults.delete')}
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={`/test/${id}`}
                      className="btn btn-primary"
                      style={{
                        display: 'block',
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
                    >
                      {t('myResults.takeTest')}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <KakaoAd key={router.asPath} unitId={adUnitId} width={adWidth} height={adHeight} />
      </div>
    </>
  );
}
