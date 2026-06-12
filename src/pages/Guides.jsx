import { useState } from 'react';
import { Hero } from '../components/common.jsx';
import { useLang } from '../LanguageContext.jsx';
import { LANGS } from '../i18n.js';
import { BookOpen, Smartphone, DollarSign, Search, Shield, Star, Users, Globe, Clock, List } from 'lucide-react';

const icons = { BookOpen, Smartphone, DollarSign, Search, Shield, Star, Users, Globe };

function wordCount(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function readTime(words) {
  const min = Math.max(1, Math.ceil(words / 200));
  return min === 1 ? '1 min read' : `${min} min read`;
}

export default function Guides() {
  const { t } = useLang();
  const data = (t.guides && typeof t.guides === 'object' && t.guides.articles?.length)
    ? t.guides
    : { ...(t.guides || {}), ...LANGS.en.guides };
  const guides = data?.articles || [];
  const [expanded, setExpanded] = useState({});

  const toggleArticle = (i) => {
    setExpanded((prev) => {
      const next = { ...prev };
      if (next[i]) {
        delete next[i];
      } else {
        next[i] = true;
        // Scroll to article after render
        setTimeout(() => {
          const el = document.getElementById(`guide-${i}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      return next;
    });
  };

  return (
    <>
      <Hero
        title={data?.title || 'App Store Guides'}
        sub={data?.sub || 'Practical tips for getting the most out of the App Store'}
      />
      <div className="guidesList">
        {guides.map((g, i) => {
          const Icon = icons[g.icon] || BookOpen;
          const isOpen = expanded[i] || false;
          const totalWords =
            (g.sections || []).reduce(
              (sum, s) => sum + wordCount(s.heading) + wordCount(s.text),
              0
            ) + wordCount(g.title);
          const time = readTime(totalWords);

          return (
            <article className="guideCard card" key={i} id={`guide-${i}`}>
              <div
                className="guideHead guideHeadClickable"
                onClick={() => toggleArticle(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleArticle(i);
                }}
              >
                <div className="guideIcon">
                  <Icon size={28} />
                </div>
                <div className="guideHeadText">
                  <h2>{g.title}</h2>
                  <span className="guideMeta">
                    {g.date} &middot; <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {time}
                    {g.sections && (
                      <> &middot; <List size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {g.sections.length} sections</>
                    )}
                  </span>
                </div>
                <button className="guideToggle" aria-expanded={isOpen}>
                  {isOpen ? '\u25B2' : '\u25BC'}
                </button>
              </div>

              {isOpen && g.sections && (
                <>
                  {/* Table of Contents */}
                  <nav className="guideToc">
                    <h4>On this page</h4>
                    <ul>
                      {g.sections.map((s, j) => (
                        <li key={j}>
                          <a
                            href={`#guide-${i}-s${j}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const el = document.getElementById(`guide-${i}-s${j}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                          >
                            {s.heading}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Article Body */}
                  <div className="guideBody">
                    {g.sections.map((s, j) => (
                      <div key={j} id={`guide-${i}-s${j}`}>
                        {s.heading && <h3>{s.heading}</h3>}
                        <p>{s.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Related Links Footer */}
                  <div className="guideRelated">
                    <span>Explore more:</span>
                    <a href="/glossary" onClick={e=>{e.preventDefault();location.pushState({},'','/glossary');window.dispatchEvent(new PopStateEvent('popstate'))}}>App Store Glossary</a>
                    <a href="/price" onClick={e=>{e.preventDefault();location.pushState({},'','/price');window.dispatchEvent(new PopStateEvent('popstate'))}}>Price Compare Tool</a>
                    <a href="/appfree" onClick={e=>{e.preventDefault();location.pushState({},'','/appfree');window.dispatchEvent(new PopStateEvent('popstate'))}}>Free Apps</a>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
