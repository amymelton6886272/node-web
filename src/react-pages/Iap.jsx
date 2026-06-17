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
            ? '内购结果现在优先来自服务端查询，页面抓取只用于补充公开明细。'
            : 'IAP results now come from a server-side lookup first, with page fetching used only for public detail enrichment.'}
        </span>
      </div>

      <section className="iapGuide card">
        <div className="iapGuideIntro">
          <h2>{lang === 'zh' ? '这页现在怎么工作' : 'How this page works now'}</h2>
          <p>
            {lang === 'zh'
              ? '它会先调用站点自己的轻量接口，再由服务端去请求 Apple 公开数据。这样前端更稳，也更容易做缓存。'
              : 'It calls a lightweight site API first, then the server requests public Apple data. That makes the frontend steadier and easier to cache.'}
          </p>
        </div>
        <div className="iapGuideGrid">
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '资源更可控' : 'More controlled usage'}</b>
            <p>{lang === 'zh' ? '单次只处理少量结果，并带短缓存。' : 'Each query handles only a small result set with short caching.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '结果更稳定' : 'More stable results'}</b>
            <p>{lang === 'zh' ? '浏览器不再直接依赖公共代理。' : 'The browser no longer depends directly on a public proxy.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '明细仍是补充' : 'Details are still optional'}</b>
            <p>{lang === 'zh' ? '若公开页面不可读，主判断仍会保留。' : 'If the public page is unavailable, the main verdict still remains.'}</p>
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
                <span>
                  {app.pageState === 'items'
                    ? lang === 'zh'
                      ? '已抓到明细'
                      : 'Items captured'
                    : app.pageState === 'page'
                      ? lang === 'zh'
                        ? '页面可读'
                        : 'Page readable'
                      : app.pageState === 'unavailable'
                        ? lang === 'zh'
                          ? '页面暂不可用'
                          : 'Page unavailable'
                        : lang === 'zh'
                          ? '待确认'
                          : 'Needs confirmation'}
                </span>
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
