import React, { useEffect, useState } from 'react';

/**
 * StaleBanner periodically fetches the /api/diag endpoint to determine when
 * the last successful update occurred.  If more than two minutes (120
 * seconds) have elapsed since the last update, the banner is displayed
 * notifying the user that the live feed is delayed.
 */
export default function StaleBanner() {
  const [lastUpdateIso, setLastUpdateIso] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDiag() {
      try {
        const res = await fetch('/api/diag', { cache: 'no-store' });
        const data = await res.json();
        if (data && typeof data.lastUpdateIso === 'string') {
          setLastUpdateIso(data.lastUpdateIso);
        }
      } catch (error) {
        console.error('Failed to fetch /api/diag', error);
      }
    }
    // Initial fetch
    fetchDiag();
    // Poll every minute
    const interval = setInterval(fetchDiag, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!lastUpdateIso) return null;
  const ageSeconds = (Date.now() - new Date(lastUpdateIso).getTime()) / 1000;
  if (ageSeconds <= 120) return null;
  const formattedTime = new Date(lastUpdateIso).toLocaleTimeString();
  return (
    <div className="live-feed-banner" style={{ background: '#fff7d1', padding: '8px', textAlign: 'center' }}>
      Live feed delayed—last updated {formattedTime}. We’re on it.
    </div>
  );
}