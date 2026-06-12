import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Hero } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { useLang } from '../LanguageContext.jsx';
import { getRiskLevel, riskContent } from '../data/appRiskRules.js';

function categoryScores(selected, questions, categories) {
  const out = Object.fromEntries(Object.keys(categories).map((key) => [key, 0]));
  for (const q of questions) if (selected[q.id]) out[q.category] += q.weight;
  return out;
}

export default function AppRisk() {
  const { lang } = useLang();
  const content = riskContent[lang] || riskContent.en;
  const page = content.page;
  const questions = content.questions;
  const categories = content.categories;
  const [selected, setSelected] = useState({});
  const [appName, setAppName] = useState('');
  const active = questions.filter((q) => selected[q.id]);
  const score = Math.min(100, active.reduce((sum, q) => sum + q.weight, 0));
  const level = getRiskLevel(score, lang);
  const byCategory = useMemo(() => categoryScores(selected, questions, categories), [selected, questions, categories]);
  const sortedCategories = Object.entries(byCategory).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);

  const toggle = (id) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  const reset = () => { setSelected({}); setAppName(''); };

  return (
    <>
      <Hero title={page.heroTitle} sub={page.heroSub} />
      <ContentSection title={page.title} intro={page.intro} items={page.items} links={page.links} linksLabel={page.linksLabel} />

      <section className="riskPanel card">
        <div className="riskInput">
          <div>
            <h2>{page.startTitle}</h2>
            <p>{page.startText}</p>
          </div>
          <input value={appName} onChange={(e) => setAppName(e.target.value)} placeholder={page.placeholder} />
        </div>

        <div className={`riskScore ${level.className}`}>
          <div>
            <span>{appName || page.currentApp}</span>
            <b>{score}</b>
            <em>{page.scoreOf}</em>
          </div>
          <section>
            <h3>{level.label}</h3>
            <p>{level.summary}</p>
          </section>
        </div>

        <div className="riskCategoryBars">
          {Object.entries(categories).map(([key, label]) => {
            const value = byCategory[key] || 0;
            return <div key={key}><span>{label}</span><i><b style={{ width: `${Math.min(100, value * 4)}%` }} /></i><em>{value}</em></div>;
          })}
        </div>
      </section>

      <section className="riskQuestions">
        {questions.map((q) => (
          <article className={selected[q.id] ? 'riskQuestion on card' : 'riskQuestion card'} key={q.id}>
            <button onClick={() => toggle(q.id)} aria-label="toggle risk signal">
              {selected[q.id] ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            </button>
            <div>
              <div className="riskQuestionHead"><h3>{q.title}</h3><span>{categories[q.category]} · +{q.weight}</span></div>
              <p>{q.description}</p>
              <small>{q.advice}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="riskResult card">
        <div className="riskResultHead"><ShieldCheck size={24} /><div><h2>{page.resultTitle}</h2><p>{page.resultText}</p></div></div>
        {active.length === 0 ? (
          <p>{page.noSignals}</p>
        ) : (
          <>
            <div className="riskSummary">
              <b>{level.label}</b>
              <span>{level.summary}</span>
            </div>
            {sortedCategories.length > 0 && <div className="riskFocus"><h3>{page.focus}</h3>{sortedCategories.map(([key, value]) => <span key={key}>{categories[key]}: {value}</span>)}</div>}
            <ul>{active.slice(0, 5).map((q) => <li key={q.id}>{q.advice}</li>)}</ul>
          </>
        )}
        <div className="riskActions"><a href="/checklists" onClick={e=>{e.preventDefault();history.pushState({},'','/checklists');window.dispatchEvent(new PopStateEvent('popstate'))}}>{page.openChecklists}</a><a href="/iap" onClick={e=>{e.preventDefault();history.pushState({},'','/iap');window.dispatchEvent(new PopStateEvent('popstate'))}}>{page.checkIap}</a><a href="/guides" onClick={e=>{e.preventDefault();history.pushState({},'','/guides');window.dispatchEvent(new PopStateEvent('popstate'))}}>{page.readGuides}</a><button onClick={reset}>{page.reset}</button></div>
      </section>
    </>
  );
}
