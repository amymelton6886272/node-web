import { useState } from 'react';
import { Hero } from '../components/common.jsx';
import { useLang } from '../LanguageContext.jsx';
import { LANGS } from '../i18n.js';
import { Search, BookOpen } from 'lucide-react';

export default function Glossary() {
  const { t } = useLang();
  const data = (t.glossary && typeof t.glossary === 'object' && t.glossary.terms?.length)
    ? t.glossary
    : { ...(t.glossary || {}), ...LANGS.en.glossary };
  const glossary = data;
  const terms = glossary?.terms || [];
  const [q, setQ] = useState('');

  const filtered = q.trim()
    ? terms.filter(
        (item) =>
          item.term.toLowerCase().includes(q.toLowerCase()) ||
          item.def.toLowerCase().includes(q.toLowerCase())
      )
    : terms;

  // Group by first letter
  const grouped = {};
  for (const item of filtered) {
    const letter = item.term[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(item);
  }

  return (
    <>
      <Hero
        title={glossary?.title || 'Glossary'}
        sub={glossary?.sub || 'Essential App Store terminology'}
      />
      <div className="glossarySearch">
        <Search size={18} className="glossarySearchIcon" />
        <input
          type="text"
          placeholder={t.search?.placeholder || 'Search terms...'}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="glossaryField"
        />
        {q && (
          <span className="glossaryCount">
            {filtered.length} / {terms.length}
          </span>
        )}
      </div>
      {Object.keys(grouped)
        .sort()
        .map((letter) => (
          <section className="glossaryGroup card" key={letter}>
            <h2 className="glossaryLetter">{letter}</h2>
            <dl className="glossaryList">
              {grouped[letter].map((item, i) => (
                <div className="glossaryTerm" key={i}>
                  <dt>
                    <BookOpen size={14} />
                    {item.term}
                  </dt>
                  <dd>{item.def}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      {filtered.length === 0 && (
        <div className="empty">
          {t.search?.empty || 'No matching terms found'}
        </div>
      )}
    </>
  );
}
