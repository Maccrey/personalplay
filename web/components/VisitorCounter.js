import { useEffect, useState } from 'react';
import { getVisitorStats, recordVisit } from '@/lib/visitor-tracker';
import { useTranslation } from '@/hooks/useTranslation';

export default function VisitorCounter() {
  const [stats, setStats] = useState({ today: 0, total: 0 });
  const { t } = useTranslation();

  useEffect(() => {
    async function initVisitStats() {
      await recordVisit();
      const initialStats = await getVisitorStats();
      setStats(initialStats);

      const interval = setInterval(async () => {
        const updatedStats = await getVisitorStats();
        setStats(updatedStats);
      }, 10000);

      return () => clearInterval(interval);
    }

    initVisitStats();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-md)',
        fontSize: '0.875rem',
        color: 'var(--color-text-tertiary)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
        }}
      >
        <span>📅 {t('visitor.today')}:</span>
        <span
          style={{
            fontWeight: '600',
            color: 'var(--color-primary)',
          }}
        >
          {stats.today.toLocaleString()}
        </span>
      </div>
      <div
        style={{
          borderLeft: '1px solid var(--color-border)',
          paddingLeft: 'var(--spacing-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
        }}
      >
        <span>👥 {t('visitor.total')}:</span>
        <span
          style={{
            fontWeight: '600',
            color: 'var(--color-secondary)',
          }}
        >
          {stats.total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
