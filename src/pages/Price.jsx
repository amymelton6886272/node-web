import { useState } from 'react';
import { Hero, Empty, ToolIntro, FeaturedApps } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { toolContent } from '../data/toolContent.js';
import { useLang } from '../LanguageContext.jsx';

export default function Price(){
 const [q,setQ]=useState('');
 const [baseCountry,setBaseCountry]=useState('cn');
 const [state,setState]=useState({loading:false,apps:[],error:null,searched:false});
 const countries=[['cn','China','CNY'],['us','United States','USD'],['jp','Japan','JPY'],['hk','Hong Kong','HKD'],['tw','Taiwan','TWD'],['gb','United Kingdom','GBP'],['kr','Korea','KRW'],['sg','Singapore','SGD'],['au','Australia','AUD']];
 const fallbackRates={CNY:1,USD:7.24,JPY:0.047,HKD:0.93,TWD:0.22,GBP:9.67,KRW:0.0052,SGD:5.58,AUD:4.72};
 const getRates=async()=>{
   try{
     const json=await fetch('https://open.er-api.com/v6/latest/CNY').then(r=>r.json());
     const rates=json?.rates||{};
     return Object.fromEntries(Object.entries(fallbackRates).map(([k,v])=>[k,k==='CNY'?1:(rates[k]?1/rates[k]:v)]));
   }catch{return fallbackRates}
 };
 const toCny=(price,currency,rates)=>typeof price==='number'&&price>0 ? price*(rates[currency]||fallbackRates[currency]||1) : price===0 ? 0 : null;
 const fmtCny=v=>v==null?'':v===0?'¥0.00':`≈ ¥${v.toFixed(2)}`;
 const search = async (keyword) => {
   const term = (keyword !== undefined ? keyword : q).trim();
   if (!term) return;
   setQ(term);
   setState({loading:true,apps:[],error:null,searched:true});
   try{
     const idMatch=term.match(/id(\d{5,})/)||term.match(/^\d{5,}$/);
     const firstUrl=idMatch
       ? `https://itunes.apple.com/lookup?id=${idMatch[1]||idMatch[0]}&country=${baseCountry}`
       : `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&country=${baseCountry}&entity=software&limit=8`;
     const first=await fetch(firstUrl).then(r=>{if(!r.ok) throw new Error(r.status+' '+r.statusText); return r.json()});
     const baseApps=(first.results||[]).filter(x=>x.trackId).slice(0,8);
     const rates=await getRates();
     const apps=await Promise.all(baseApps.map(async(app)=>{
       const prices=await Promise.all(countries.map(async([code,name])=>{
         try{
           const json=await fetch(`https://itunes.apple.com/lookup?id=${app.trackId}&country=${code}`).then(r=>r.json());
           const item=json.results?.[0];
           const cny=toCny(item?.price,item?.currency,rates);
           return {code,name,available:!!item,price:item?.price,cny,formattedPrice:item?.formattedPrice||'Not available',currency:item?.currency,trackViewUrl:item?.trackViewUrl};
         }catch{return {code,name,available:false,formattedPrice:'Query failed'}}
       }));
       return {...app, prices};
     }));
     setState({loading:false,apps,error:null,searched:true});
   }catch(error){setState({loading:false,apps:[],error:String(error),searched:true})}
 };
 const paidPrices=prices=>prices.filter(p=>p.available&&typeof p.cny==='number'&&p.cny>0);
 const cheapest=prices=>{
   const paid=paidPrices(prices);
   if(!paid.length) return null;
   return paid.reduce((a,b)=>a.cny<b.cny?a:b);
 };
 const {t,lang}=useLang(); const content=toolContent[lang]?.price||toolContent.en.price; return <>
 <Hero title={t.price.title} sub={t.price.sub}/>
 <ToolIntro page="price"/>
 <ContentSection {...content}/>
 <div className="searchbar priceSearchbar">
    <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')search()}} placeholder={t.price.placeholder}/>
    <select value={baseCountry} onChange={e=>setBaseCountry(e.target.value)}>{countries.map(([c,n])=><option value={c} key={c}>{n}</option>)}</select>
    <button onClick={search} disabled={state.loading}>{state.loading?t.price.comparing:t.price.search}</button>
  </div>
  {state.error&&<p className="err">{t.price.queryFailed} {state.error}</p>}
  {state.loading&&<p>{t.price.querying}</p>}
  <div className="priceList">{state.apps.map(app=>{const low=cheapest(app.prices); return <div className="priceCard" key={app.trackId}>
    <div className="priceHead"><img src={(app.artworkUrl100||app.artworkUrl512||'').replace(/\d+x\d+bb\.(jpg|png|webp)$/,'200x200bb.$1')} alt=""/><div><h3>{app.trackName}</h3><p>{app.artistName}</p><small>{app.bundleId}</small></div>{low&&<span className="cheapBadge">{t.price.lowest} {low.name} · {low.formattedPrice} / {fmtCny(low.cny)}</span>}</div>
    <div className="priceTable">{app.prices.map(p=><a className={low&&p.code===low.code?'priceCell best':'priceCell'} href={p.trackViewUrl||app.trackViewUrl} target="_blank" rel="noreferrer" key={p.code}>
      <span>{p.name}</span><b>{p.formattedPrice}</b>{p.available&&<strong>{fmtCny(p.cny)}</strong>}<em>{p.available?t.price.openStore:t.price.na}</em>
    </a>)}</div>
  </div>})}</div>
   {!state.loading&&state.searched&&state.apps.length===0&&!state.error&&<Empty text={t.price.noMatch}/>}
  {!state.searched&&<FeaturedApps onSelect={search}/>}
 </>}
