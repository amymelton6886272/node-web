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

function regionLabel(code) {
  return REGIONS.find((item) => item.code === code)?.label || code.toUpperCase();
}

function verdictLabel(state, t) {
  if (state === 'yes') return { label: t.iap.includesIAP, cls: 'badge ok' };
  if (state === 'no') return { label: t.iap.noIAP, cls: 'badge' };
  return { label: t.iap.pending, cls: 'badge warn' };
}

function statusLabel(pageState, lang) {
  if (pageState === 'items') return lang === 'zh' ? '已抓到条目' : 'Items captured';
  if (pageState === 'page') return lang === 'zh' ? '页面可读' : 'Page readable';
  if (pageState === 'unavailable') return lang === 'zh' ? '页面不可用' : 'Unavailable';
  return lang === 'zh' ? '待确认' : 'Pending';
}

function itemRows(comparison = []) {
  return comparison.filter((row) => row.object !== 'App');
}

function appRow(comparison = []) {
  return comparison.find((row) => row.object === 'App') || null;
}

function getPrice(priceList = [], area) {
  return priceList.find((item) => item.area === area)?.formattedPrice || '';
}

function getStoreLink(regions = [], area) {
  return regions.find((item) => item.area === area)?.trackViewUrl || '';
}

export default function Iap() {
  const [q, setQ] = useState('');
  const [state, setState] = useState({ loading: false, apps: [], areas: [], error: null, searched: false });

  const { t, lang } = useLang();
  const content = toolContent[lang]?.iap || toolContent.en.iap;

  const query = async (keyword) => {
    const term = typeof keyword === 'string' ? keyword.trim() : q.trim();
    if (!term) return;

    setQ(term);
    setState({ loading: true, apps: [], areas: [], error: null, searched: true });

    try {
      const res = await fetch(`/api/iap-compare?q=${encodeURIComponent(term)}&country=us`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const json = await res.json();
      setState({
        loading: false,
        apps: json.apps || [],
        areas: json.areas || [],
        error: null,
        searched: true,
      });
    } catch (error) {
      setState({ loading: false, apps: [], areas: [], error: String(error), searched: true });
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
            ? '现在会直接返回应用快照和热门地区对比结果，页面更接近内购比价站的展示方式。'
            : 'The page now returns an app snapshot plus popular-region comparison data in one response.'}
        </span>
      </div>

      <section className="iapGuide card">
        <div className="iapGuideIntro">
          <h2>{lang === 'zh' ? '现在的内购页结构' : 'How the IAP page is structured now'}</h2>
          <p>
            {lang === 'zh'
              ? '每次查询都会先拿到应用主档案，再附带热门地区的公开价格快照、内购条目和商店入口，页面不再依赖前端连续发多个地区请求。'
              : 'Each search returns an app profile together with popular-region price snapshots, public IAP items, and store links.'}
          </p>
        </div>
        <div className="iapGuideGrid">
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '快照优先' : 'Snapshot first'}</b>
            <p>{lang === 'zh' ? '先把应用级信息和地区快照一起返回，再渲染比价。' : 'App metadata and region snapshots arrive together before rendering.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '热门地区矩阵' : 'Popular-region matrix'}</b>
            <p>{lang === 'zh' ? '主流地区按列展开，内购条目按行对齐，更像真正的比价站。' : 'Popular regions expand as columns while IAP items align by row.'}</p>
          </article>
          <article className="iapGuideItem">
            <b>{lang === 'zh' ? '一次查询完成' : 'One query flow'}</b>
            <p>{lang === 'zh' ? '避免浏览器继续串行补抓，结果更稳一些。' : 'The browser no longer needs to chain many follow-up requests.'}</p>
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
          const verdict = verdictLabel(app.iapState, t);
          const appPriceRow = appRow(app.comparison);
          const rows = itemRows(app.comparison);

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
                  <b>{app.snapshot?.regionCount || 0}</b>
                  <span>{lang === 'zh' ? '覆盖地区' : 'Regions covered'}</span>
                </div>
                <div>
                  <b>{app.snapshot?.objectCount || 0}</b>
                  <span>{lang === 'zh' ? '公开项目' : 'Public items'}</span>
                </div>
                <div>
                  <b>{app.primaryGenreName || '-'}</b>
                  <span>{lang === 'zh' ? '分类' : 'Category'}</span>
                </div>
              </div>

              <div className="iapFlag">
                <span className={verdict.cls}>{verdict.label}</span>
                <span>{lang === 'zh' ? '数据来源' : 'Data source'} {app.snapshot?.dataSource || 'live'}</span>
                <span>{lang === 'zh' ? '主参考地区' : 'Primary highlight'} {regionLabel(app.snapshot?.highlightArea || 'us')}</span>
              </div>

              <div className="iapComparePanel">
                <div className="iapCompareTitle">
                  <strong>{lang === 'zh' ? '地区快照摘要' : 'Regional snapshot summary'}</strong>
                  <span>{lang === 'zh' ? '热门地区的应用价格、页面状态和内购信号' : 'App price, page state, and IAP signal across popular regions'}</span>
                </div>

                <div className="iapCompareScroller">
                  <div className="iapCompareTable">
                    {REGIONS.map((region) => {
                      const regionData = app.regions?.find((item) => item.area === region.code);
                      const regionVerdict = verdictLabel(regionData?.iapState, t);
                      return (
                        <article key={region.code} className="iapRegionCard">
                          <div className="iapRegionTop">
                            <b>{region.label}</b>
                          </div>
                          <span className={regionVerdict.cls}>{regionVerdict.label}</span>
                          <div className="iapRegionMeta">
                            <span>{statusLabel(regionData?.pageState, lang)}</span>
                            <strong>{regionData?.formattedPrice || (lang === 'zh' ? '暂无价格' : 'No price')}</strong>
                          </div>
                          <div className="iapRegionPrices">
                            {(regionData?.priceRange || []).slice(0, 3).map((price) => (
                              <em key={price}>{price}</em>
                            ))}
                            {!regionData?.priceRange?.length && <em>{lang === 'zh' ? '暂无公开价格' : 'No public price'}</em>}
                          </div>
                          {regionData?.trackViewUrl && (
                            <a href={regionData.trackViewUrl} target="_blank" rel="noreferrer" className="iapRegionLink">
                              {lang === 'zh' ? '打开商店' : 'Open store'}
                            </a>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>

              {appPriceRow && (
                <div className="iapMatrix">
                  <div className="iapMatrixTitle">
                    <strong>{lang === 'zh' ? '价格与内购比价矩阵' : 'Price and IAP comparison matrix'}</strong>
                    <span>{lang === 'zh' ? '软件本体和公开内购项目统一横向展示' : 'App price and public IAP items shown in one matrix'}</span>
                  </div>
                  <div className="iapMatrixScroller">
                    <table className="iapMatrixTable">
                      <thead>
                        <tr>
                          <th>{lang === 'zh' ? '项目' : 'Item'}</th>
                          {REGIONS.map((region) => (
                            <th key={region.code}>{region.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>{lang === 'zh' ? '软件本体' : 'App'}</strong></td>
                          {REGIONS.map((region) => (
                            <td key={`app-${region.code}`}>
                              {getPrice(appPriceRow.priceList, region.code)
                                ? <span className="iapMatrixPrice">{getPrice(appPriceRow.priceList, region.code)}</span>
                                : <span className="iapMatrixEmpty">-</span>}
                            </td>
                          ))}
                        </tr>
                        {rows.map((row) => (
                          <tr key={row.object}>
                            <td><strong>{row.object}</strong></td>
                            {REGIONS.map((region) => (
                              <td key={`${row.object}-${region.code}`}>
                                {getPrice(row.priceList, region.code)
                                  ? <span className="iapMatrixPrice">{getPrice(row.priceList, region.code)}</span>
                                  : <span className="iapMatrixEmpty">-</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
                <a href={getStoreLink(app.regions, app.snapshot?.highlightArea || 'us') || app.trackViewUrl} target="_blank" rel="noreferrer">
                  {lang === 'zh' ? '打开推荐地区' : 'Open highlighted store'}
                </a>
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
