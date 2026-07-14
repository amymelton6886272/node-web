import { useMemo, useState } from 'react';
import { Hero } from '../components/common.jsx';
import { useLang } from '../LanguageContext.jsx';

const emptyRow = () => ({
  id: Math.random().toString(36).slice(2, 9),
  name: '',
  price: '',
  cycle: 'month',
  active: true,
  note: '',
});

const copy = {
  en: {
    title: 'Subscription Cost Calculator',
    sub: 'Estimate monthly and yearly spend for App Store and other recurring subscriptions. Data stays in your browser.',
    panelTitle: 'Your subscriptions',
    panelDesc: 'Add each plan once. Convert weekly, monthly, and yearly offers into comparable monthly and annual cost.',
    name: 'Name',
    namePh: 'App / plan',
    price: 'Price',
    cycle: 'Billing cycle',
    active: 'Active',
    add: 'Add plan',
    remove: 'Remove',
    clear: 'Clear all',
    sample: 'Load sample',
    summary: 'Cost summary',
    monthly: 'Estimated monthly',
    yearly: 'Estimated yearly',
    activeCount: 'Active plans',
    totalListed: 'Listed plans',
    week: 'Weekly',
    month: 'Monthly',
    year: 'Yearly',
    note: 'Notes',
    notePh: 'Trial end, family device, cancel path…',
    tip: 'Tip: convert every offer to yearly cost before you compare “cheap” weekly plans with annual unlocks.',
    empty: 'Add at least one active subscription with a price to see totals.',
    save: 'Save locally',
    saved: 'Saved in this browser',
    export: 'Export JSON',
    perMo: '/mo',
    perYr: '/yr',
    inactive: 'Paused',
    disclaimer: 'This calculator is a research aid. Final charges depend on taxes, storefront, trials, and Apple account settings.',
  },
  zh: {
    title: '订阅成本计算器',
    sub: '估算 App Store 及其他循环订阅的月成本与年成本。数据只保存在你的浏览器。',
    panelTitle: '你的订阅列表',
    panelDesc: '把每个方案添加一次。把周付、月付、年付报价换算成可比较的月成本与年成本。',
    name: '名称',
    namePh: '应用 / 方案',
    price: '价格',
    cycle: '计费周期',
    active: '生效中',
    add: '添加方案',
    remove: '删除',
    clear: '清空',
    sample: '载入示例',
    summary: '成本汇总',
    monthly: '预估月成本',
    yearly: '预估年成本',
    activeCount: '生效方案',
    totalListed: '列表方案',
    week: '周付',
    month: '月付',
    year: '年付',
    note: '备注',
    notePh: '试用结束日、家庭设备、取消路径…',
    tip: '提示：比较“便宜”周付和年付解锁前，先把所有报价换算成年成本。',
    empty: '至少添加一条带价格的生效订阅，才能看到汇总。',
    save: '本地保存',
    saved: '已保存在本浏览器',
    export: '导出 JSON',
    perMo: '/月',
    perYr: '/年',
    inactive: '已暂停',
    disclaimer: '本计算器仅供研究辅助。最终扣费取决于税费、商店地区、试用和 Apple 账户设置。',
  },
};

function toMonthly(price, cycle) {
  const n = Number(price);
  if (!Number.isFinite(n) || n < 0) return 0;
  if (cycle === 'week') return (n * 52) / 12;
  if (cycle === 'year') return n / 12;
  return n;
}

function toYearly(price, cycle) {
  const n = Number(price);
  if (!Number.isFinite(n) || n < 0) return 0;
  if (cycle === 'week') return n * 52;
  if (cycle === 'month') return n * 12;
  return n;
}

const sampleRows = [
  { id: 's1', name: 'Cloud sync pro', price: '9.99', cycle: 'month', active: true, note: 'Used weekly' },
  { id: 's2', name: 'Photo filters', price: '4.99', cycle: 'week', active: true, note: 'Re-check after trial' },
  { id: 's3', name: 'Offline notes unlock', price: '29.99', cycle: 'year', active: false, note: 'Paused' },
];

export default function SubCostCalculator() {
  const { lang } = useLang();
  const t = copy[lang] || copy.en;
  const [rows, setRows] = useState(() => {
    try {
      const raw = localStorage.getItem('storewise_subcost') || localStorage.getItem('wolffy_subcost');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {}
    return [emptyRow()];
  });
  const [toast, setToast] = useState('');

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1400);
  };

  const totals = useMemo(() => {
    const active = rows.filter((r) => r.active && Number(r.price) > 0);
    const monthly = active.reduce((sum, r) => sum + toMonthly(r.price, r.cycle), 0);
    const yearly = active.reduce((sum, r) => sum + toYearly(r.price, r.cycle), 0);
    return {
      monthly,
      yearly,
      activeCount: active.length,
      totalListed: rows.length,
    };
  }, [rows]);

  const update = (id, key, value) => {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  };

  const remove = (id) => setRows((list) => (list.length <= 1 ? [emptyRow()] : list.filter((r) => r.id !== id)));
  const add = () => setRows((list) => [...list, emptyRow()]);
  const clear = () => {
    setRows([emptyRow()]);
    try {
      localStorage.removeItem('storewise_subcost');
      localStorage.removeItem('wolffy_subcost');
    } catch {}
  };
  const loadSample = () => setRows(sampleRows.map((r) => ({ ...r })));
  const save = () => {
    try {
      localStorage.setItem('storewise_subcost', JSON.stringify(rows));
      flash(t.saved);
    } catch {}
  };
  const exportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      totals,
      rows,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscription-costs.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const money = (n) => (Number.isFinite(n) ? n.toFixed(2) : '0.00');
  const cycleLabel = (c) => (c === 'week' ? t.week : c === 'year' ? t.year : t.month);

  return (
    <>
      <Hero title={t.title} sub={t.sub} />

      <section className="card subcostPanel">
        <div className="subcostSummary">
          <div className="subcostSummaryMain">
            <span className="subcostKicker">{t.summary}</span>
            <div className="subcostBigRow">
              <div className="subcostBig">
                <em>{t.monthly}</em>
                <b>{money(totals.monthly)}</b>
              </div>
              <div className="subcostBig">
                <em>{t.yearly}</em>
                <b>{money(totals.yearly)}</b>
              </div>
            </div>
          </div>
          <div className="subcostMeta">
            <div className="subcostMetaItem">
              <span>{t.activeCount}</span>
              <b>{totals.activeCount}</b>
            </div>
            <div className="subcostMetaItem">
              <span>{t.totalListed}</span>
              <b>{totals.totalListed}</b>
            </div>
          </div>
        </div>
        {totals.activeCount === 0 && <p className="subcostEmpty">{t.empty}</p>}
      </section>

      <section className="card subcostPanel">
        <div className="subcostHead">
          <div>
            <h3>{t.panelTitle}</h3>
            <p>{t.panelDesc}</p>
          </div>
          <div className="subcostToolbar">
            <button type="button" className="subcostBtn primary" onClick={add}>{t.add}</button>
            <button type="button" className="subcostBtn" onClick={loadSample}>{t.sample}</button>
            <button type="button" className="subcostBtn" onClick={save}>{t.save}</button>
            <button type="button" className="subcostBtn" onClick={exportJson}>{t.export}</button>
            <button type="button" className="subcostBtn danger" onClick={clear}>{t.clear}</button>
          </div>
        </div>

        <div className="subcostList">
          {rows.map((row, index) => {
            const mo = toMonthly(row.price, row.cycle);
            const yr = toYearly(row.price, row.cycle);
            return (
              <article className={`subcostRow ${row.active ? '' : 'is-paused'}`} key={row.id}>
                <div className="subcostRowTop">
                  <div className="subcostIndex">{index + 1}</div>
                  <div className="subcostFields">
                    <label className="subcostField wide">
                      <span>{t.name}</span>
                      <input
                        value={row.name}
                        onChange={(e) => update(row.id, 'name', e.target.value)}
                        placeholder={t.namePh}
                      />
                    </label>
                    <label className="subcostField">
                      <span>{t.price}</span>
                      <input
                        inputMode="decimal"
                        value={row.price}
                        onChange={(e) => update(row.id, 'price', e.target.value)}
                        placeholder="9.99"
                      />
                    </label>
                    <label className="subcostField">
                      <span>{t.cycle}</span>
                      <select value={row.cycle} onChange={(e) => update(row.id, 'cycle', e.target.value)}>
                        <option value="week">{t.week}</option>
                        <option value="month">{t.month}</option>
                        <option value="year">{t.year}</option>
                      </select>
                    </label>
                    <label className="subcostField wide">
                      <span>{t.note}</span>
                      <input
                        value={row.note || ''}
                        onChange={(e) => update(row.id, 'note', e.target.value)}
                        placeholder={t.notePh}
                      />
                    </label>
                  </div>
                </div>

                <div className="subcostRowFoot">
                  <button
                    type="button"
                    className={`subcostToggle ${row.active ? 'on' : ''}`}
                    onClick={() => update(row.id, 'active', !row.active)}
                    aria-pressed={!!row.active}
                  >
                    <i />
                    <span>{row.active ? t.active : t.inactive}</span>
                  </button>
                  <div className="subcostCalc">
                    <span className="subcostPill">{cycleLabel(row.cycle)}</span>
                    <b>
                      {money(mo)}
                      <small>{t.perMo}</small>
                    </b>
                    <em>·</em>
                    <b>
                      {money(yr)}
                      <small>{t.perYr}</small>
                    </b>
                  </div>
                  <button type="button" className="subcostBtn ghost" onClick={() => remove(row.id)}>
                    {t.remove}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <p className="contentNote">{t.tip}</p>
        <p className="contentNote">{t.disclaimer}</p>
        <div className="contentLinks">
          <span>{lang === 'zh' ? '相关阅读' : 'Related reading'}</span>
          <a href="/price">{lang === 'zh' ? '价格对比' : 'Price compare'}</a>
          <a href="/trial">{lang === 'zh' ? '试用提醒' : 'Trial reminder'}</a>
          <a href="/checklists">{lang === 'zh' ? '决策清单' : 'Checklists'}</a>
          <a href="/articles/when-paid-app-beats-subscription">{lang === 'zh' ? '买断 vs 订阅' : 'Paid vs subscription'}</a>
          <a href="/articles/spot-subscription-fatigue-apps">{lang === 'zh' ? '订阅疲劳' : 'Subscription fatigue'}</a>
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
