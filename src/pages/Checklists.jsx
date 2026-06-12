import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardList, DollarSign, Globe, Lock, Shield } from 'lucide-react';
import { Hero } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { useLang } from '../LanguageContext.jsx';
import { checklistContent } from '../data/checklists.js';

const icons = { ClipboardList, DollarSign, Globe, Lock, Shield };

export default function Checklists() {
  const { lang } = useLang();
  const content = checklistContent[lang] || checklistContent.en;
  const page = content.page;
  const [category, setCategory] = useState('all');
  const [completed, setCompleted] = useState({});
  const list = useMemo(() => content.checklists.filter((item) => category === 'all' || item.category === category), [category, content.checklists]);

  const toggle = (id, index) => {
    const key = `${id}-${index}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getProgress = (item) => {
    const done = item.items.filter((_, i) => completed[`${item.id}-${i}`]).length;
    return { done, total: item.items.length, pct: Math.round((done / item.items.length) * 100) };
  };

  const reset = (id) => {
    setCompleted((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(`${id}-`))));
  };

  return (
    <>
      <Hero title={page.heroTitle} sub={page.heroSub} />
      <ContentSection title={page.title} intro={page.intro} items={page.items} links={page.links} linksLabel={page.linksLabel} />
      <div className="checkToolbar card">
        <div>
          <h2>{page.toolbarTitle}</h2>
          <p>{page.toolbarText}</p>
        </div>
        <div className="tabs">
          {content.categories.map((cat) => (
            <button key={cat.id} className={category === cat.id ? 'on' : ''} onClick={() => setCategory(cat.id)}>{cat.label}</button>
          ))}
        </div>
      </div>

      <div className="checklistGrid">
        {list.map((item) => {
          const Icon = icons[item.icon] || ClipboardList;
          const progress = getProgress(item);
          return (
            <article className="checkCard card" key={item.id}>
              <div className="checkHead">
                <div className="checkIcon"><Icon size={26} /></div>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <span>{item.minutes} {page.minutes} · {progress.done}/{progress.total} {page.completed}</span>
                </div>
              </div>
              <div className="progress"><i style={{ width: `${progress.pct}%` }} /></div>
              <ol className="checkItems">
                {item.items.map((text, i) => {
                  const key = `${item.id}-${i}`;
                  return (
                    <li key={i} className={completed[key] ? 'done' : ''}>
                      <button onClick={() => toggle(item.id, i)} aria-label="toggle checklist item"><CheckCircle2 size={18} /></button>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ol>
              <div className="pitfalls">
                <h3>{page.pitfalls}</h3>
                <ul>{item.pitfalls.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>
              <div className="checkFoot">
                <div>{item.related.map((id) => {
                  const href = '/' + id;
                  return <a key={id} href={href} onClick={e => { e.preventDefault(); history.pushState({}, '', href); window.dispatchEvent(new PopStateEvent('popstate')); }}>#{id}</a>;
                })}</div>
                <button onClick={() => reset(item.id)}>{page.reset}</button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
