import { useEffect, useRef } from 'react';

const AD_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-3968202495808020';
const DEFAULT_SLOT = import.meta.env.VITE_ADSENSE_SLOT || '';

/**
 * Responsive AdSense unit. Place it only after meaningful page content,
 * never on empty, search-only, modal, or error-only screens.
 */
export function AdBanner({ slot = DEFAULT_SLOT, label = 'Advertisement' }) {
  const ref = useRef(null);
  const id = useRef(`ad-${Math.random().toString(36).slice(2, 9)}`);
  const canRequestAd = Boolean(slot) && !import.meta.env.DEV;

  useEffect(() => {
    if (!canRequestAd) return;
    try {
      if (ref.current && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch {}
  }, [canRequestAd]);

  if (!canRequestAd) return null;

  return (
    <div className="adBanner" id={id.current} aria-label={label}>
      <span className="adBannerLabel">{label}</span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
