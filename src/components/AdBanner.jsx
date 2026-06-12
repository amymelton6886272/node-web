import { useEffect, useRef } from 'react';

/**
 * AdBanner — responsive AdSense ad unit placed ONLY after meaningful
 * publisher content. Never on empty/search/error screens.
 *
 * data-ad-slot: replace with real slot IDs from your AdSense dashboard.
 * Default "0" triggers auto-sizing; Google will fill in when slots exist.
 */
export function AdBanner({ slot = '' }) {
  const ref = useRef(null);
  const id = useRef(`ad-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    try {
      if (ref.current && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch {}
  }, []);

  return (
    <div className="adBanner">
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3968202495808020"
        data-ad-slot={slot || undefined}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
