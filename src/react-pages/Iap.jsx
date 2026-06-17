import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Hero, Empty, ToolIntro, FeaturedApps } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { toolContent } from '../data/toolContent.js';
import { useLang } from '../LanguageContext.jsx';

const REGIONS = [
  { code: 'us', label: 'US' },
  { code: 'cn', label: 'CN' },
  { code: 'jp', label: 'JP' },
  { code: 'hk', label: 'HK' },
  { code: 'tw', label: 'TW' },
  { code: 'gb', label: 'GB' },
  { code: 'kr', label: 'KR' },
];

const DEFAULT_COUNTRY = 'us';

function dedupe(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function buildInitialCompare() {
  return REGIONS.reduce((acc, region) => {
    acc[region.code] = {
      region: region.code,
      status: region.code === DEFAULT_COUNTRY ? 'ready' : 'idle',
      iapState: 'unknown',
      pageState: 'idle',
      priceRange: [],
      iapItems: [],
      trackViewUrl: '',
      formattedPrice: '',
    };
    return acc;
  }, {});
}

function inspectApp(app, t) {
  if (app?.iapState === 'yes') return { label: t.iap.includesIAP, cls: 'badge ok', note: 'yes' };
  if (app?.iapState === 'no') return { label: t.iap.noIAP, cls: 'badge', note: 'no' };
  return { label: t.iap.pending, cls: 'badge warn', note: 'unknown' };
}

function pageStateLabel(pageState, lang) {
  if (pageState === 'items') return lang === 'zh' ? '已抓到条目' : 'Items captured';
  if (pageState === 'page') return lang === 'zh' ? '页面可读' : 'Page readable';
  if (pageState === 'loading') return lang === 'zh' ? '加载中' : 'Loading';
  if (pageState === 'unavailable') return lang === 'zh' ? '页面不可用' : 'Unavailable';
  return lang === 'zh' ? '待确认' : 'Pending';
}

function regionLabel(code) {
  return REGIONS.find((item) => item.code === code)?.label || code.toUpperCase();
}

function summaryLabel(entry, lang) {
  if (entry.status === 'loading') return lang === 'zh' ? '正在比价' : 'Comparing';
  if (entry.status === 'error') return lang === 'zh' ? '比价失败' : 'Compare failed';
  if (entry.status === 'idle') return lang === 'zh' ? '待比价' : 'Waiting';
  if (entry.iapItems?.length) return lang === 'zh' ? `${entry.iapItems.length} 项公开条目` : `${entry.iapItems.length} public items`;
  if (entry.priceRange?.length) return entry.priceRange[0];
  if (entry.iapState === 'yes') return lang === 'zh' ? '检测到内购信号' : 'IAP signal found';
  return lang === 'zh' ? '暂无公开价格' : 'No public price';
}

function bestRegion(compareMap = {}) {
  let winner = null;
  for (const region of REGIONS) {
    const entry = compareMap[region.code];
    if (!entry) continue;
    if (entry.iapItems?.length) return region.code;
    if (!winner && entry.priceRange?.length) winner = region.code;
  }
  return winner;
}

function updateApp(app, country, patch) {
  const nextCompare = {
    ...(app.compare || {}),
    [country]: {
      ...(app.compare?.[country] || {}),
      ...patch,
      region: country,
    },
  };

  let mergedState = app.iapState;
  let mergedPageState = app.pageState;
  let mergedTrackViewUrl = app.trackViewUrl;
  let mergedPriceRange = dedupe(app.priceRange || []);

  for (const region of REGIONS) {
    const entry = nextCompare[region.code];
    if (!entry) continue;
    if (entry.iapState === 'yes') mergedState = 'yes';
    if (entry.pageState === 'items') mergedPageState = 'items';
    else if (mergedPageState !== 'items' && entry.pageState === 'page') mergedPageState = 'page';
    if (!mergedTrackViewUrl && entry.trackViewUrl) mergedTrackViewUrl = entry.trackViewUrl;
    mergedPriceRange = dedupe([...mergedPriceRange, ...(entry.priceRange || [])]);
  }

  return {
    ...app,
    compare: nextCompare,
    iapState: mergedState,
    pageState: mergedPageState,
    trackViewUrl: mergedTrackViewUrl,
    priceRange: mergedPriceRange,
  };
}

export default function Iap() {
  const [q, setQ] = useState('');
  const [state, setState] = useState({ loading: false, apps: [], error: null, searched: false });

  const { t, lang } = useLang();
  const content = toolContent[lang]?.iap || toolContent.en.iap;

  const compareRegions = async (trackId) => {
    if (!trackId) return;

    setState((prev) => ({
      ...prev,
      apps: prev.apps.map((app) => (
        app.trackId === trackId
          ? {
              ...app,
              compareLoading: true,
              compare: REGIONS.reduce((acc, region) => {
                const current = app.compare?.[region.code] || {};
                acc[region.code] = {
                  ...current,
                  region: region.code,
                  status: region.code === DEFAULT_COUNTRY && current.status === 'ready' ? 'ready' : 'loading',
                };
                return acc;
              }, {}),
            }
          : app
      )),
    }));

    await Promise.all(REGIONS.map(async (region) => {
      try {
        const res = await fetch(`/api/iap-detail?trackId=${encodeURIComponent(trackId)}&country=${region.code}`);
        if (!res.ok) throw new Error(`${res.status}`);
        const json = await res.json();

        setState((prev) => ({
          ...prev,
          apps: prev.apps.map((app) => (
            app.trackId === trackId
              ? updateApp(app, region.code, {
                  status: 'ready',
                  pageState: json.pageState || 'unavailable',
                  iapState: json.iapState || 'unknown',
                  priceRange: dedupe(json.priceRange || []),
                  iapItems: json.iapItems || [],
                  trackViewUrl: json.trackViewUrl || '',
                  formattedPrice: json.formattedPrice || '',
                })
              : app
          )).map((app) => (
            app.trackId === trackId
              ? { ...app, compareLoading: Object.values(app.compare || {}).some((entry) => entry.status === 'loading') }
              : app
          )),
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          apps: prev.apps.map((app) => (
            app.trackId === trackId
              ? updateApp(app, region.code, {
                  status: 'error',
                  pageState: 'unavailable',
                  iapState: app.compare?.[region.code]?.iapState || 'unknown',
                  priceRange: app.compare?.[region.code]?.priceRange || [],
                  iapItems: app.compare?.[region.code]?.iapItems || [],
                  trackViewUrl: app.compare?.[region.code]?.trackViewUrl || '',
                  formattedPrice: app.compare?.[region.code]?.formattedPrice || '',
                })
              : app
          )).map((app) => (
            app.trackId === trackId
              ? { ...app, compareLoading: Object.values(app.compare || {}).some((entry) => entry.status === 'loading') }
              : app
          )),
        }));
      }
    }));
  };

  const query = async (keyword) => {
    const term = typeof keyword === 'string' ? keyword.trim() : q.trim();
    if (!term) return;

    setQ(term);
    setState({ loading: true, apps: [], error: null, searched: true });

    try {
      const res = await fetch(`/api/iap?q=${encodeURIComponent(term)}&country=${DEFAULT_COUNTRY}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const json = await res.json();
      const apps = (json.apps || []).map((app) => ({
        ...app,
        compareLoading: false,
        compare: {
          ...buildInitialCompare(),
          [DEFAULT_COUNTRY]: {
            region: DEFAULT_COUNTRY,
            status: 'ready',
            iapState: app.iapState || 'unknown',
            pageState: app.pageState || 'idle',
            priceRange: dedupe(app.priceRange || []),
            iapItems: app.iapItems || [],
            trackViewUrl: app.trackViewUrl || '',
            formattedPrice: app.formattedPrice || '',
          },
        },
      }));

      setState({ loading: false, apps, error: null, searched: true });
      await Promise.all(apps.map((app) => compareRegions(app.trackId)));
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
        <button onClick={() => query()} disabled={state.loading}>
          {state.loading ? t.iap.querying : t.iap.search}
        </button>
      </div>

      <div className="notice">
        <ShieldAlert size={18} />
        <span>
          {lang === 'zh'
            ? '搜索后会默认展示多个热门地区的内购横向比价，不需要再单独切换地区。'
            : 'Search results now open with a side-by-side IAP comparison across popular regions.'}
        </span>
      </div>

      <section className="iapGuide card">
        <div className="iapGuideIntro">
          <h2>{lang === 'zh' ? '这一页现在怎么看' : 'How to read this page now'}</h2>
          <p>
            {lang === 'zh'
              ? '先用美国商店结果快速匹配应用，再自动补齐中国、日本、香港、台湾、英国、韩国等热门地区的公开内购信号与价格范围，方便直接横向对比。'
              : 'The page matches apps quickly from the US store first, then fills in public IAP signals and price ranges for other popular regions automatically.'}
          </p>
        </div>
        <div className="iapGuideGrid">
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '默认多地区' : 'Popular regions by default'}</b>
            <p>{lang === 'zh' ? '搜索完成后直接展示多个热门地区，不用先选商店。' : 'Results open directly in a popular-region comparison layout.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '横向更好比' : 'Better side-by-side view'}</b>
            <p>{lang === 'zh' ? '每个地区都放在同一排里，看公开价格和内购信号更直观。' : 'Every region sits in one row so public prices and IAP signals are easier to compare.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '移动端可滑动' : 'Mobile friendly scroll'}</b>
            <p>{lang === 'zh' ? '手机上保留横向结构，但可以左右滑动查看，不把信息挤乱。' : 'On mobile the comparison keeps its structure with horizontal scrolling.'}</p>
          </article>
        </div>
      </section>

      <div className="toolRelated">
        <span>{lang === 'zh' ? '热门地区' : 'Popular regions'}</span>
        {REGIONS.map((region) => (
          <a key={region.code} href={`/price?region=${region.code}`}>{regionLabel(region.code)}</a>
        ))}
      </div>

      {state.error && <p className="err">{t.iap.queryFailed} {state.error}</p>}
      {state.loading && <p>{t.iap.queryingStore}</p>}

      <div className="iapGrid">
        {state.apps.map((app) => {
          const verdict = inspectApp(app, t);
          const winner = bestRegion(app.compare);

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
                <span>{lang === 'zh' ? '热门地区横向比价' : 'Popular-region compare'}</span>
                {winner && (
                  <span>{lang === 'zh' ? '公开信息更完整' : 'Most complete public data'} {regionLabel(winner)}</span>
                )}
              </div>

              <div className="iapComparePanel">
                <div className="iapCompareTitle">
                  <strong>{lang === 'zh' ? '地区横向比价' : 'Regional side-by-side compare'}</strong>
                  <span>
                    {app.compareLoading
                      ? (lang === 'zh' ? '正在补齐热门地区数据' : 'Filling more regions')
                      : (lang === 'zh' ? '已按热门地区展开' : 'Expanded across popular regions')}
                  </span>
                </div>

                <div className="iapCompareScroller">
                  <div className="iapCompareTable">
                    {REGIONS.map((region) => {
                      const entry = app.compare?.[region.code] || {};
                      const entryVerdict = inspectApp({ iapState: entry.iapState }, t);
                      const isWinner = winner === region.code;

                      return (
                        <article
                          key={region.code}
                          className={`iapRegionCard${isWinner ? ' active' : ''}${entry.status === 'error' ? ' error' : ''}`}
                        >
                          <div className="iapRegionTop">
                            <b>{regionLabel(region.code)}</b>
                            {isWinner && <span className="iapRegionBest">{lang === 'zh' ? '推荐看这里' : 'Best view'}</span>}
                          </div>
                          <span className={entryVerdict.cls}>{entryVerdict.label}</span>
                          <div className="iapRegionMeta">
                            <span>{pageStateLabel(entry.pageState, lang)}</span>
                            <strong>{summaryLabel(entry, lang)}</strong>
                          </div>
                          <div className="iapRegionPrices">
                            {(entry.priceRange || []).slice(0, 3).map((price) => (
                              <em key={price}>{price}</em>
                            ))}
                            {!entry.priceRange?.length && <em>{lang === 'zh' ? '暂无公开价格' : 'No public price'}</em>}
                          </div>
                          {entry.trackViewUrl && (
                            <a href={entry.trackViewUrl} target="_blank" rel="noreferrer" className="iapRegionLink">
                              {lang === 'zh' ? '打开该地区商店' : 'Open store'}
                            </a>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>

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
                  onClick={() => compareRegions(app.trackId)}
                  disabled={!app.trackId || app.compareLoading}
                >
                  {app.compareLoading
                    ? (lang === 'zh' ? '比价更新中' : 'Refreshing compare')
                    : (lang === 'zh' ? '刷新热门地区比价' : 'Refresh region compare')}
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
