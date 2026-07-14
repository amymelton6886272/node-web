import { useMemo, useState, useEffect } from 'react';
import { AdBanner } from '../components/AdBanner.jsx';
import { BookOpen, ChevronDown, ChevronUp, Clock, ListChecks } from 'lucide-react';
import { Hero } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { useLang } from '../LanguageContext.jsx';
import { knowledgeContent } from '../data/knowledgeHub.js';

const SITE = 'https://souk.eu.org';

export default function KnowledgeHub() {
  const { lang } = useLang();
  const content = knowledgeContent[lang] || knowledgeContent.en;
  const page = content.page;
  const [category, setCategory] = useState('all');
  const [open, setOpen] = useState({ [content.articles[0].id]: true });
  const articles = useMemo(() => content.articles.filter((a) => category === 'all' || a.category === category), [category, content.articles]);
  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  // Inject Article structured data for all knowledge articles
  useEffect(() => {
    if (!content.articles?.length) return;
    const existing = document.querySelectorAll('script[data-kb-schema]');
    existing.forEach(el => el.remove());
    content.articles.forEach((article, i) => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.summary,
        author: { '@type': 'Organization', name: 'Storewise' },
        publisher: { '@type': 'Organization', name: 'Storewise', url: SITE },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/knowledge` },
        articleSection: article.category || 'Knowledge Base',
        inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-kb-schema', `${i}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [content.articles, lang]);

  return (
    <>
      <Hero title={page.heroTitle} sub={page.heroSub} />

      <section className="knowledgeToolbar card">
        <div>
          <h2>{page.chooseTitle}</h2>
          <p>{page.chooseText}</p>
        </div>
        <div className="tabs">
          {content.categories.map((cat) => <button key={cat.id} className={category === cat.id ? 'on' : ''} onClick={() => setCategory(cat.id)}>{cat.label}</button>)}
        </div>
      </section>

      <div className="knowledgeList">
        {articles.map((article) => {
          const isOpen = open[article.id];
          const catLabel = content.categories.find((c) => c.id === article.category)?.label || page.fallbackCategory;
          return (
            <article className="knowledgeArticle card" key={article.id} id={article.id}>
              <button className="knowledgeHead" onClick={() => toggle(article.id)}>
                <span className="knowledgeIcon"><BookOpen size={24} /></span>
                <span className="knowledgeTitle"><b>{article.title}</b><em><Clock size={13} /> {article.readTime} · {catLabel}</em></span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <p className="knowledgeSummary">{article.summary}</p>
              {isOpen && (
                <div className="knowledgeBody">
                  <nav className="knowledgeToc">
                    <strong>{page.toc}</strong>
                    {article.sections.map((s, i) => <a key={i} href={`#${article.id}-s${i}`}>{s.heading}</a>)}
                  </nav>
                  {article.sections.map((section, i) => (
                    <section key={i} id={`${article.id}-s${i}`}>
                      <h3>{section.heading}</h3>
                      <p>{section.text}</p>
                    </section>
                  ))}
                  <AdBanner />
                  <div className="knowledgeChecklist">
                    <h3><ListChecks size={18} /> {page.checklist}</h3>
                    <ul>{article.checklist.map((item, i) => <li key={i}>{item}</li>)}</ul>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <ContentSection title={page.title} intro={page.intro} items={page.items} links={page.links} linksLabel={page.linksLabel} />
    </>
  );
}
