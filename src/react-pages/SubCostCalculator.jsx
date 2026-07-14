import { useMemo, useState } from 'react';
import { Download, Plus, RotateCcw, Save, Trash2, Wallet } from 'lucide-react';
import { Hero, Empty } from '../components/common.jsx';
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
    panelDesc: 'Add each plan once, then convert weekly, monthly, and yearly offers into comparable costs.',
    name: 'Name',
    namePh: 'App / plan',
    price: 'Price',
    cycle: 'Billing cycle',
    active: 'Active',
    inactive: 'Paused',
    add: 'Add plan',
    remove: 'Remove',
    clear: 'Clear all',
    sample: 'Load sample',
    summary: 'Cost overview',
    monthly: 'Estimated monthly',
    yearly: 'Estimated yearly',
    activeCount: 'Active plans',
    totalListed: 'Listed plans',
    week: 'Weekly',
    month: 'Monthly',
    year: 'Yearly',
    note: 'Notes',
    notePh: 'Trial end, family device, cancel path…',
    tip: 'Tip: convert every offer to yearly cost before comparing “cheap” weekly plans with annual unlocks.',
    empty: 'Add at least one active subscription with a price to see totals.',
    emptyList: 'No subscription plans yet. Add one or load the sample set.',
    save: 'Save locally',
    saved: 'Saved in this browser',
    export: 'Export JSON',
    perMo: 'per month',
    perYr: 'per year',
    converted: 'Converted cost',
    disclaimer: 'This calculator is a research aid. Final charges depend on taxes, storefront, trials, and Apple account settings.',
  },
  zh: {
    title: '订阅成本计算器',
    sub: '估算 App Store 及其他循环订阅的月成本与年成本。数据只保存在你的浏览器。',
    panelTitle: '你的订阅列表',
    panelDesc: '每个方案添加一次，把周付、月付、年付换算成可比较的成本。',
    name: '名称',
    namePh: '应用 / 方案',
    price: '价格',
    cycle: '计费周期',
    active: '生效中',
    inactive: '已暂停',
    add: '添加方案',
    remove: '删除',
    clear: '清空',
    sample: '载入示例',
    summary: '成本概览',
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
    emptyList: '还没有订阅方案。先添加一条，或载入示例。',
    save: '本地保存',
    saved: '已保存在本浏览器',
    export: '导出 JSON',
    perMo: '每月',
    perYr: '每年',
    converted: '换算成本',
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
    return {
      monthly: active.reduce((sum, r) => sum + toMonthly(r.price, r.cycle), 0),
      yearly: active.reduce((sum, r) => sum + toYearly(r.price, r.cycle), 0),
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
    const payload = { generatedAt: new Date().toISOString(), totals, rows };
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
  const hasMeaningful = rows.some((r) => r.name || r.price);

  return (
    <>
      <Hero title={t.title} sub={t.sub} />

      <div className="ipPanel card">
        <div>
          <h3>{t.summary}</h3>
          <p>{t.panelDesc}</p>
        </div>
        <div className="savedActions">
          <button type="button" onClick={add}><Plus size={15} /> {t.add}</button>
          <button type="button" onClick={loadSample}><RotateCcw size={15} /> {t.sample}</button>
          <button type="button" onClick={save}><Save size={15} /> {t.save}</button>
          <button type="button" onClick={exportJson}><Download size={15} /> {t.export}</button>
          <button type="button" className="danger" onClick={clear}><Trash2 size={15} /> {t.clear}</button>
        </div>
      </div>

      <div className="ipHero card">
        <div className="ipAddress">
          <span><Wallet size={28} strokeWidth={2.2} /></span>
          <b>{money(totals.monthly)}</b>
          <em>{t.monthly}</em>
        </div>
        <div className="ipMap">{money(totals.yearly)} · {t.yearly}</div>
      </div>

      <div className="ipGrid">
        <div className="ipCell"><span>{t.monthly}</span><b>{money(totals.monthly)}</b></div>
        <div className="ipCell"><span>{t.yearly}</span><b>{money(totals.yearly)}</b></div>
        <div className="ipCell"><span>{t.activeCount}</span><b>{totals.activeCount}</b></div>
        <div className="ipCell"><span>{t.totalListed}</span><b>{totals.totalListed}</b></div>
      </div>

      {totals.activeCount === 0 && <p className="contentNote">{t.empty}</p>}

      <section className="savedBox card">
        <div className="savedHead">
          <div>
            <h3>{t.panelTitle}</h3>
            <p>{rows.length} {lang === 'zh' ? '条方案' : 'plans'}</p>
          </div>
        </div>

        {!hasMeaningful ? (
          <Empty text={t.emptyList} />
        ) : (
          <div className="subcostNativeList">
            {rows.map((row) => {
              const mo = toMonthly(row.price, row.cycle);
              const yr = toYearly(row.price, row.cycle);
              return (
                <article className={`subcostNativeCard card ${row.active ? '' : 'is-paused'}`} key={row.id}>
                  <div className="swFormGrid">
                    <label className="swField swFieldGrow">
                      <span>{t.name}</span>
                      <div className="searchbar swControl">
                        <input
                          value={row.name}
                          onChange={(e) => update(row.id, 'name', e.target.value)}
                          placeholder={t.namePh}
                        />
                      </div>
                    </label>
                    <label className="swField">
                      <span>{t.price}</span>
                      <div className="searchbar swControl">
                        <input
                          inputMode="decimal"
                          value={row.price}
                          onChange={(e) => update(row.id, 'price', e.target.value)}
                          placeholder="9.99"
                        />
                      </div>
                    </label>
                    <div className="swField swFieldCycle">
                      <span>{t.cycle}</span>
                      <div className="tabs swCycleTabs" role="group" aria-label={t.cycle}>
                        {[
                          ['week', t.week],
                          ['month', t.month],
                          ['year', t.year],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            className={row.cycle === value ? 'on' : ''}
                            onClick={() => update(row.id, 'cycle', value)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="swField swFieldGrow">
                      <span>{t.note}</span>
                      <div className="searchbar swControl">
                        <input
                          value={row.note || ''}
                          onChange={(e) => update(row.id, 'note', e.target.value)}
                          placeholder={t.notePh}
                        />
                      </div>
                    </label>
                  </div>

                  <div className="subcostNativeFoot">
                    <button
                      type="button"
                      className={row.active ? 'on' : ''}
                      onClick={() => update(row.id, 'active', !row.active)}
                    >
                      {row.active ? t.active : t.inactive}
                    </button>
                    <div className="subcostNativeMeta">
                      <span>{cycleLabel(row.cycle)}</span>
                      <b>{money(mo)}</b>
                      <em>{t.perMo}</em>
                      <span>·</span>
                      <b>{money(yr)}</b>
                      <em>{t.perYr}</em>
                    </div>
                    <button type="button" className="danger" onClick={() => remove(row.id)}>
                      <Trash2 size={14} /> {t.remove}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

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
