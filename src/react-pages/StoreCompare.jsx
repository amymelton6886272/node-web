import { useRef, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Hero, Empty, FeaturedApps } from '../components/common.jsx';
import { useLang } from '../LanguageContext.jsx';

const REGIONS = [
  { code: 'us', label: 'US', zhName: '美国', enName: 'United States' },
  { code: 'cn', label: 'CN', zhName: '中国', enName: 'China' },
  { code: 'jp', label: 'JP', zhName: '日本', enName: 'Japan' },
  { code: 'hk', label: 'HK', zhName: '香港', enName: 'Hong Kong' },
  { code: 'tw', label: 'TW', zhName: '台湾', enName: 'Taiwan' },
  { code: 'kr', label: 'KR', zhName: '韩国', enName: 'Korea' },
  { code: 'in', label: 'IN', zhName: '印度', enName: 'India' },
  { code: 'ph', label: 'PH', zhName: '菲律宾', enName: 'Philippines' },
  { code: 'pk', label: 'PK', zhName: '巴基斯坦', enName: 'Pakistan' },
  { code: 'eg', label: 'EG', zhName: '埃及', enName: 'Egypt' },
  { code: 'ng', label: 'NG', zhName: '尼日利亚', enName: 'Nigeria' },
  { code: 'tr', label: 'TR', zhName: '土耳其', enName: 'Turkey' },
  { code: 'br', label: 'BR', zhName: '巴西', enName: 'Brazil' },
];

const LOCAL_COMPARE_ENDPOINT = '/compare-api/iap-compare';
const PROD_COMPARE_ENDPOINT = '/api/iap-compare';
const CNY_TO_USD_RATE = 0.147717;

function detectSearchCountry(term, lang) {
  if (/[\u3400-\u9fff]/.test(term)) return 'cn';
  if (/[\u3040-\u30ff]/.test(term)) return 'jp';
  if (/[\uac00-\ud7af]/.test(term)) return 'kr';
  return 'us';
}

function priceCount(priceList = []) {
  return priceList.filter((item) => item.formattedPrice).length;
}

function cheapestArea(priceList = []) {
  const ranked = priceList.filter((item) => typeof item.numericPrice === 'number' && item.numericPrice >= 0);
  if (!ranked.length) return null;
  return ranked.reduce((best, current) => (current.numericPrice < best.numericPrice ? current : best));
}

function bestRows(rows = []) {
  return rows
    .map((row) => ({ row, cheapest: cheapestArea(row.priceList || []) }))
    .filter((item) => item.cheapest)
    .slice(0, 4);
}

function normalizeObjectName(value = '') {
  return String(value)
    .replace(/\s*#\d+$/i, '')
    .replace(/[–—]/g, '-')
    .replace(/[：:]+$/u, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalObjectKey(value = '') {
  const normalized = normalizeObjectName(value);
  if (!normalized || normalized === 'App') return normalized;
  return normalized.replace(/youtube/gi, 'YouTube').replace(/\s+/g, ' ').trim().toLowerCase();
}

function objectLabelScore(value = '') {
  const text = String(value).trim();
  if (!text) return -1;
  let score = text.length;
  if (/[A-Z].*[A-Z]/.test(text)) score += 8;
  if (/YouTube/.test(text)) score += 12;
  if (!/[：:]$/.test(text)) score += 2;
  return score;
}

function preferredObjectLabel(current = '', candidate = '') {
  return objectLabelScore(candidate) > objectLabelScore(current) ? candidate : current;
}

function looksLikeStructuredProductName(value = '') {
  const name = String(value).trim();
  if (!name || name === 'App') return true;
  if (/\d/.test(name)) return true;
  if (/\b(premium|family|lite|music|chat|movie|movies|show|shows|membership|member|verified|stars?|badge|plus|pro|plan|pass|subscription|monthly|annual|yearly|weekly|two-person)\b/i.test(name)) return true;
  if (/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}0-9 .+&'()!-]+$/u.test(name)) return true;
  return false;
}

function isMeaningfulObjectName(value = '') {
  const name = String(value).trim();
  if (!name || name === 'App') return true;
  if (/\b(?:subscriptions?|subscription)\s+\d+$/i.test(name)) return false;
  if (/\b(?:iap|in[ -]?app purchase)\s*#?\d+$/i.test(name)) return false;
  return true;
}
function shouldKeepMergedRow(row, appName = '') {
  const name = String(row.object).trim();
  const coverage = priceCount(row.priceList || []);
  if (!name || name === 'App') return true;
  if (/^@.+\s+subscription$/i.test(name)) return false;
  if (/^(promote|promover)\b/i.test(name)) return false;
  if (/boosted tweet|tweets? impulsionados|プロモーションする|ブーストしたツイート/i.test(name)) return false;
  if (/^notabot$/i.test(name)) return false;
  if (/membership/i.test(name)) return false;
  if (coverage >= 3) return true;
  if (/^\d+\s*(coins?|moedas?)$/i.test(name)) return true;
  if (/\b(premium|basic|plus|family|lite|music|standard|annual|monthly|yearly|weekly|two-person|chat|movies?|shows?|verified|badge|stars?)\b/i.test(name)) return true;
  if (/youtube/i.test(appName) && /^[A-Za-z][A-Za-z\s.'&+\-]{0,28}$/.test(name) && !/\b(premium|family|lite|music|chat|movies?|shows?)\b/i.test(name)) return false;
  return coverage >= 2 && looksLikeStructuredProductName(name);
}

function mergeComparisonRows(rows = [], appName = '') {
  const merged = new Map();
  for (const row of rows) {
    const label = row.object === 'App' ? 'App' : normalizeObjectName(row.object);
    const key = row.object === 'App' ? 'App' : canonicalObjectKey(row.object);
    if (!isMeaningfulObjectName(label)) continue;
    if (!merged.has(key)) merged.set(key, { object: label, priceList: [] });
    const bucket = merged.get(key);
    bucket.object = preferredObjectLabel(bucket.object, label);
    const seen = new Set(bucket.priceList.map((item) => item.area));
    for (const price of row.priceList || []) {
      if (!price?.area || seen.has(price.area)) continue;
      bucket.priceList.push(price);
      seen.add(price.area);
    }
  }
  return [...merged.values()].filter((row) => shouldKeepMergedRow(row, appName));
}

function topRegionChips(priceList = []) {
  return [...priceList]
    .filter((item) => item.formattedPrice)
    .sort((a, b) => {
      const av = typeof a.numericPrice === 'number' ? a.numericPrice : Number.POSITIVE_INFINITY;
      const bv = typeof b.numericPrice === 'number' ? b.numericPrice : Number.POSITIVE_INFINITY;
      return av - bv;
    })
    .slice(0, 4);
}

function compactTopRegions(priceList = []) {
  return [...priceList]
    .filter((item) => item.formattedPrice)
    .sort((a, b) => {
      const av = typeof a.numericPrice === 'number' ? a.numericPrice : Number.POSITIVE_INFINITY;
      const bv = typeof b.numericPrice === 'number' ? b.numericPrice : Number.POSITIVE_INFINITY;
      return av - bv;
    })
    .slice(0, 6);
}

function visibleRegionsForRows(rows = []) {
  const visible = new Set();
  const sourceRows = rows.filter((row) => row.object !== 'App');
  const effectiveRows = sourceRows.length ? sourceRows : rows;
  for (const row of effectiveRows) {
    for (const price of row.priceList || []) {
      if (price?.area && price.formattedPrice) visible.add(price.area);
    }
  }
  return REGIONS.filter((region) => visible.has(region.code));
}

function regionDisplayName(region, lang) {
  if (!region) return '';
  return lang === 'zh' ? region.zhName : region.enName;
}

function displayMoney(item, lang) {
  if (!item) return '';
  const targetValue = lang === 'zh'
    ? item.cnyPrice
    : (typeof item.usdPrice === 'number' ? item.usdPrice : (typeof item.cnyPrice === 'number' ? item.cnyPrice * CNY_TO_USD_RATE : null));
  if (typeof targetValue === 'number' && Number.isFinite(targetValue)) {
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: lang === 'zh' ? 'CNY' : 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(targetValue);
  }
  return item.formattedPrice || '';
}

function getDisplayPrice(priceList = [], area, lang) {
  const item = priceList.find((entry) => entry.area === area);
  return displayMoney(item, lang);
}

export default function StoreCompare() {
  const [q, setQ] = useState('');
  const [state, setState] = useState({ loading: false, apps: [], error: null, searched: false });
  const [selectedRowsByApp, setSelectedRowsByApp] = useState({});
  const { lang } = useLang();
  const requestIdRef = useRef(0);
  const abortRef = useRef(null);

  const search = async (keyword) => {
    const term = typeof keyword === 'string' ? keyword.trim() : q.trim();
    if (!term) return;
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setQ(term);
    setState({ loading: true, apps: [], error: null, searched: true });

    try {
      const endpoint = location.port === '4321' ? LOCAL_COMPARE_ENDPOINT : PROD_COMPARE_ENDPOINT;
      const country = detectSearchCountry(term, lang);
      const res = await fetch(`${endpoint}?q=${encodeURIComponent(term)}&country=${country}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      if (requestId !== requestIdRef.current) return;
      setState({ loading: false, apps: json.apps || [], error: null, searched: true });
    } catch (error) {
      if (error?.name === 'AbortError') return;
      if (requestId !== requestIdRef.current) return;
      setState({ loading: false, apps: [], error: String(error), searched: true });
    }
  };

  return (
    <>
      <Hero
        title={lang === 'zh' ? 'App 订阅与价格对比' : 'App subscription and price compare'}
        sub={lang === 'zh'
          ? '搜索一次应用，统一展示软件本体、公开订阅名称、热门地区价格，并自动标出当前最低价。'
          : 'Search an app to list the app itself plus public subscriptions, compare regions side by side, and mark the lowest price.'}
      />

      <div className="searchbar priceSearchbar">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') search(); }}
          placeholder={lang === 'zh' ? '输入应用名 / Bundle ID / Track ID / App Store 链接' : 'Enter app name / Bundle ID / Track ID / App Store link'}
        />
        <button onClick={() => search()} disabled={state.loading}>
          {state.loading ? (lang === 'zh' ? '查询中' : 'Searching') : (lang === 'zh' ? '开始比价' : 'Compare now')}
        </button>
      </div>

      <div className="notice">
        <ShieldAlert size={18} />
        <span>
          {lang === 'zh'
            ? '热门地区已扩展为 US、CN、JP、HK、TW、KR、IN、PH、PK、EG、NG、TR、BR；重复订阅项会尽量合并显示。'
            : 'Hot regions now include US, CN, JP, HK, TW, KR, IN, PH, PK, EG, NG, TR, and BR. Repeated subscription rows are merged when possible.'}
        </span>
      </div>

      {state.error && <p className="err">{state.error}</p>}
      {state.loading && <p>{lang === 'zh' ? '正在加载应用与各地区价格快照...' : 'Loading app and regional price snapshots...'}</p>}

      <div className="storeUnifiedList">
        {state.apps.map((app) => {
          const rows = mergeComparisonRows(app.comparison || [], app.trackName || app.bundleId || '');
          const best = bestRows(rows);
          const appRow = rows.find((row) => row.object === 'App') || rows[0];
          const selectedObject = selectedRowsByApp[app.trackId || app.bundleId] || appRow?.object || 'App';
          const activeRow = rows.find((row) => row.object === selectedObject) || appRow;
          const topActiveDeals = compactTopRegions(activeRow?.priceList || []);
          const visibleRegions = visibleRegionsForRows(activeRow ? [activeRow] : rows);

          return (
            <section className="storeUnifiedCard" key={app.trackId || app.bundleId}>
              <div className="storeUnifiedHead">
                <img
                  src={(app.artworkUrl100 || '').replace(/\d+x\d+bb\.(jpg|png|webp)$/, '200x200bb.$1')}
                  alt=""
                />
                <div className="storeUnifiedMeta">
                  <h3>{app.trackName}</h3>
                  <p>{app.artistName}</p>
                  <small>{app.bundleId || 'Bundle ID unavailable'}</small>
                </div>
                <a href={app.trackViewUrl} target="_blank" rel="noreferrer" className="storeUnifiedLink">
                  {lang === 'zh' ? '打开 App Store' : 'Open App Store'}
                </a>
              </div>

              <div className="storeUnifiedInfo">
                <span>{lang === 'zh' ? '覆盖地区' : 'Regions'} {app.snapshot?.regionCount || 0}</span>
                <span>{lang === 'zh' ? '公开项目' : 'Public items'} {app.snapshot?.objectCount || 0}</span>
                <span>{lang === 'zh' ? '数据来源' : 'Source'} {app.snapshot?.dataSource || 'live'}</span>
                {app.version && <span>{lang === 'zh' ? '版本' : 'Version'} {app.version}</span>}
                {app.currentVersionReleaseDate && <span>{lang === 'zh' ? '更新' : 'Updated'} {String(app.currentVersionReleaseDate).slice(0, 10)}</span>}
              </div>

              {best.length > 0 && (
                <div className="storeSummaryGrid">
                  {best.map(({ row, cheapest }) => (
                    <article className="storeSummaryCard" key={row.object}>
                      <strong>{row.object === 'App' ? (lang === 'zh' ? '软件本体' : 'App') : row.object}</strong>
                      <b>{cheapest.area.toUpperCase()} / {displayMoney(cheapest, lang)}</b>
                      <span>{lang === 'zh' ? '当前最低公开价格' : 'Current lowest public price'}</span>
                    </article>
                  ))}
                </div>
              )}

              {topActiveDeals.length > 0 && (
                <div className="storeHotBar">
                  <strong>{lang === 'zh' ? '热门低价区' : 'Best-value regions'}</strong>
                  <div className="storeHotChips">
                    {topActiveDeals.map((item) => (
                      <span key={`${app.trackId}-${item.area}`} className="storeHotChip">
                        {item.area.toUpperCase()} / {displayMoney(item, lang)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {rows.length === 1 && (
                <div className="notice" style={{ marginTop: 14 }}>
                  <ShieldAlert size={18} />
                  <span>
                    {lang === 'zh'
                      ? '当前公开页面没有披露可比价的订阅条目，仅展示软件本体价格。'
                      : 'This public page does not disclose itemized subscription prices, so only the app price is shown.'}
                  </span>
                </div>
              )}

              {app.screenshotUrls?.length > 0 && (
                <div className="storeShots">
                  <div className="storeShotsHead">
                    <strong>{lang === 'zh' ? '应用截图' : 'Screenshots'}</strong>
                  </div>
                  <div className="storeShotsRail">
                    {app.screenshotUrls.slice(0, 6).map((url) => (
                      <img key={url} src={url} alt="" loading="lazy" />
                    ))}
                  </div>
                </div>
              )}

              {rows.length > 0 && (
                <div className="storeSheetNav">
                  <div className="storeSheetNavLabel">
                    {lang === 'zh' ? '价格项目' : 'Price items'}
                  </div>
                  <div className="tabs storeSheetTabs">
                  {rows.map((row) => {
                    const isActive = row.object === activeRow?.object;
                    const label = row.object === 'App' ? (lang === 'zh' ? '软件本体' : 'App') : row.object;
                    return (
                      <button
                        key={`${app.trackId || app.bundleId}-${row.object}`}
                        className={isActive ? 'on' : ''}
                        onClick={() => setSelectedRowsByApp((current) => ({
                          ...current,
                          [app.trackId || app.bundleId]: row.object,
                        }))}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                </div>
              )}

              {activeRow && (
                <div className="storeComparePanel">
                  <div className="storeComparePanelHead">
                    <div className="storeUnifiedItemCell">
                      <strong>{activeRow.object === 'App' ? (lang === 'zh' ? '软件本体' : 'App') : activeRow.object}</strong>
                      <span>{lang === 'zh' ? ('覆盖 ' + priceCount(activeRow.priceList || []) + ' 个地区') : (priceCount(activeRow.priceList || []) + ' regions')}</span>
                    </div>
                    {cheapestArea(activeRow.priceList || []) && (
                      <span className="storeUnifiedBest">
                        {lang === 'zh' ? '最低价 ' : 'Lowest '}
                        {cheapestArea(activeRow.priceList || []).area.toUpperCase()} / {displayMoney(cheapestArea(activeRow.priceList || []), lang)}
                      </span>
                    )}
                  </div>

                  <div className="storeRegionGrid">
                    {visibleRegions.map((region) => {
                      const price = getDisplayPrice(activeRow.priceList || [], region.code, lang);
                      if (!price) return null;
                      const cheapest = cheapestArea(activeRow.priceList || []);
                      const isBest = cheapest?.area === region.code;
                      return (
                        <article key={`${activeRow.object}-${region.code}`} className={isBest ? 'storeRegionCard best' : 'storeRegionCard'}>
                          <div className="storeRegionTop">
                            <div>
                              <strong>{regionDisplayName(region, lang)}</strong>
                              <span>{region.label}</span>
                            </div>
                            {isBest && (
                              <em>{lang === 'zh' ? '最低' : 'Best'}</em>
                            )}
                          </div>
                          <b>{price}</b>
                          <small>{lang === 'zh' ? '当前公开价格' : 'Current public price'}</small>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}

              {app.description && <p className="iapDesc">{app.description}</p>}
              {app.releaseNotes && <p className="iapDesc">{app.releaseNotes}</p>}
            </section>
          );
        })}
      </div>

      {!state.loading && state.searched && state.apps.length === 0 && !state.error && (
        <Empty text={lang === 'zh' ? '没有找到可比价的应用结果。' : 'No comparable app results found.'} />
      )}
      {!state.searched && <FeaturedApps onSelect={search} />}
    </>
  );
}
