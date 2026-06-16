import { useState } from 'react';
import { Hero, Empty, ToolIntro, FeaturedApps } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { toolContent } from '../data/toolContent.js';
import { useLang } from '../LanguageContext.jsx';

export default function IconSearch(){
 const [q,setQ]=useState('');
 const [country,setCountry]=useState('us');
 const [state,setState]=useState({loading:false,data:[],error:null,searched:false});
 const [copied,setCopied]=useState('');
 const {t,lang}=useLang(); const content=toolContent[lang]?.icon||toolContent.en.icon;
 const search = async (keyword) => {
   const term = (keyword !== undefined ? keyword : q).trim();
   if (!term) return;
   setQ(term);
   setState({loading:true,data:[],error:null,searched:true});
   try{
     const url=`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&country=${country}&entity=software&limit=24`;
     const res=await fetch(url);
     if(!res.ok) throw new Error(res.status+' '+res.statusText);
     const json=await res.json();
     setState({loading:false,data:json.results||[],error:null,searched:true});
   }catch(error){
     setState({loading:false,data:[],error:String(error),searched:true});
   }
 };
 const copy=async(text,label)=>{await navigator.clipboard.writeText(text); setCopied(label); setTimeout(()=>setCopied(''),1300)};
 const iconUrl=app=>(app.artworkUrl512||app.artworkUrl100||'').replace(/\d+x\d+bb\.(jpg|png|webp)$/,'1024x1024bb.$1');
 return <>
 <Hero title={t.icon.title} sub={t.icon.sub}/>
 <div className="searchbar iconSearchbar">
    <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')search()}} placeholder={t.icon.placeholder}/>
    <select value={country} onChange={e=>setCountry(e.target.value)}>
      <option value="us">United States</option><option value="cn">China</option><option value="jp">Japan</option><option value="hk">Hong Kong</option><option value="tw">Taiwan</option><option value="gb">United Kingdom</option><option value="kr">Korea</option>
    </select>
    <button onClick={search} disabled={state.loading}>{state.loading?t.icon.searching:t.icon.search}</button>
  </div>
  {copied&&<div className="toast">Copied: {copied}</div>}
  {state.error&&<p className="err">{t.icon.queryFailed} {state.error}</p>}
  {state.loading&&<p>{t.icon.queryingStore}</p>}
  <div className="iconGrid">{state.data.map(app=>{const icon=iconUrl(app); return <div className="iconCard" key={app.trackId}>
    <img src={icon} alt="" loading="lazy"/>
    <div className="iconInfo"><h3>{app.trackName}</h3><p>{app.artistName}</p><small>{[app.primaryGenreName, app.formattedPrice].filter(Boolean).join(' · ')}</small></div>
    <div className="iconActions"><a href={app.trackViewUrl} target="_blank" rel="noreferrer">{t.icon.appStore}</a><button onClick={()=>copy(icon,'Icon link')}>{t.icon.copyIcon}</button><a href={icon} target="_blank" rel="noreferrer">{t.icon.fullSize}</a></div>
  </div>})}</div>
  {!state.loading&&state.searched&&state.data.length===0&&!state.error&&<Empty text={t.icon.noMatch}/>}
  {!state.searched&&<FeaturedApps onSelect={search}/>}
  <ToolIntro page="icon"/>
  <ContentSection {...content}/>
 </>}
