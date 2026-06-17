import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Hero, Empty, ToolIntro, FeaturedApps } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { toolContent } from '../data/toolContent.js';
import { useLang } from '../LanguageContext.jsx';

const IAP_MARKERS = [
  /offers?\s+in-app purchases?/i,
  /in-app purchases?/i,
  /app\s*内购买/i,
  /app\s*内购/i,
  /内购/i,
];

const APP_PAGE_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

function hasIapMarker(text = '') {
  return IAP_MARKERS.some((pattern) => pattern.test(text));
}

function deriveIapSignal(app) {
  const text = [
    app?.formattedPrice,
    app?.description,
    app?.trackViewUrl,
    ...(app?.advisories || []),
  ]
    .filter(Boolean)
    .join(' ');

  const hasSignal = app?.offersIAP === true || hasIapMarker(text);

  return {
    hasSignal,
    source: app?.offersIAP === true ? 'metadata' : hasSignal ? 'text' : 'none',
  };
}

async function fetchAppPage(appUrl) {
  let lastError = null;
  for (const buildProxyUrl of APP_PAGE_PROXIES) {
    try {
      const res = await fetch(buildProxyUrl(appUrl));
      if (!res.ok) throw new Error(`page ${res.status}`);
      const html = await res.text();
      if (html) return html;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('proxy unavailable');
}

function extractIapItems(html) {
  try {
    const match = html.match(/<script type=\"application\/json\" id=\"serialized-server-data\">([\s\S]*?)<\/script>/);
    if (!match) return [];

    const data = JSON.parse(match[1]);
    const info = data?.data?.[0]?.data?.shelfMapping?.information?.items || [];
    const row = info.find((item) => hasIapMarker(item?.title || ''));
    const pairs = (row?.items_V3 || []).filter((item) => item?.$kind === 'textPair' && item.leadingText && item.trailingText);
    if (pairs.length) return pairs.map((item) => ({ name: item.leadingText, price: item.trailingText }));

    const oldPairs = row?.items?.flatMap((item) => item?.textPairs || []) || [];
    return oldPairs.filter((item) => item?.[0] && item?.[1]).map(([name, price]) => ({ name, price }));
  } catch {
    return [];
  }
}

function signalMeta(status, app, t) {
  if (status === 'yes') return { label: t.iap.includesIAP, cls: 'badge ok', detail: 'page' };
  if (status === 'no') return { label: t.iap.noIAP, cls: 'badge', detail: 'page' };
  if (status === 'checking') return { label: t.iap.checking, cls: 'badge warn', detail: 'checking' };

  const derived = deriveIapSignal(app);
  if (derived.hasSignal) {
    return { label: t.iap.includesIAP, cls: 'badge ok', detail: derived.source };
  }

  return { label: t.iap.pending, cls: 'badge warn', detail: 'unknown' };
}

export default function Iap() {
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('cn');
  const [state, setState] = useState({ loading: false, apps: [], error: null, searched: false });
  const [iapStatus, setIapStatus] = useState({});
  const [iapItems, setIapItems] = useState({});

  const parseInput = (value) => {
    const text = value.trim();
    const idMatch = text.match(/id(\d{5,})/) || text.match(/^\d{5,}$/);
    if (idMatch) return { mode: 'lookup', query: idMatch[1] || idMatch[0] };
    if (/^([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/.test(text)) return { mode: 'bundle', query: text };
    return { mode: 'search', query: text };
  };

  const { t, lang } = useLang();
  const content = toolContent[lang]?.iap || toolContent.en.iap;

  const checkIapFromPage = async (apps) => {
    const targets = apps.slice(0, 8).filter((app) => app.trackId);
    if (!targets.length) return;

    setIapItems({});
    setIapStatus(Object.fromEntries(targets.map((app) => [app.trackId, 'checking'])));

    await Promise.all(
      targets.map(async (app) => {
        try {
          const store = (country || 'cn').toLowerCase();
          const appUrl = `https://apps.apple.com/${store}/app/id${app.trackId}`;
          const html = await fetchAppPage(appUrl);
          const items = extractIapItems(html);
          const has = items.length > 0 || hasIapMarker(html);

          if (items.length) {
            setIapItems((prev) => ({ ...prev, [app.trackId]: items.slice(0, 8) }));
          }

          setIapStatus((prev) => ({ ...prev, [app.trackId]: has ? 'yes' : 'no' }));
        } catch {
          setIapStatus((prev) => ({ ...prev, [app.trackId]: 'pending' }));
        }
      }),
    );
  };

  const query = async (keyword) => {
    const term = typeof keyword === 'string' ? keyword.trim() : q.trim();
    if (!term) return;

    setQ(term);
    setState({ loading: true, apps: [], error: null, searched: true });

    try {
      const parsed = parseInput(term);
      const url = parsed.mode === 'lookup'
        ? `https://itunes.apple.com/lookup?id=${encodeURIComponent(parsed.query)}&country=${country}`
        : parsed.mode === 'bundle'
          ? `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(parsed.query)}&country=${country}`
          : `https://itunes.apple.com/search?term=${encodeURIComponent(parsed.query)}&country=${country}&entity=software&limit=12`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const json = await res.json();
      const apps = (json.results || []).filter((app) => app.kind !== 'mac-software');

      setState({ loading: false, apps, error: null, searched: true });
      checkIapFromPage(apps);
    } catch (error) {
      setState({ loading: false, apps: [], error: String(error), searched: true });
    }
  };

  return (
    <>
      <Hero title={t.iap.title} sub={t.iap.sub} />
      <div className="searchbar iapSearchbar">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') query(); }}
          placeholder={t.iap.placeholder}
        />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="us">United States</option>
          <option value="cn">China</option>
          <option value="jp">Japan</option>
          <option value="hk">Hong Kong</option>
          <option value="tw">Taiwan</option>
          <option value="gb">United Kingdom</option>
          <option value="kr">Korea</option>
        </select>
        <button onClick={() => query()} disabled={state.loading}>
          {state.loading ? t.iap.querying : t.iap.search}
        </button>
      </div>

      <div className="notice">
        <ShieldAlert size={18} />
        <span>{t.iap.note}</span>
      </div>

      <section className="iapGuide card">
        <div className="iapGuideIntro">
          <h2>{lang === 'zh' ? '这页现在能帮你确认什么' : 'What this page can confirm'}</h2>
          <p>
            {lang === 'zh'
              ? '它更适合用来识别应用是否存在公开的内购信号，而不是保证列出完整内购清单。真正的购买条款仍应以 App Store 页面和结算流程为准。'
              : 'This page is best for identifying whether an app shows public IAP signals, not for guaranteeing a complete purchase catalog. Final terms still belong to the App Store page and checkout flow.'}
          </p>
        </div>
        <div className="iapGuideGrid">
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '已识别到内购' : 'IAP detected'}</b>
            <p>{lang === 'zh' ? '页面或元数据里已经出现明确内购信号。' : 'A public page or metadata signal clearly suggests in-app purchases.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '只拿到部分明细' : 'Partial detail only'}</b>
            <p>{lang === 'zh' ? '有时只能抓到公开列出的少量项目，不代表完整目录。' : 'Sometimes only a small public subset is readable, not the full catalog.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '建议回到官方页' : 'Confirm on the App Store'}</b>
            <p>{lang === 'zh' ? '试用、续费、家庭共享和地区差异都应该去官方页面确认。' : 'Trials, renewals, family sharing, and region differences should be confirmed on the official page.'}</p>
          </article>
        </div>
      </section>

      {state.error && <p className="err">{t.iap.queryFailed} {state.error}</p>}
      {state.loading && <p>{t.iap.queryingStore}</p>}

      <div className="iapGrid">
        {state.apps.map((app) => {
          const signal = signalMeta(iapStatus[app.trackId], app, t);
          const hasItems = iapItems[app.trackId]?.length > 0;
          const derived = deriveIapSignal(app);

          return (
            <div className="iapCard" key={app.trackId || app.bundleId}>
              <div className="iapHead">
                <img src={(app.artworkUrl100 || app.artworkUrl512 || '').replace(/\d+x\d+bb\.(jpg|png|webp)$/, '200x200bb.$1')} alt="" />
                <div>
                  <h3>{app.trackName || app.name}</h3>
                  <p>{app.artistName}</p>
                  <small>{app.bundleId || 'Bundle ID unavailable'}</small>
                </div>
              </div>

              <div className="iapStats">
                <div>
                  <b>{app.formattedPrice || 'Unknown'}</b>
                  <span>{t.iap.appPrice}</span>
                </div>
                <div>
                  <b className={app.features?.includes('iosUniversal') ? 'okText' : ''}>
                    {app.features?.includes('iosUniversal') ? t.iap.universal : '-'}
                  </b>
                  <span>{t.iap.universal}</span>
                </div>
                <div>
                  <b className={app.trackContentRating ? 'okText' : ''}>{app.trackContentRating || '-'}</b>
                  <span>{t.iap.ageRating}</span>
                </div>
              </div>

              <div className="iapFlag">
                <span className={signal.cls}>{signal.label}</span>
                <span>{app.primaryGenreName || 'App Store'}</span>
                <span>{app.version ? `Version ${app.version}` : ''}</span>
              </div>

              <div className="iapMetaRow">
                <span className="iapMetaPill">{lang === 'zh' ? '地区' : 'Store'}: {country.toUpperCase()}</span>
                <span className="iapMetaPill">
                  {lang === 'zh' ? '信号来源' : 'Signal source'}:{' '}
                  {signal.detail === 'page' ? (lang === 'zh' ? '公开页面' : 'Public page')
                    : signal.detail === 'metadata' ? (lang === 'zh' ? '应用元数据' : 'App metadata')
                      : signal.detail === 'text' ? (lang === 'zh' ? '描述文本' : 'Description text')
                        : signal.detail === 'checking' ? (lang === 'zh' ? '检查中' : 'Checking')
                          : (lang === 'zh' ? '待确认' : 'Needs confirmation')}
                </span>
              </div>

              <div className="contentNote">
                {signal.detail === 'page' && (lang === 'zh'
                  ? '已从公开 App Store 页面识别到内购信号。'
                  : 'Detected from the public App Store page.')}
                {signal.detail === 'metadata' && (lang === 'zh'
                  ? '已从应用元数据识别到内购信号，建议再到 App Store 页面确认明细。'
                  : 'Detected from app metadata. Confirm item details on the App Store page.')}
                {signal.detail === 'text' && (lang === 'zh'
                  ? '已从公开描述文本识别到内购提示，明细可能不会公开列出。'
                  : 'Detected from public description text. Item details may not be publicly listed.')}
                {signal.detail === 'checking' && (lang === 'zh'
                  ? '正在检查公开页面信号。'
                  : 'Checking public page signals.')}
                {signal.detail === 'unknown' && (lang === 'zh'
                  ? '当前未抓取到可公开展示的内购信号，建议打开 App Store 页面继续确认。'
                  : 'No publicly readable IAP signal was captured for this result. Open the App Store page to confirm.')}
              </div>

              {hasItems && (
                <div className="iapItems">
                  <h4>{t.iap.iapItems}</h4>
                  {iapItems[app.trackId].map((item, index) => (
                    <div className="iapItem" key={index}>
                      <span>{item.name}</span>
                      <b>{item.price}</b>
                    </div>
                  ))}
                </div>
              )}

              {!hasItems && (signal.detail === 'page' || signal.detail === 'metadata' || signal.detail === 'text' || derived.hasSignal) && (
                <p className="iapHint">{t.iap.iapHint}</p>
              )}

              {app.description && <p className="iapDesc">{app.description}</p>}

              <div className="iconActions">
                <a href={app.trackViewUrl} target="_blank" rel="noreferrer">{t.iap.openAppStore}</a>
                <button onClick={() => {
                  setQ(app.bundleId || '');
                  if (app.bundleId) query(app.bundleId);
                }}>{t.iap.fillBundle}</button>
              </div>
            </div>
          );
        })}
      </div>

      {!state.loading && state.searched && state.apps.length === 0 && !state.error && <Empty text={t.iap.noMatch} />}
      {!state.searched && <FeaturedApps onSelect={query} />}
      <ToolIntro page="iap" />
      <ContentSection {...content} />
    </>
  );
}
