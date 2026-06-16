import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Hero, Empty, ToolIntro, FeaturedApps } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { toolContent } from '../data/toolContent.js';
import { useLang } from '../LanguageContext.jsx';

export default function Iap(){
 const [q,setQ]=useState('');
 const [country,setCountry]=useState('cn');
 const [state,setState]=useState({loading:false,apps:[],error:null,searched:false});
 const [iapStatus,setIapStatus]=useState({});
 const [iapItems,setIapItems]=useState({});
 const parseInput=(value)=>{
   const text=value.trim();
   const idMatch=text.match(/id(\d{5,})/)||text.match(/^\d{5,}$/);
   if(idMatch) return {mode:'lookup', query:idMatch[1]||idMatch[0]};
   if(/^([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+$/.test(text)) return {mode:'bundle', query:text};
   return {mode:'search', query:text};
 };
 const {t,lang}=useLang(); const content=toolContent[lang]?.iap||toolContent.en.iap;
 const detectIap=(app)=>{
   const checked=iapStatus[app.trackId];
   if(checked==='yes') return {label:t.iap.includesIAP, cls:'badge ok'};
   if(checked==='no') return {label:t.iap.noIAP, cls:'badge'};
   if(checked==='checking') return {label:t.iap.checking, cls:'badge warn'};
   if(checked==='unknown') return {label:t.iap.checkFailed, cls:'badge warn'};
   const text=[app.formattedPrice, app.description, app.trackViewUrl, ...(app.advisories||[])].join(' ').toLowerCase();
   const has = app.offersIAP===true || /app 内购买|app内购买|内购|in-app purchase|in app purchase|in-app purchases|in app purchases/.test(text);
   return has ? {label:t.iap.includesIAP, cls:'badge ok'} : {label:t.iap.pending, cls:'badge warn'};
 };
 const extractIapItems=(html)=>{
   try{
     const match=html.match(/<script type=\"application\/json\" id=\"serialized-server-data\">([\s\S]*?)<\/script>/);
     if(!match) return [];
     const data=JSON.parse(match[1]);
     const info=data?.data?.[0]?.data?.shelfMapping?.information?.items||[];
     const row=info.find(x=>/App\s*内购买|App内购买|In-App Purchases/i.test(x?.title||''));
     const pairs=(row?.items_V3||[]).filter(x=>x?.$kind==='textPair'&&x.leadingText&&x.trailingText);
     if(pairs.length) return pairs.map(x=>({name:x.leadingText,price:x.trailingText}));
     const oldPairs=row?.items?.flatMap(x=>x?.textPairs||[])||[];
     return oldPairs.filter(x=>x?.[0]&&x?.[1]).map(([name,price])=>({name,price}));
   }catch{return []}
 };
 const checkIapFromPage=async(apps)=>{
   const targets=apps.slice(0,12).filter(app=>app.trackId);
   setIapItems({});
   setIapStatus(Object.fromEntries(targets.map(app=>[app.trackId,'checking'])));
   await Promise.all(targets.map(async(app)=>{
     try{
       const store=(country||'cn').toLowerCase();
       const appUrl=`https://apps.apple.com/${store}/app/id${app.trackId}`;
       const proxy=`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(appUrl)}`;
       const res=await fetch(proxy);
       if(!res.ok) throw new Error('page '+res.status);
       const html=await res.text();
       const items=extractIapItems(html);
       const has=items.length>0||/App\s*内购买|App内购买|内购|In-App Purchases|In-App Purchases|In-App Purchase/i.test(html);
       if(items.length) setIapItems(prev=>({...prev,[app.trackId]:items}));
       setIapStatus(prev=>({...prev,[app.trackId]:has?'yes':'no'}));
     }catch{
       setIapStatus(prev=>({...prev,[app.trackId]:'unknown'}));
     }
   }));
 };
 const query = async (keyword) => {
   const term = (keyword !== undefined ? keyword : q).trim();
   if (!term) return;
   setQ(term);
   setState({loading:true,apps:[],error:null,searched:true});
   try{
     const parsed=parseInput(term);
     const url=parsed.mode==='lookup'
       ? `https://itunes.apple.com/lookup?id=${encodeURIComponent(parsed.query)}&country=${country}`
       : parsed.mode==='bundle'
       ? `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(parsed.query)}&country=${country}`
       : `https://itunes.apple.com/search?term=${encodeURIComponent(parsed.query)}&country=${country}&entity=software&limit=12`;
     const res=await fetch(url);
     if(!res.ok) throw new Error(res.status+' '+res.statusText);
     const json=await res.json();
     const apps=json.results||[];
     setState({loading:false,apps,error:null,searched:true});
     checkIapFromPage(apps);
   }catch(error){
     setState({loading:false,apps:[],error:String(error),searched:true});
   }
 };
 return <>
 <Hero title={t.iap.title} sub={t.iap.sub}/>
 <div className="searchbar iapSearchbar">
    <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')query()}} placeholder={t.iap.placeholder}/>
    <select value={country} onChange={e=>setCountry(e.target.value)}>
      <option value="us">United States</option><option value="cn">China</option><option value="jp">Japan</option><option value="hk">Hong Kong</option><option value="tw">Taiwan</option><option value="gb">United Kingdom</option><option value="kr">Korea</option>
    </select>
    <button onClick={query} disabled={state.loading}>{state.loading?t.iap.querying:t.iap.search}</button>
  </div>
  <div className="notice"><ShieldAlert size={18}/><span>{t.iap.note}</span></div>
  {state.error&&<p className="err">{t.iap.queryFailed} {state.error}</p>}
  {state.loading&&<p>{t.iap.queryingStore}</p>}
  <div className="iapGrid">{state.apps.map(app=><div className="iapCard" key={app.trackId||app.bundleId}>
    <div className="iapHead"><img src={(app.artworkUrl100||app.artworkUrl512||'').replace(/\d+x\d+bb\.(jpg|png|webp)$/,'200x200bb.$1')} alt=""/><div><h3>{app.trackName||app.name}</h3><p>{app.artistName}</p><small>{app.bundleId}</small></div></div>
    <div className="iapStats">
      <div><b>{app.formattedPrice||'Unknown'}</b><span>{t.iap.appPrice}</span></div>
      <div><b className={app.features?.includes('iosUniversal')?'okText':''}>{app.features?.includes('iosUniversal')?t.iap.universal:'-'}</b><span>{t.iap.universal}</span></div>
      <div><b className={app.screenshotUrls||app.ipadScreenshotUrls?'okText':''}>{app.trackContentRating||'-'}</b><span>{t.iap.ageRating}</span></div>
    </div>
    <div className="iapFlag"><span className={detectIap(app).cls}>{detectIap(app).label}</span><span>{app.primaryGenreName||'App Store'}</span><span>{app.version?`Version ${app.version}`:''}</span></div>
    {iapItems[app.trackId]?.length>0&&<div className="iapItems"><h4>{t.iap.iapItems}</h4>{iapItems[app.trackId].map((item,i)=><div className="iapItem" key={i}><span>{item.name}</span><b>{item.price}</b></div>)}</div>}
    {iapStatus[app.trackId]==='yes'&&!iapItems[app.trackId]?.length&&state.apps.length===1&&<p className="iapHint">{t.iap.iapHint}</p>}
    {app.description&&<p className="iapDesc">{app.description}</p>}
    <div className="iconActions"><a href={app.trackViewUrl} target="_blank" rel="noreferrer">{t.iap.openAppStore}</a><button onClick={()=>setQ(app.bundleId)}>{t.iap.fillBundle}</button></div>
  </div>)}</div>
  {!state.loading&&state.searched&&state.apps.length===0&&!state.error&&<Empty text={t.iap.noMatch}/>}
  {!state.searched&&<FeaturedApps onSelect={query}/>}
  <ToolIntro page="iap"/>
  <ContentSection {...content}/>
 </>}
