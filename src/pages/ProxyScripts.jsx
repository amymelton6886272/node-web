import { useMemo, useState } from 'react';
import { profileConfigs } from '../profileData.js';
import { Hero, Empty, ToolIntro } from '../components/common.jsx';
import { ContentSection, contentByPage } from '../components/ContentSection.jsx';
import { useLang } from '../LanguageContext.jsx';

const ALL = 'All';
const RECOMMENDED_NAMES = ['yfamily', 'yfamily轻量版', 'blackmatrix7 广告分流', 'Loyalsoldier Clash Rules', 'xkww3n Rules'];
const TYPE_LABELS_EN = {
  '去广告规则': 'Adblock Rules',
  '复写脚本': 'Rewrite Scripts',
  '网络分流': 'Routing Rules',
};
const NAME_LABELS_EN = {
  'yfamily轻量版': 'yfamily Lite',
  '墨鱼': 'Moyu',
  '可莉 最小配置': 'Keli Minimal',
  '可莉 进阶配置': 'Keli Advanced',
  'yfamily轻量版': 'yfamily Lite',
  '深巷有喵': 'Rabbit Spec',
  'blackmatrix7 广告分流': 'blackmatrix7 Advertising',
  'fmz200 App 去广告插件合集': 'fmz200 App Adblock Plugins',
};
const CATEGORY_ORDER = ['config', 'adblock', 'routing', 'rewrite'];
const CATEGORY_FALLBACK = 'config';

function formatSize(bytes){
  if(!Number.isFinite(bytes) || bytes <= 0) return '';
  if(bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(bytes >= 10240 ? 0 : 1)} KB`;
}

function getLocalizedType(type, lang){
  return lang === 'en' ? (TYPE_LABELS_EN[type] || type) : type;
}

function getLocalizedName(item, lang){
  if(lang === 'en') return NAME_LABELS_EN[item.name] || item.name;
  return item.name;
}

function getItemTitle(item, lang){
  if(lang === 'en') return item.displayNameEn || `${getLocalizedType(item.type, lang)} · ${getLocalizedName(item, lang)}`;
  return item.displayName || `${item.type} · ${item.name}`;
}

function getItemDesc(item, labels, lang){
  if(lang === 'en' && item.descriptionEn) return item.descriptionEn;
  if(item.description || item.descriptionEn) return item.description || item.descriptionEn;
  const size = formatSize(item.size);
  const type = getLocalizedType(item.type, lang);
  const name = getLocalizedName(item, lang);
  const parts = [labels.client?.replace('{client}', type), name && `${labels.source}: ${name}`, size && `${labels.size}: ${size}`].filter(Boolean);
  return parts.join(' · ');
}

function getItemCategory(item){
  return item.category || CATEGORY_FALLBACK;
}

export default function ProxyScripts(){
  const [tab,setTab]=useState(ALL);
  const [q,setQ]=useState('');
  const [filter,setFilter]=useState('all');
  const [sort,setSort]=useState('default');
  const [copied,setCopied]=useState('');
  const {t,lang}=useLang();
  const labels=t.proxy;

  const tabs=useMemo(()=>[ALL,...Array.from(new Set(profileConfigs.map(x=>x.type)))],[]);
  const stats=useMemo(()=>({
    total: profileConfigs.length,
    clients: tabs.length - 1,
    recommended: profileConfigs.filter(x=>RECOMMENDED_NAMES.includes(x.name)).length,
    repos: new Set(profileConfigs.map(x=>x.repo).filter(Boolean)).size,
  }),[tabs.length]);

  const list=useMemo(()=>{
    const keyword=q.trim().toLowerCase();
    return profileConfigs
      .filter(item=>tab===ALL||item.type===tab)
      .filter(item=>filter==='all'||(filter==='recommended'?RECOMMENDED_NAMES.includes(item.name):filter==='lite'?/轻量|lite/i.test(`${item.name} ${item.url}`):getItemCategory(item)===filter))
      .filter(item=>!keyword||`${item.name} ${item.type} ${item.displayName||''} ${item.displayNameEn||''} ${item.description||''} ${item.descriptionEn||''}`.toLowerCase().includes(keyword))
      .sort((a,b)=>{
        if(sort==='stars') return (b.stars||0)-(a.stars||0);
        if(sort==='updated') return String(b.updatedAt||'').localeCompare(String(a.updatedAt||''));
        if(sort==='name') return getItemTitle(a, lang).localeCompare(getItemTitle(b, lang), lang || undefined);
        if(sort==='sizeAsc') return (a.size||0)-(b.size||0);
        if(sort==='sizeDesc') return (b.size||0)-(a.size||0);
        return (CATEGORY_ORDER.indexOf(getItemCategory(a))-CATEGORY_ORDER.indexOf(getItemCategory(b))) || a.id-b.id;
      });
  },[tab,q,filter,sort,lang]);

  const copy=async(text,label)=>{
    try{
      await navigator.clipboard.writeText(text);
      setCopied(`${labels.copied}: ${label}`);
    }catch{
      setCopied(labels.copyFailed);
    }
    setTimeout(()=>setCopied(''),1500);
  };

  return <>
 <Hero title={labels.title} sub={labels.sub}/>
 <ToolIntro page="proxy"/>
 <ContentSection {...contentByPage.proxy}/>

 <div className="proxySummary">
      <div><b>{stats.total}</b><span>{labels.total}</span></div>
      <div><b>{stats.clients}</b><span>{labels.clients}</span></div>
      <div><b>{stats.repos}</b><span>{labels.repos}</span></div>
    </div>

    <div className="toolbar proxyToolbar">
      <div className="tabs">
        {tabs.map(tabName=><button key={tabName} className={tab===tabName?'on':''} onClick={()=>setTab(tabName)}>{tabName===ALL?labels.all:getLocalizedType(tabName, lang)}</button>)}
      </div>
      <span className="meta">{labels.matched.replace('{count}', list.length)}</span>
    </div>

    <div className="searchbar proxySearchbar">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder={labels.placeholder}/>
      <select value={filter} onChange={e=>setFilter(e.target.value)} aria-label={labels.filter}>
        <option value="all">{labels.filterAll}</option>
        <option value="recommended">{labels.filterRecommended}</option>
        <option value="adblock">{labels.filterAdblock}</option>
        <option value="routing">{labels.filterRouting}</option>
        <option value="rewrite">{labels.filterRewrite}</option>
        <option value="lite">{labels.filterLite}</option>
      </select>
      <select value={sort} onChange={e=>setSort(e.target.value)} aria-label={labels.sort}>
        <option value="default">{labels.sortDefault}</option>
        <option value="updated">{labels.sortUpdated}</option>
        <option value="stars">{labels.sortStars}</option>
        <option value="name">{labels.sortName}</option>
        <option value="sizeAsc">{labels.sortSmall}</option>
        <option value="sizeDesc">{labels.sortLarge}</option>
      </select>
      <button onClick={()=>{setQ('');setFilter('all');setSort('default')}}>{labels.clear}</button>
    </div>

    {copied&&<div className="toast">{copied}</div>}

    <div className="configGrid">
      {list.map(item=>{
        const title=getItemTitle(item, lang);
        const recommended=RECOMMENDED_NAMES.includes(item.name);
        const categoryLabel=labels[`category_${getItemCategory(item)}`] || item.type;
        return <div className="configCard" key={item.id}>
          <div>
            <div className="configBadges">
              <span className="configType">{getLocalizedType(item.type, lang)}</span>
              <span className="configType neutral">{categoryLabel}</span>
              {recommended&&<span className="configType soft">{labels.badgeRecommended}</span>}
            </div>
            <h3>{title}</h3>
            <p>{getItemDesc(item, labels, lang)}</p>
            {(item.repo || item.updatedAt || item.stars)&&<div className="configMeta">
              {item.repo&&<span>GitHub: {item.repo}</span>}
              {item.stars&&<span>★ {item.stars.toLocaleString()}</span>}
              {item.updatedAt&&<span>{labels.updated}: {item.updatedAt}</span>}
            </div>}
            <code className="configUrl">{item.url}</code>
          </div>
          <div className="configActions">
            <a href={item.url} target="_blank" rel="noreferrer">{labels.open}</a>
            <button onClick={()=>copy(item.url,title)}>{labels.copyLink}</button>
          </div>
        </div>;
      })}
    </div>
    {list.length===0&&<Empty text={labels.noMatch}/>}
  </>;
}
