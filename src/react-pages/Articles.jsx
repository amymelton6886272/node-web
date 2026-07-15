import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock, Tag } from 'lucide-react';
import { Hero } from '../components/common.jsx';
import { articles, getArticle, getArticlePath } from '../data/articles.js';

const SITE = 'https://souk.eu.org';

function ArticleCard({ article }) {
  return (
    <a className="articleCard card" href={getArticlePath(article)}>
      <span className="articleCategory">{article.category}</span>
      <h2>{article.title}</h2>
      <p>{article.description}</p>
      <div className="articleMeta">
        <span><CalendarDays size={14} /> {article.updatedAt}</span>
        <span><Clock size={14} /> {article.readTime}</span>
      </div>
      <div className="articleTags">{article.tags.map((tag) => <span key={tag}><Tag size={12} /> {tag}</span>)}</div>
    </a>
  );
}

function ArticleDetail({ article }) {
  useEffect(() => {
    if (!article) return;
    let script = document.getElementById('article-ld');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'article-ld';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: { '@type': 'Organization', name: 'Storewise' },
      publisher: { '@type': 'Organization', name: 'Storewise', url: SITE },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${getArticlePath(article)}` },
      articleSection: article.category,
      keywords: article.tags.join(', '),
      inLanguage: 'en',
    });
    return () => {
      script?.remove();
    };
  }, [article]);

  if (!article) {
    return (
      <>
        <Hero title="Article not found" sub="The article you requested is not available." />
        <section className="empty">
          <strong>Try the article index instead.</strong>
          <p><a href="/articles">Open Articles</a></p>
        </section>
      </>
    );
  }

  return (
    <>
      <Hero title={article.title} sub={article.description} />
      <article className="articleDetail card">
        <div className="articleMeta articleMetaTop">
          <span><CalendarDays size={14} /> Updated {article.updatedAt}</span>
          <span><Clock size={14} /> {article.readTime}</span>
          <span>{article.category}</span>
        </div>
        <nav className="articleToc" aria-label="Article sections">
          <strong>On this page</strong>
          {article.sections.map((section, index) => <a key={section.heading} href={`#section-${index}`}>{section.heading}</a>)}
        </nav>
        {article.sections.map((section, index) => (
          <section key={section.heading} id={`section-${index}`}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <div className="articleFooter">
          <a href="/articles">All articles</a>
          <a href="/checklists">Decision checklists</a>
          <a href="/knowledge">Knowledge base</a>
        </div>
      </article>
    </>
  );
}

export default function Articles({ slug }) {
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(articles.map((article) => article.category)))], []);
  const filtered = category === 'All' ? articles : articles.filter((article) => article.category === category);

  if (slug) return <ArticleDetail article={getArticle(slug)} />;

  return (
    <>
      <Hero title="Articles" sub="Practical Apple and App Store research articles written for safer purchasing, privacy, and account decisions." />
      <section className="articleToolbar card">
        <div>
          <h2>Articles</h2>
          <p>Use these articles alongside Storewise tools to understand pricing, subscriptions, privacy labels, app permissions, and account changes before acting.</p>
        </div>
        <div className="tabs">
          {categories.map((item) => <button key={item} className={category === item ? 'on' : ''} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </section>
      <div className="articleGrid">
        {filtered.map((article) => <ArticleCard key={article.slug} article={article} />)}
      </div>
    </>
  );
}
