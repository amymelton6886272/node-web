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
import { About, Disclaimer, Privacy } from './pages/Legal.jsx';
import { SearchModal } from './components/common.jsx';

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
};

function normalizePage(value){
 const page = value || 'home';
 return staticRoutes[page] || enabledFeatureIds.has(page) ? page : 'home';
}

function Layout(){
 const [page,setPage]=useState(()=>normalizePage(location.hash.replace('#','')));
 const [dark,setDark]=useState(false);const [searchOpen,setSearchOpen]=useState(false);
 const {lang,toggle,t}=useLang();
 const routes = useMemo(() => ({...Object.fromEntries(Object.entries(featureRoutes).filter(([id]) => enabledFeatureIds.has(id))), ...staticRoutes}), []);
 useEffect(()=>{document.body.classList.toggle('dark',dark)},[dark]);useEffect(()=>{const h=e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setSearchOpen(v=>!v)}};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)},[]);
 useEffect(()=>{const f=()=>setPage(normalizePage(location.hash.replace('#',''))); addEventListener('hashchange',f); return()=>removeEventListener('hashchange',f)},[]);
 const Current = routes[page] || Home;
 return <><header className="top"><a className="brand" href="#home"><span className="logo" aria-label="Wolffy logo">W</span><b>Wolffy</b></a><nav className="toplinks"><a href="#home">{t.header.home}</a><a href="#about">{t.header.about}</a><a href="https://t.me/Wolffy_chat_bot" target="_blank" rel="noreferrer">{t.header.contact}</a><a href="#disclaimer">{t.header.disclaimer}</a><a href="#privacy">{t.header.privacy}</a><a href="https://hub.souk.eu.org/" target="_blank" rel="noreferrer">{t.header.hub}</a></nav><div className="headerActions"><button className="searchBtn" onClick={()=>setSearchOpen(true)} title="Search (Ctrl+K)"><Search size={16}/></button><button className="lang" onClick={toggle} title="Switch language"><Languages size={16}/><span>{lang==='zh'?'EN':'中'}</span></button><button className="theme" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button></div></header><div className="shell"><aside>{features.map(({id,Icon})=><a key={id} className={page===id?'active':''} href={'#'+id}><Icon size={17}/>{t.nav[id]}</a>)}</aside><main><Current /></main></div><footer><span>{t.footer.builtWith}</span><span>Wolffy © 2026 · {t.footer.contact}: <a href="https://t.me/Wolffy_chat_bot" target="_blank" rel="noreferrer">@Wolffy_chat_bot</a> · <a href="#disclaimer">{t.footer.disclaimer}</a> · <a href="#privacy">{t.footer.privacy}</a></span></footer><SearchModal open={searchOpen} onClose={()=>setSearchOpen(false)}/></>
}

createRoot(document.getElementById('root')).render(<LanguageProvider><Layout/></LanguageProvider>);
