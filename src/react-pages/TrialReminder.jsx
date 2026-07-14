import { useMemo, useState } from 'react';
import { Hero } from '../components/common.jsx';
import { useLang } from '../LanguageContext.jsx';

const copy = {
  en: {
    title: 'Free Trial Reminder Builder',
    sub: 'Turn a free-trial start date into a cancel reminder, calendar text, and a short action checklist. Everything stays in your browser.',
    formTitle: 'Trial details',
    formDesc: 'Enter the plan name, trial length, and optional renewal price. The page builds a reminder packet you can copy into Notes or Calendar.',
    appName: 'App / plan name',
    startDate: 'Trial start date',
    days: 'Trial length (days)',
    renewPrice: 'Renewal price (optional)',
    cycle: 'Renewal cycle',
    week: 'Weekly',
    month: 'Monthly',
    year: 'Yearly',
    notes: 'Personal note',
    notesPh: 'e.g. shared iPad / ask-to-buy off / test only',
    build: 'Build reminder',
    sample: 'Load sample',
    clear: 'Clear',
    resultTitle: 'Reminder packet',
    cancelBy: 'Cancel by',
    remindOn: 'Remind on',
    yearlyEst: 'Approx. yearly cost if renewed',
    calendarTitle: 'Calendar title',
    calendarBody: 'Calendar / Notes body',
    checklistTitle: 'Action checklist',
    copyAll: 'Copy all',
    copyTitle: 'Copy title',
    copyBody: 'Copy body',
    copied: 'Copied',
    empty: 'Fill the app name and start date to generate a reminder.',
    disclaimer: 'This tool does not access Apple subscriptions and cannot cancel billing. Always confirm the live plan in Settings > Apple ID > Subscriptions.',
    tip: 'Set the reminder at least one day before the cancel deadline. Deleting the app never cancels a trial.',
  },
  zh: {
    title: '免费试用提醒生成器',
    sub: '把试用开始日期转成取消提醒、日历文案和简短行动清单。全部在浏览器本地完成。',
    formTitle: '试用信息',
    formDesc: '填写方案名称、试用天数和可选续费价格。页面会生成可复制到备忘录或日历的提醒包。',
    appName: '应用 / 方案名称',
    startDate: '试用开始日期',
    days: '试用天数',
    renewPrice: '续费价格（可选）',
    cycle: '续费周期',
    week: '周付',
    month: '月付',
    year: '年付',
    notes: '个人备注',
    notesPh: '例如：共用 iPad / 未开购买前询问 / 仅测试',
    build: '生成提醒',
    sample: '载入示例',
    clear: '清空',
    resultTitle: '提醒包',
    cancelBy: '最晚取消日',
    remindOn: '建议提醒日',
    yearlyEst: '若续费的大约年成本',
    calendarTitle: '日历标题',
    calendarBody: '日历 / 备忘录正文',
    checklistTitle: '行动清单',
    copyAll: '复制全部',
    copyTitle: '复制标题',
    copyBody: '复制正文',
    copied: '已复制',
    empty: '填写应用名称和开始日期后生成提醒。',
    disclaimer: '本工具不会访问 Apple 订阅，也不能取消扣费。请始终到“设置 > Apple ID > 订阅”确认真实方案。',
    tip: '至少在取消截止日前一天设置提醒。删除应用不会取消试用。',
  },
};

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + Number(days || 0));
  return d;
}

function fmt(d) {
  if (!d) return '-';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function yearlyFrom(price, cycle) {
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (cycle === 'week') return n * 52;
  if (cycle === 'year') return n;
  return n * 12;
}

export default function TrialReminder() {
  const { lang } = useLang();
  const t = copy[lang] || copy.en;
  const today = new Date();
  const todayStr = fmt(today);
  const [appName, setAppName] = useState('');
  const [startDate, setStartDate] = useState(todayStr);
  const [days, setDays] = useState('7');
  const [renewPrice, setRenewPrice] = useState('');
  const [cycle, setCycle] = useState('month');
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState('');

  const packet = useMemo(() => {
    const name = appName.trim();
    if (!name || !startDate) return null;
    const length = Math.max(1, Number(days) || 7);
    // cancel at least 1 day before end; remind 1 day before cancel deadline when possible
    const end = addDays(startDate, length);
    const cancelBy = addDays(startDate, Math.max(0, length - 1));
    const remindOn = addDays(startDate, Math.max(0, length - 2));
    const yearly = yearlyFrom(renewPrice, cycle);
    const title = lang === 'zh'
      ? `取消试用：${name}`
      : `Cancel trial: ${name}`;
    const bodyLines = lang === 'zh'
      ? [
          `应用/方案：${name}`,
          `试用开始：${startDate}`,
          `试用天数：${length}`,
          `建议最晚取消：${fmt(cancelBy)}`,
          `建议提醒日：${fmt(remindOn)}`,
          renewPrice ? `续费价格：${renewPrice}（${cycle === 'week' ? '周付' : cycle === 'year' ? '年付' : '月付'}）` : '续费价格：未填写',
          yearly != null ? `若续费大约年成本：${yearly.toFixed(2)}` : '',
          notes.trim() ? `备注：${notes.trim()}` : '',
          '',
          '行动：',
          '1. 打开 设置 > Apple ID > 订阅',
          '2. 找到该方案并确认取消或到期',
          '3. 截图保存取消结果',
          '4. 若已扣费，整理订单后走报告问题',
        ].filter(Boolean)
      : [
          `App / plan: ${name}`,
          `Trial start: ${startDate}`,
          `Trial length: ${length} day(s)`,
          `Cancel by: ${fmt(cancelBy)}`,
          `Remind on: ${fmt(remindOn)}`,
          renewPrice ? `Renewal price: ${renewPrice} (${cycle})` : 'Renewal price: not set',
          yearly != null ? `Approx. yearly cost if renewed: ${yearly.toFixed(2)}` : '',
          notes.trim() ? `Note: ${notes.trim()}` : '',
          '',
          'Actions:',
          '1. Open Settings > Apple ID > Subscriptions',
          '2. Find this plan and cancel or set to expire',
          '3. Screenshot the cancellation result',
          '4. If charged already, document the order and use Report a Problem',
        ].filter(Boolean);

    const checklist = lang === 'zh'
      ? [
          '确认试用结束日不是广告页上的模糊文案',
          '在日历中创建取消提醒',
          '家庭设备检查购买前询问 / 屏幕使用时间',
          '取消后仍确认不会自动续费',
        ]
      : [
          'Confirm the trial end date is not vague marketing copy',
          'Create a cancel reminder in Calendar',
          'On family devices, re-check Ask to Buy / Screen Time',
          'After cancel, confirm renewals will stop',
        ];

    return {
      cancelBy: fmt(cancelBy),
      remindOn: fmt(remindOn),
      end: fmt(end),
      yearly,
      title,
      body: bodyLines.join('\n'),
      checklist,
      all: `${title}\n\n${bodyLines.join('\n')}\n`,
    };
  }, [appName, startDate, days, renewPrice, cycle, notes, lang]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1200);
  };
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(t.copied);
    } catch {
      flash(t.copied);
    }
  };

  const loadSample = () => {
    setAppName(lang === 'zh' ? '示例照片增强订阅' : 'Sample photo enhancer sub');
    setStartDate(todayStr);
    setDays('7');
    setRenewPrice('9.99');
    setCycle('week');
    setNotes(lang === 'zh' ? '仅测试；家庭 iPad' : 'Test only; family iPad');
  };
  const clear = () => {
    setAppName('');
    setStartDate(todayStr);
    setDays('7');
    setRenewPrice('');
    setCycle('month');
    setNotes('');
  };

  return (
    <>
      <Hero title={t.title} sub={t.sub} />
      <section className="card">
        <div className="addressTop">
          <div>
            <h3>{t.formTitle}</h3>
            <p>{t.formDesc}</p>
          </div>
        </div>
        <div className="savedGrid">
          <label className="savedCard" style={{ display: 'grid', gap: '0.4rem' }}>
            <span>{t.appName}</span>
            <input value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="App name" />
          </label>
          <label className="savedCard" style={{ display: 'grid', gap: '0.4rem' }}>
            <span>{t.startDate}</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label className="savedCard" style={{ display: 'grid', gap: '0.4rem' }}>
            <span>{t.days}</span>
            <input inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} placeholder="7" />
          </label>
          <label className="savedCard" style={{ display: 'grid', gap: '0.4rem' }}>
            <span>{t.renewPrice}</span>
            <input inputMode="decimal" value={renewPrice} onChange={(e) => setRenewPrice(e.target.value)} placeholder="9.99" />
          </label>
          <label className="savedCard" style={{ display: 'grid', gap: '0.4rem' }}>
            <span>{t.cycle}</span>
            <select value={cycle} onChange={(e) => setCycle(e.target.value)}>
              <option value="week">{t.week}</option>
              <option value="month">{t.month}</option>
              <option value="year">{t.year}</option>
            </select>
          </label>
          <label className="savedCard" style={{ display: 'grid', gap: '0.4rem' }}>
            <span>{t.notes}</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.notesPh} />
          </label>
        </div>
        <div className="savedActions" style={{ marginTop: '0.85rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={loadSample}>{t.sample}</button>
          <button className="danger" onClick={clear}>{t.clear}</button>
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h3>{t.resultTitle}</h3>
        {!packet ? (
          <p>{t.empty}</p>
        ) : (
          <>
            <div className="ipGrid">
              <div className="ipCell"><span>{t.cancelBy}</span><b>{packet.cancelBy}</b></div>
              <div className="ipCell"><span>{t.remindOn}</span><b>{packet.remindOn}</b></div>
              <div className="ipCell"><span>{t.yearlyEst}</span><b>{packet.yearly != null ? packet.yearly.toFixed(2) : '-'}</b></div>
            </div>
            <div style={{ marginTop: '0.9rem' }}>
              <h4>{t.calendarTitle}</h4>
              <p><b>{packet.title}</b></p>
              <div className="savedActions" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => copyText(packet.title)}>{t.copyTitle}</button>
                <button onClick={() => copyText(packet.body)}>{t.copyBody}</button>
                <button onClick={() => copyText(packet.all)}>{t.copyAll}</button>
              </div>
            </div>
            <div style={{ marginTop: '0.9rem' }}>
              <h4>{t.calendarBody}</h4>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{packet.body}</pre>
            </div>
            <div style={{ marginTop: '0.9rem' }}>
              <h4>{t.checklistTitle}</h4>
              <ul>
                {packet.checklist.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </>
        )}
        <p className="contentNote" style={{ marginTop: '0.85rem' }}>{t.tip}</p>
        <p className="contentNote">{t.disclaimer}</p>
        <div className="contentLinks">
          <span>{lang === 'zh' ? '相关阅读' : 'Related reading'}</span>
          <a href="/subcost">{lang === 'zh' ? '订阅成本' : 'Sub cost'}</a>
          <a href="/checklists">{lang === 'zh' ? '决策清单' : 'Checklists'}</a>
          <a href="/articles/free-trial-trap-checklist">{lang === 'zh' ? '试用陷阱' : 'Trial traps'}</a>
          <a href="/articles/cancel-apple-subscription-step-by-step">{lang === 'zh' ? '取消订阅' : 'Cancel subscription'}</a>
        </div>
      </section>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
