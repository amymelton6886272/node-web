import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Hero, Empty, ToolIntro, FeaturedApps } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { toolContent } from '../data/toolContent.js';
import { useLang } from '../LanguageContext.jsx';

function inspectApp(app, t) {
  if (app?.iapState === 'yes') {
    return { label: t.iap.includesIAP, cls: 'badge ok', note: 'yes' };
  }
  if (app?.iapState === 'no') {
    return { label: t.iap.noIAP, cls: 'badge', note: 'no' };
  }
  return { label: t.iap.pending, cls: 'badge warn', note: 'unknown' };
}

function pageStateLabel(pageState, lang) {
  if (pageState === 'items') return lang === 'zh' ? '已抓到明细' : 'Items captured';
  if (pageState === 'page') return lang === 'zh' ? '页面可读' : 'Page readable';
  if (pageState === 'loading') return lang === 'zh' ? '加载明细中' : 'Loading details';
  if (pageState === 'unavailable') return lang === 'zh' ? '页面暂不可用' : 'Page unavailable';
  return lang === 'zh' ? '待确认' : 'Needs confirmation';
}

export default function Iap() {
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('cn');
  const [state, setState] = useState({ loading: false, apps: [], error: null, searched: false });

  const { t, lang } = useLang();
  const content = toolContent[lang]?.iap || toolContent.en.iap;

  const query = async (keyword) => {
    const term = typeof keyword === 'string' ? keyword.trim() : q.trim();
    if (!term) return;

    setQ(term);
    setState({ loading: true, apps: [], error: null, searched: true });

    try {
      const res = await fetch(`/api/iap?q=${encodeURIComponent(term)}&country=${country}`);
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
      const res = await fetch(`/api/iap-detail?trackId=${encodeURIComponent(trackId)}&country=${country}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const json = await res.json();
      setState((prev) => ({
        ...prev,
        apps: prev.apps.map((app) => (
          app.trackId === trackId
            ? {
                ...app,
                iapItems: json.iapItems || [],
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
        <span>
          {lang === 'zh'
            ? '现在先返回快速主结果，公开内购明细改为按需加载。'
            : 'The page now returns the fast main result first, and public IAP details load on demand.'}
        </span>
      </div>

      <section className="iapGuide card">
        <div className="iapGuideIntro">
          <h2>{lang === 'zh' ? '这页现在怎么工作' : 'How this page works now'}</h2>
          <p>
            {lang === 'zh'
              ? '主结果优先使用 Apple 元数据快速返回，只有在你需要时才去补抓公开页面明细。'
              : 'The main result now comes back quickly from Apple metadata, and public page details are fetched only when needed.'}
          </p>
        </div>
        <div className="iapGuideGrid">
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '首个结果更快' : 'Faster first result'}</b>
            <p>{lang === 'zh' ? '不再为每条结果默认等待页面抓取。' : 'The page no longer waits on detail fetching for every result.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '明细按需请求' : 'Details on demand'}</b>
            <p>{lang === 'zh' ? '只有点开某个应用时才请求公开页面。' : 'The public page is requested only when a specific app needs detail loading.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '失败不拖慢主流程' : 'Failure does not block'}</b>
            <p>{lang === 'zh' ? '即使明细抓取失败，主判断和跳转仍然可用。' : 'Even if detail fetching fails, the main verdict and App Store link remain usable.'}</p>
          </article>
        </div>
      </section>

      {state.error && <p className="err">{t.iap.queryFailed} {state.error}</p>}
      {state.loading && <p>{t.iap.queryingStore}</p>}

      <div className="iapGrid">
        {state.apps.map((app) => {
          const verdict = inspectApp(app, t);
          const hasItems = app.iapItems?.length > 0;

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
                <span>{lang === 'zh' ? '地区' : 'Store'} {country.toUpperCase()}</span>
                <span>{pageStateLabel(app.pageState, lang)}</span>
              </div>

              <div className="contentNote">
                {verdict.note === 'yes' &&
                  (lang === 'zh'
                    ? '当前结果已识别到内购信号。'
                    : 'An IAP signal has been identified for this result.')}
                {verdict.note === 'no' &&
                  (lang === 'zh'
                    ? '当前没有识别到明确的公开内购信号。'
                    : 'No clear public IAP signal was identified for this result.')}
                {verdict.note === 'unknown' &&
                  (lang === 'zh'
                    ? '公开信息暂时不足，建议打开 App Store 页面继续确认。'
                    : 'Public information is not conclusive yet. Open the App Store page to confirm.')}
              </div>

              {hasItems && (
                <div className="iapItems">
                  <h4>{t.iap.iapItems}</h4>
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
                    ? (lang === 'zh' ? '加载中' : 'Loading')
                    : (lang === 'zh' ? '查看公开明细' : 'Load public details')}
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
