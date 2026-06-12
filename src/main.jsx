import React, {useEffect, useMemo, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { Moon, Sun, Languages, Search } from 'lucide-react';
import './style.css';
import { LanguageProvider, useLang } from './LanguageContext.jsx';
import { enabledFeatureIds, features } from './navigation.jsx';
import Home from './pages/Home.jsx';
import Accounts from './pages/Accounts.jsx';
import Price from './pages/Price.jsx';
import AppFree from './pages/AppFree.jsx';
import IpCheck from './pages/IpCheck.jsx';
import Iap from './pages/Iap.jsx';
import IconSearch from './pages/IconSearch.jsx';
import ProxyScripts from './pages/ProxyScripts.jsx';
import AddressGenerator from './pages/AddressGenerator.jsx';
import Guides from './pages/Guides.jsx';
import Glossary from './pages/Glossary.jsx';
import Checklists from './pages/Checklists.jsx';
import AppRisk from './pages/AppRisk.jsx';
import KnowledgeHub from './pages/KnowledgeHub.jsx';
import { About, Disclaimer, Privacy, Contact } from './pages/Legal.jsx';
import { SearchModal } from './components/common.jsx';
import { Head, Breadcrumb } from './components/Seo.jsx';

const featureRoutes = {
 accounts: Accounts,
 price: Price,
 appfree: AppFree,
 ip: IpCheck,
 address: AddressGenerator,
 iap: Iap,
 icon: IconSearch,
 proxy: ProxyScripts,
 guides: Guides,
 glossary: Glossary,
 checklists: Checklists,
 risk: AppRisk,
 knowledge: KnowledgeHub,
};

const staticRoutes = {
 home: Home,
 about: About,
 disclaimer: Disclaimer,
 privacy: Privacy,
 contact: Contact,
};

function getPageFromPath(path) {
  const segment = (path || '/').replace(/^\//, '').split('/')[0] || 'home';
  return staticRoutes[segment] || enabledFeatureIds.has(segment) ? segment : 'home';
}

function normalizePage(value) {
  const page = value || 'home';
  return staticRoutes[page] || enabledFeatureIds.has(page) ? page : 'home';
}

function pushRoute(page) {
  const path = page === 'home' ? '/' : '/' + page;
  if (location.pathname !== path) {
    history.pushState({ page }, '', path);
  }
}

function navigateTo(page) {
  pushRoute(page);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function Layout(){
 const [page,setPage]=useState(()=>getPageFromPath(location.pathname));
 const [dark,setDark]=useState(false);const [searchOpen,setSearchOpen]=useState(false);
 const {lang,toggle,t}=useLang();
 const routes = useMemo(() => ({...Object.fromEntries(Object.entries(featureRoutes).filter(([id]) => enabledFeatureIds.has(id))), ...staticRoutes}), []);
 useEffect(()=>{document.body.classList.toggle('dark',dark)},[dark]);useEffect(()=>{const h=e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setSearchOpen(v=>!v)}};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)},[]);
 useEffect(()=>{const f=()=>setPage(getPageFromPath(location.pathname)); addEventListener('popstate',f); return()=>removeEventListener('popstate',f)},[]);
 const Current = routes[page] || Home;
 const currentPath = page === 'home' ? '/' : '/' + page;
 return <><Head route={currentPath} /><header className="top"><a className="brand" href="/" onClick={e=>{e.preventDefault();navigateTo("home")}}><span className="logo" aria-label="Wolffy logo">W</span><b>Wolffy</b></a><nav className="toplinks"><a href="/" onClick={e=>{e.preventDefault();navigateTo("home")}}>{t.header.home}</a><a href="/about" onClick={e=>{e.preventDefault();navigateTo("about")}}>{t.header.about}</a><a href="/contact" onClick={e=>{e.preventDefault();navigateTo("contact")}}>{t.header.contact}</a><a href="/disclaimer" onClick={e=>{e.preventDefault();navigateTo("disclaimer")}}>{t.header.disclaimer}</a><a href="/privacy" onClick={e=>{e.preventDefault();navigateTo("privacy")}}>{t.header.privacy}</a></nav><div className="headerActions"><button className="searchBtn" onClick={()=>setSearchOpen(true)} title="Search (Ctrl+K)"><Search size={16}/></button><button className="lang" onClick={toggle} title="Switch language"><Languages size={16}/><span>{lang==='zh'?'EN':'中'}</span></button><button className="theme" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button></div></header><div className="shell"><aside>{features.map(({id,Icon})=><a key={id} className={page===id?'active':''} href={`/${id}`} onClick={e=>{e.preventDefault();navigateTo(id)}}><Icon size={17}/>{t.nav[id]}</a>)}</aside><main><Breadcrumb route={currentPath} /><Current /></main></div><footer><span>{t.footer.builtWith}</span><span>Wolffy © 2026 · {t.footer.lastUpdated} · {t.footer.contact}: <a href="https://t.me/Wolffy_chat_bot" target="_blank" rel="noreferrer">@Wolffy_chat_bot</a> · <a href="/disclaimer" onClick={e=>{e.preventDefault();navigateTo("disclaimer")}}>{t.footer.disclaimer}</a> · <a href="/privacy" onClick={e=>{e.preventDefault();navigateTo("privacy")}}>{t.footer.privacy}</a></span></footer><SearchModal open={searchOpen} onClose={()=>setSearchOpen(false)}/></>
}

createRoot(document.getElementById('root')).render(<LanguageProvider><Layout/></LanguageProvider>);
// cache-bust 1781257669
