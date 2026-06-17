import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Hero, Empty, ToolIntro, FeaturedApps } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { toolContent } from '../data/toolContent.js';
import { useLang } from '../LanguageContext.jsx';

const REGIONS = [
  { code: 'us', label: 'United States' },
  { code: 'cn', label: 'China' },
  { code: 'jp', label: 'Japan' },
  { code: 'hk', label: 'Hong Kong' },
  { code: 'tw', label: 'Taiwan' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'kr', label: 'Korea' },
];

function inspectApp(app, t) {
  if (app?.iapState === 'yes') return { label: t.iap.includesIAP, cls: 'badge ok', note: 'yes' };
  if (app?.iapState === 'no') return { label: t.iap.noIAP, cls: 'badge', note: 'no' };
  return { label: t.iap.pending, cls: 'badge warn', note: 'unknown' };
}

function pageStateLabel(pageState, lang) {
  if (pageState === 'items') return lang === 'zh' ? '已抓到明细' : 'Items captured';
  if (pageState === 'page') return lang === 'zh' ? '页面可读' : 'Page readable';
  if (pageState === 'loading') return lang === 'zh' ? '比价加载中' : 'Loading compare';
  if (pageState === 'unavailable') return lang === 'zh' ? '页面暂不可用' : 'Page unavailable';
  return lang === 'zh' ? '待确认' : 'Needs confirmation';
}

function dedupe(values = []) {
  return [...new Set(values.filter(Boolean))];
}

export default function Iap() {
  const [q, setQ] = useState('');
  const [state, setState] = useState({ loading: false, apps: [], error: null, searched: false });

  const { t, lang } = useLang();
  const content = toolContent[lang]?.iap || toolContent.en.iap;
  const defaultCountry = 'us';

  const query = async (keyword) => {
    const term = typeof keyword === 'string' ? keyword.trim() : q.trim();
    if (!term) return;

    setQ(term);
    setState({ loading: true, apps: [], error: null, searched: true });

    try {
      const res = await fetch(`/api/iap?q=${encodeURIComponent(term)}&country=${defaultCountry}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const json = await res.json();
      setState({ loading: false, apps: json.apps || [], error: null, searched: true });
    } catch (error) {
      setState({ loading: false, apps: [], error: String(error), searched: true });
    }
  };

  const loadDetails = async (trackId) => {
    setState((prev) => ({
      ...prev,
      apps: prev.apps.map((app) => (
        app.trackId === trackId ? { ...app, pageState: 'loading' } : app
      )),
    }));

    try {
      const res = await fetch(`/api/iap-detail?trackId=${encodeURIComponent(trackId)}&country=${defaultCountry}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const json = await res.json();
      setState((prev) => ({
        ...prev,
        apps: prev.apps.map((app) => (
          app.trackId === trackId
            ? {
                ...app,
                iapItems: json.iapItems || [],
                priceRange: dedupe([...(app.priceRange || []), ...(json.priceRange || [])]),
                pageState: json.pageState || 'unavailable',
                iapState: app.iapState === 'yes' ? 'yes' : (json.iapState || app.iapState),
              }
            : app
        )),
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        apps: prev.apps.map((app) => (
          app.trackId === trackId ? { ...app, pageState: 'unavailable' } : app
        )),
      }));
    }
  };

  return (
    <>
      <Hero title={t.iap.title} sub={t.iap.sub} />

      <div className="searchbar iapSearchbar">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') query();
          }}
          placeholder={t.iap.placeholder}
        />
        <button onClick={() => query()} disabled={state.loading}>
          {state.loading ? t.iap.querying : t.iap.search}
        </button>
      </div>

      <div className="notice">
        <ShieldAlert size={18} />
        <span>
          {lang === 'zh'
            ? '默认直接展示热门地区的内购比价视角，不需要先单独选择区域。'
            : 'The page now defaults to a popular-region IAP comparison view, so you do not need to choose a region first.'}
        </span>
      </div>

      <section className="iapGuide card">
        <div className="iapGuideIntro">
          <h2>{lang === 'zh' ? '比价页现在看什么' : 'What this compare page shows'}</h2>
          <p>
            {lang === 'zh'
              ? '默认以热门地区结果作为主视角，先确认是否存在订阅或内购，再看公开价格区间和条目明细。'
              : 'The page uses popular-region results as the default view, helping you confirm subscription or IAP signals first, then review public price ranges and item details.'}
          </p>
        </div>
        <div className="iapGuideGrid">
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '少一步操作' : 'One less step'}</b>
            <p>{lang === 'zh' ? '搜索后直接看到热门地区结果，不用先切换国家。' : 'Search results appear directly without asking you to switch store regions first.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '聚焦热门区' : 'Popular regions first'}</b>
            <p>{lang === 'zh' ? '先用常见地区做判断，更符合大多数人的查询习惯。' : 'Popular regions are prioritized because they fit the most common lookup habits.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '明细仍按需补' : 'Details stay on demand'}</b>
            <p>{lang === 'zh' ? '公开页面仍然只在需要时补抓，不拖慢首屏。' : 'Public page details are still fetched only when needed, keeping the first result fast.'}</p>
          </article>
        </div>
      </section>

      <div className="toolRelated">
        <span>{lang === 'zh' ? '热门地区' : 'Popular regions'}</span>
        {REGIONS.map((region) => (
          <a key={region.code} href={`/price?region=${region.code}`}>{region.label}</a>
        ))}
      </div>

      {state.error && <p className="err">{t.iap.queryFailed} {state.error}</p>}
      {state.loading && <p>{t.iap.queryingStore}</p>}

      <div className="iapGrid">
        {state.apps.map((app) => {
          const verdict = inspectApp(app, t);
          const hasItems = app.iapItems?.length > 0;
          const priceRange = dedupe(app.priceRange || []);
          const hasPriceRange = priceRange.length > 0;
          const compareSummary = hasPriceRange
            ? priceRange.slice(0, 3).join(' / ')
            : (lang === 'zh' ? '暂无公开价格区间' : 'No public price range yet');

          return (
            <div className="iapCard" key={app.trackId || app.bundleId}>
              <div className="iapHead">
                <img
                  src={(app.artworkUrl100 || '').replace(/\d+x\d+bb\.(jpg|png|webp)$/, '200x200bb.$1')}
                  alt=""
                />
                <div>
                  <h3>{app.trackName}</h3>
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
                  <b>{app.primaryGenreName || '-'}</b>
                  <span>{lang === 'zh' ? '分类' : 'Category'}</span>
                </div>
                <div>
                  <b>{app.version || '-'}</b>
                  <span>{lang === 'zh' ? '版本' : 'Version'}</span>
                </div>
              </div>

              <div className="iapFlag">
                <span className={verdict.cls}>{verdict.label}</span>
                <span>{lang === 'zh' ? '默认地区' : 'Default store'} {defaultCountry.toUpperCase()}</span>
                <span>{pageStateLabel(app.pageState, lang)}</span>
              </div>

              <div className="iapCompareCard">
                <div className="iapCompareHead">
                  <strong>{lang === 'zh' ? '内购比价摘要' : 'IAP compare summary'}</strong>
                  <span>{compareSummary}</span>
                </div>
                {hasPriceRange && (
                  <div className="iapPriceChips">
                    {priceRange.map((price) => (
                      <span key={price} className="iapPriceChip">{price}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="contentNote">
                {verdict.note === 'yes' &&
                  (lang === 'zh'
                    ? '当前结果已识别到公开内购或订阅信号。'
                    : 'A public IAP or subscription signal has been identified for this result.')}
                {verdict.note === 'no' &&
                  (lang === 'zh'
                    ? '当前没有识别到明确的公开内购信号。'
                    : 'No clear public IAP signal was identified for this result.')}
                {verdict.note === 'unknown' &&
                  (lang === 'zh'
                    ? '公开信息暂时不足，建议继续查看页面或补抓公开条目。'
                    : 'Public information is still inconclusive. Check the page or load public detail.')}
              </div>

              {hasItems && (
                <div className="iapItems">
                  <h4>{lang === 'zh' ? '公开条目明细' : 'Public item details'}</h4>
                  {app.iapItems.map((item, index) => (
                    <div className="iapItem" key={index}>
                      <span>{item.name}</span>
                      <b>{item.price}</b>
                    </div>
                  ))}
                </div>
              )}

              {!hasItems && verdict.note === 'yes' && <p className="iapHint">{t.iap.iapHint}</p>}

              {app.description && <p className="iapDesc">{app.description}</p>}

              <div className="iconActions">
                <a href={app.trackViewUrl} target="_blank" rel="noreferrer">
                  {t.iap.openAppStore}
                </a>
                <button
                  onClick={() => {
                    setQ(app.bundleId || '');
                    if (app.bundleId) query(app.bundleId);
                  }}
                >
                  {t.iap.fillBundle}
                </button>
                <button
                  onClick={() => loadDetails(app.trackId)}
                  disabled={!app.trackId || app.pageState === 'loading'}
                >
                  {app.pageState === 'loading'
                    ? (lang === 'zh' ? '比价加载中' : 'Loading compare')
                    : (lang === 'zh' ? '加载公开比价' : 'Load public compare')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!state.loading && state.searched && state.apps.length === 0 && !state.error && (
        <Empty text={t.iap.noMatch} />
      )}
      {!state.searched && <FeaturedApps onSelect={query} />}
      <ToolIntro page="iap" />
      <ContentSection {...content} />
    </>
  );
}
