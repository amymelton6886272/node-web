import { useRef, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Empty, FeaturedApps } from '../components/common.jsx';
import { useLang } from '../LanguageContext.jsx';

const REGIONS = [
  { code: 'us', label: 'US', zhName: '美国', enName: 'United States', flagUrl: 'https://flagcdn.com/us.svg' },
  { code: 'cn', label: 'CN', zhName: '中国', enName: 'China', flagUrl: 'https://flagcdn.com/cn.svg' },
  { code: 'jp', label: 'JP', zhName: '日本', enName: 'Japan', flagUrl: 'https://flagcdn.com/jp.svg' },
  { code: 'hk', label: 'HK', zhName: '香港', enName: 'Hong Kong', flagUrl: 'https://flagcdn.com/hk.svg' },
  { code: 'tw', label: 'TW', zhName: '台湾', enName: 'Taiwan', flagUrl: 'https://flagcdn.com/tw.svg' },
  { code: 'kr', label: 'KR', zhName: '韩国', enName: 'Korea', flagUrl: 'https://flagcdn.com/kr.svg' },
  { code: 'in', label: 'IN', zhName: '印度', enName: 'India', flagUrl: 'https://flagcdn.com/in.svg' },
  { code: 'ph', label: 'PH', zhName: '菲律宾', enName: 'Philippines', flagUrl: 'https://flagcdn.com/ph.svg' },
  { code: 'pk', label: 'PK', zhName: '巴基斯坦', enName: 'Pakistan', flagUrl: 'https://flagcdn.com/pk.svg' },
  { code: 'eg', label: 'EG', zhName: '埃及', enName: 'Egypt', flagUrl: 'https://flagcdn.com/eg.svg' },
  { code: 'ng', label: 'NG', zhName: '尼日利亚', enName: 'Nigeria', flagUrl: 'https://flagcdn.com/ng.svg' },
  { code: 'tr', label: 'TR', zhName: '土耳其', enName: 'Turkey', flagUrl: 'https://flagcdn.com/tr.svg' },
  { code: 'br', label: 'BR', zhName: '巴西', enName: 'Brazil', flagUrl: 'https://flagcdn.com/br.svg' },
];

const LOCAL_COMPARE_ENDPOINT = '/compare-api/iap-compare';
const PROD_COMPARE_ENDPOINT = '/api/iap-compare';
const CNY_TO_USD_RATE = 0.147717;
const LIVE_RATES_FROM_CNY = {
  USD: 0.147717,
  CNY: 1,
  JPY: 23.69988,
  HKD: 1.157202,
  TWD: 4.666356,
  KRW: 223.713647,
  INR: 14.009723,
  PHP: 8.944544,
  PKR: 41.179377,
  EGP: 7.415808,
  NGN: 200.538985,
  TRY: 6.821282,
  BRL: 0.747496,
};
const AREA_TO_CURRENCY = {
  us: 'USD',
  cn: 'CNY',
  jp: 'JPY',
  hk: 'HKD',
  tw: 'TWD',
  kr: 'KRW',
  in: 'INR',
  ph: 'PHP',
  pk: 'PKR',
  eg: 'EGP',
  ng: 'NGN',
  tr: 'TRY',
  br: 'BRL',
};

function detectSearchCountry(term, lang) {
  if (/[\u3400-\u9fff]/.test(term)) return 'cn';
  if (/[\u3040-\u30ff]/.test(term)) return 'jp';
  if (/[\uac00-\ud7af]/.test(term)) return 'kr';
  return 'us';
}

function priceCount(priceList = []) {
  return priceList.filter((item) => item.formattedPrice).length;
}

function comparablePrice(item) {
  if (!item) return Number.POSITIVE_INFINITY;
  if (typeof item.cnyPrice === 'number' && Number.isFinite(item.cnyPrice)) return item.cnyPrice;
  const fallbackCurrency = item.currencyCode || AREA_TO_CURRENCY[item.area] || '';
  if (typeof item.numericPrice === 'number' && fallbackCurrency && LIVE_RATES_FROM_CNY[fallbackCurrency]) {
    return item.numericPrice / LIVE_RATES_FROM_CNY[fallbackCurrency];
  }
  return Number.POSITIVE_INFINITY;
}

function cheapestArea(priceList = []) {
  const ranked = priceList
    .filter((item) => item?.formattedPrice)
    .map((item) => ({ item, value: comparablePrice(item) }))
    .filter(({ value }) => Number.isFinite(value) && value >= 0);
  if (!ranked.length) return null;
  return ranked.reduce((best, current) => (current.value < best.value ? current : best)).item;
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
  return normalized
    .replace(/youtube/gi, 'YouTube')
    .replace(/\byoutube premium family\b/i, 'YouTube Premium Family')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
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
  if (/collectible avatar/i.test(name)) return false;
  if (/^r\/.+\s+club$/i.test(name)) return false;
  if (/\bcoins?\b/i.test(name)) return false;
  if (/加持團|support group|club membership/i.test(name)) return false;
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
      if (!price?.area) continue;
      const existingIndex = bucket.priceList.findIndex((item) => item.area === price.area);
      if (existingIndex === -1) {
        bucket.priceList.push(price);
        seen.add(price.area);
        continue;
      }
      const existing = bucket.priceList[existingIndex];
      if (comparablePrice(price) < comparablePrice(existing)) {
        bucket.priceList[existingIndex] = price;
      }
    }
  }
  return [...merged.values()].filter((row) => shouldKeepMergedRow(row, appName));
}

function topRegionChips(priceList = []) {
  return [...priceList]
    .filter((item) => item.formattedPrice)
    .sort((a, b) => {
      const av = comparablePrice(a);
      const bv = comparablePrice(b);
      return av - bv;
    })
    .slice(0, 4);
}

function compactTopRegions(priceList = []) {
  return [...priceList]
    .filter((item) => item.formattedPrice)
    .sort((a, b) => {
      const av = comparablePrice(a);
      const bv = comparablePrice(b);
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

function findRegion(area) {
  return REGIONS.find((region) => region.code === area) || null;
}

function displayMoney(item, lang) {
  if (!item) return '';
  if (!item.formattedPrice) return '';
  const fallbackCurrency = item.currencyCode || AREA_TO_CURRENCY[item.area] || '';
  if (lang !== 'zh' && fallbackCurrency === 'USD') {
    return item.formattedPrice;
  }
  const fallbackCny = (
    typeof item.cnyPrice === 'number'
      ? item.cnyPrice
      : (
          typeof item.numericPrice === 'number'
          && fallbackCurrency
          && LIVE_RATES_FROM_CNY[fallbackCurrency]
        )
        ? item.numericPrice / LIVE_RATES_FROM_CNY[fallbackCurrency]
        : null
  );
  const targetValue = lang === 'zh'
    ? fallbackCny
    : (typeof item.usdPrice === 'number' ? item.usdPrice : (typeof fallbackCny === 'number' ? fallbackCny * CNY_TO_USD_RATE : null));
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

function originalMoney(item) {
  if (!item?.formattedPrice) return '';
  if (typeof item.cnyPrice === 'number' && item.cnyPrice === 0) return '';
  if (typeof item.numericPrice === 'number' && item.numericPrice === 0) return '';
  if ((item.currencyCode || AREA_TO_CURRENCY[item.area]) === 'USD') return '';
  return item.formattedPrice;
}

function dualMoney(item, lang) {
  const converted = displayMoney(item, lang);
  const original = originalMoney(item);
  if (!converted) return '';
  if (!original || original === converted) return converted;
  return `${converted} · ${original}`;
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
                      {originalMoney(cheapest) !== displayMoney(cheapest, lang) && (
                        <small>{lang === 'zh' ? '原价 ' : 'Original '}{originalMoney(cheapest)}</small>
                      )}
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
                        {findRegion(item.area)?.flagUrl && <img className="storeFlag" src={findRegion(item.area)?.flagUrl} alt="" loading="lazy" />}
                        {item.area.toUpperCase()} / {dualMoney(item, lang)}
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
                        {cheapestArea(activeRow.priceList || []).area.toUpperCase()} / {dualMoney(cheapestArea(activeRow.priceList || []), lang)}
                      </span>
                    )}
                  </div>

                  <div className="storeRegionGrid">
                    {visibleRegions.map((region) => {
                      const price = getDisplayPrice(activeRow.priceList || [], region.code, lang);
                      const priceItem = activeRow.priceList?.find((entry) => entry.area === region.code);
                      if (!price) return null;
                      const cheapest = cheapestArea(activeRow.priceList || []);
                      const isBest = cheapest?.area === region.code;
                      return (
                        <article key={`${activeRow.object}-${region.code}`} className={isBest ? 'storeRegionCard best' : 'storeRegionCard'}>
                          <div className="storeRegionTop">
                            <div>
                              <strong>{region.flagUrl && <img className="storeFlag" src={region.flagUrl} alt="" loading="lazy" />}{regionDisplayName(region, lang)}</strong>
                              <span>{region.label}</span>
                            </div>
                            {isBest && (
                              <em>{lang === 'zh' ? '最低' : 'Best'}</em>
                            )}
                          </div>
                          <b>{price}</b>
                          {originalMoney(priceItem) && originalMoney(priceItem) !== price && (
                            <span className="storeRegionOriginal">
                              {lang === 'zh' ? '原币 ' : 'Original '}{originalMoney(priceItem)}
                            </span>
                          )}
                          <small>{lang === 'zh' ? '换算公开价格' : 'Converted public price'}</small>
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
