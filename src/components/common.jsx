import { useState, useEffect, useMemo, useRef } from 'react';
import { ShieldAlert, Search } from 'lucide-react';
import { useLang } from '../LanguageContext.jsx';
import { AdBanner } from './AdBanner.jsx';

export function Hero({title,sub,eyebrow}){const {t}=useLang(); return <section className="hero"><div className="heroInner"><p className="eyebrow">{eyebrow || t.home.eyebrow}</p><h1>{title}</h1>{sub ? <p className="heroSub">{sub}</p> : null}</div></section>}
export function Notice(){const {t}=useLang(); return <div className="notice"><ShieldAlert size={18}/><span>{t.notice.security}</span></div>}
export function Empty({text}){const {lang}=useLang();return <div className="empty"><strong>{text}</strong><p>{lang==='zh'?'当前没有可展示的结果。你仍然可以阅读本页的使用说明、限制说明和相关指南，或更换关键词后再次查询。':'No results are available right now. You can still read this page’s explanation, limitations, and related guides, or try another keyword.'}</p></div>}

export function FeaturedApps({onSelect}) {
  const { t } = useLang();
  const trending = t.trending;
  const apps = trending?.apps || [];
  if (!apps.length) return null;

  return (
    <section className="featuredApps card">
      <h3>{trending.heading}</h3>
      <p className="featuredSub">{trending.sub}</p>
      <div className="featuredGrid">
        {apps.map((app, i) => (
          <button key={i} className="featuredApp" onClick={() => onSelect(app.name)}>
            {app.icon
              ? <img className="featuredIcon" src={app.icon} alt="" loading="lazy" width="60" height="60" />
              : <span className="featuredLetter">{app.name[0]}</span>
            }
            <span className="featuredName">{app.name}</span>
            <span className="featuredDev">{app.dev}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

const relatedPages={price:['appfree','subcost','guides','glossary'],appfree:['price','iap','guides','glossary'],iap:['price','appfree','icon','guides'],icon:['iap','guides'],subcost:['price','trial','checklists'],trial:['subcost','checklists','price']};export function ToolIntro({page}){const {t}=useLang(); const data=t[page]; const intro=data?.intro; const tips=data?.tips; const how=data?.howItWorks; const ts=data?.troubleshooting; const rel=relatedPages[page]; if(!intro&&!tips&&!how&&!ts&&!rel)return null; return <section className="toolIntro card">{intro&&<><h3>{intro.heading}</h3>{[intro.p1,intro.p2,intro.p3,intro.p4].map((p,i)=><p key={i}>{p}</p>)}</>}{intro&&(tips||how||ts)&&<AdBanner/>}{how&&<div className="toolHow"><h3>{how.heading}</h3>{[how.p1,how.p2,how.p3].map((p,i)=><p key={i}>{p}</p>)}</div>}{tips&&<div className="toolTips"><h3>{tips.heading}</h3><ul>{tips.items.map((tip,i)=><li key={i}>{tip}</li>)}</ul></div>}{ts&&<div className="toolTrouble"><h3>{ts.heading}</h3><ul>{ts.items.map((item,i)=><li key={i}>{item}</li>)}</ul></div>}{rel&&<div className="toolRelated"><span>{t.search?.categories?.guides||'See also'}:</span>{rel.map(id=>{const href='/'+id;return <a key={id} href={href}>{t.nav?.[id]||t.glossary?.title||id}</a>})}</div>}</section>}

function buildSearchIndex(t){
  const items=[];
  const toolIds=['price','appfree','iap','icon','subcost','trial','checklists','risk','knowledge'];
  for(const id of toolIds){const p=t[id];if(!p)continue;const title=p.title||t.nav?.[id]||id;
    if(p.intro){const txt=[p.intro.p1,p.intro.p2,p.intro.p3,p.intro.p4].filter(Boolean).join(' ');items.push({title,url:'/'+id,text:txt,category:title});}
    if(p.tips?.items?.length)items.push({title:title+' · Tips',url:'/'+id,text:p.tips.items.join(' '),category:title});
    if(p.howItWorks){const txt=[p.howItWorks.p1,p.howItWorks.p2,p.howItWorks.p3].filter(Boolean).join(' ');items.push({title:title+' · How It Works',url:'/'+id,text:txt,category:title});}
    if(p.troubleshooting?.items?.length)items.push({title:title+' · FAQ',url:'/'+id,text:p.troubleshooting.items.join(' '),category:title});}
  if(t.guides?.articles)for(const a of t.guides.articles){const txt=a.title+' '+(a.sections||[]).map(s=>s.heading+' '+s.text).join(' ');items.push({title:a.title,url:'/guides',text:txt,category:t.search?.categories?.guides||'Guides'});}
  if(t.glossary?.terms)for(const g of t.glossary.terms)items.push({title:g.term,url:'/glossary',text:g.term+' '+g.def,category:t.glossary.title||'Glossary'});
  if(t.home){const why=[t.home.whyP1,t.home.whyP2,t.home.whyP3].filter(Boolean).join(' ');items.push({title:t.home.title||'Home',url:'/',text:why+' '+t.home.sub,category:'Home'});
    if(t.home.faq)for(const f of t.home.faq)items.push({title:f.q,url:'/',text:f.q+' '+f.a,category:t.search?.categories?.faq||'FAQ'});
    if(t.home.updates)for(const u of t.home.updates)items.push({title:u.text.slice(0,60),url:'/',text:u.text,category:t.search?.categories?.updates||'Updates'});}
  if(t.homeDesc)for(const[id,desc]of Object.entries(t.homeDesc))if(typeof desc==='string')items.push({title:t.nav?.[id]||id,url:'/'+id,text:desc,category:t.search?.categories?.tools||'Tools'});
  return items;
}

export function SearchModal({open,onClose}){const {t}=useLang();const[q,setQ]=useState('');const inp=useRef(null);const idx=useMemo(()=>buildSearchIndex(t),[t]);const results=useMemo(()=>{if(!q.trim())return[];const lq=q.toLowerCase();return idx.filter(r=>r.text.toLowerCase().includes(lq)||r.title.toLowerCase().includes(lq)).slice(0,10)},[q,idx]);
  useEffect(()=>{if(open){setQ('');const tm=setTimeout(()=>inp.current?.focus(),100);return()=>clearTimeout(tm)}},[open]);
  useEffect(()=>{const h=e=>{if(e.key==='Escape'&&open)onClose()};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)},[open,onClose]);
  if(!open)return null;
  return <div className="searchOverlay" onClick={onClose}><div className="searchModal" onClick={e=>e.stopPropagation()}><div className="searchBox"><Search size={18} className="searchIcon"/><input ref={inp} type="text" value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search?.placeholder||'Search...'} className="searchField"/><kbd>esc</kbd></div>{q&&results.length>0&&<div className="searchResults">{results.map((r,i)=><a key={i} className="searchItem" href={r.url.replace('#','/')} onClick={onClose}><span className="searchCat">{r.category}</span><span className="searchTitle">{r.title}</span></a>)}</div>}{q&&results.length===0&&<div className="searchEmpty">{t.search?.empty||'No results found'}</div>}</div></div>;
}
