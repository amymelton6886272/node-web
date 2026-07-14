import { useEffect, useState } from 'react';
import { Hero, Empty } from '../components/common.jsx';
import { useLang } from '../LanguageContext.jsx';

export default function IpCheck(){
 const [info,setInfo]=useState(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState(null);
 const [target,setTarget]=useState('https://www.google.com');
 const [probe,setProbe]=useState(null);
 const normalizeIpInfo=(raw,source)=>{
   if(source==='ipapi') return {ip:raw.ip,country:raw.country_name,city:raw.city,latitude:raw.latitude,longitude:raw.longitude,flag:{emoji:raw.country_code?String.fromCodePoint(...raw.country_code.toUpperCase().split('').map(c=>127397+c.charCodeAt())):''},timezone:{id:raw.timezone},connection:{asn:raw.asn?.replace?.(/^AS/i,'')||raw.asn,isp:raw.org,org:raw.org}};
   if(source==='ipinfo') return {ip:raw.ip,country:raw.country,city:raw.city,latitude:raw.loc?.split(',')?.[0],longitude:raw.loc?.split(',')?.[1],flag:{emoji:raw.country?String.fromCodePoint(...raw.country.toUpperCase().split('').map(c=>127397+c.charCodeAt())):''},timezone:{id:raw.timezone},connection:{asn:raw.org?.match(/AS\d+/)?.[0]?.replace('AS',''),isp:raw.org,org:raw.org}};
   return raw;
 };
 const load=async()=>{
   setLoading(true); setError(null);
   const sources=[
     {name:'ipwho',url:'https://ipwho.is/',map:j=>{if(j.success===false) throw new Error(j.message||'ipwho failed'); return j}},
     {name:'ipapi',url:'https://ipapi.co/json/',map:j=>normalizeIpInfo(j,'ipapi')},
     {name:'ipinfo',url:'https://ipinfo.io/json',map:j=>normalizeIpInfo(j,'ipinfo')}
   ];
   const errors=[];
   for(const src of sources){
     try{
       const json=await fetch(src.url,{cache:'no-store'}).then(r=>{if(!r.ok) throw new Error(`${src.name} ${r.status}`); return r.json()});
       setInfo(src.map(json));
       setLoading(false);
       return;
     }catch(e){errors.push(String(e))}
   }
   setError(errors.join(';'));
   setLoading(false);
 };
 useEffect(()=>{load()},[]);
 const checkSite=async()=>{
   const url=target.trim(); if(!url) return;
   setProbe({loading:true,url});
   const start=performance.now();
   try{
     await fetch(url,{mode:'no-cors',cache:'no-store'});
     setProbe({url,ok:true,ms:Math.round(performance.now()-start)});
   }catch(e){setProbe({url,ok:false,error:String(e),ms:Math.round(performance.now()-start)})}
 };
 const {t,lang}=useLang();
 const rows=info?[[t.ip.ipAddr,info.ip],[t.ip.country,`${info.country||'-'} ${info.flag?.emoji||''}`],[t.ip.city,info.city||'-'],[t.ip.timezone,info.timezone?.id||'-'],[t.ip.asn,info.connection?.asn?`AS${info.connection.asn}`:'-'],[t.ip.isp,info.connection?.isp||'-'],[t.ip.org,info.connection?.org||'-'],[t.ip.coords,info.latitude&&info.longitude?`${info.latitude}, ${info.longitude}`:'-']]:[];
 return <>
 <Hero title={t.ip.title} sub={t.ip.sub}/>
 <div className="ipPanel card">
    <div><h3>{t.ip.panelTitle}</h3><p>{t.ip.panelDesc}</p></div>
    <button onClick={load} disabled={loading}>{loading?t.ip.refreshing:t.ip.refreshIP}</button>
  </div>
  {error&&<p className="err">{t.ip.queryFailed} {error}</p>}
  {loading&&!info&&<p>{t.ip.querying}</p>}
  {info&&<div className="ipHero card"><div className="ipAddress"><span>{info.flag?.emoji||'🌐'}</span><b>{info.ip}</b><em>{info.country} · {info.city}</em></div><div className="ipMap">{info.connection?.isp||info.connection?.org||t.ip.unknownISP}</div></div>}
  {info&&<div className="ipGrid">{rows.map(([k,v])=><div className="ipCell" key={k}><span>{k}</span><b>{v}</b></div>)}</div>}
  <div className="card ipTools"><h3>{t.ip.connTest}</h3><p>{t.ip.connDesc}</p><div className="searchbar"><input value={target} onChange={e=>setTarget(e.target.value)} placeholder="https://www.google.com"/><button onClick={checkSite}>Test</button></div>{probe&&<div className={probe.ok?'probe ok':'probe'}>{probe.loading?t.ip.testing:probe.ok?`${t.ip.reachable} · ${probe.ms}ms`:`${t.ip.unreachable} · ${probe.ms}ms`}</div>}<div className="quickSites">{['https://www.google.com','https://github.com','https://www.youtube.com','https://chat.openai.com','https://apps.apple.com'].map(u=><button key={u} onClick={()=>setTarget(u)}>{u.replace('https://','')}</button>)}</div></div>
 </>}
