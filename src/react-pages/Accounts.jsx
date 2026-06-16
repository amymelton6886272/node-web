import { useEffect, useState } from 'react';
import { Hero, Notice, Empty } from '../components/common.jsx';
import { useLang } from '../LanguageContext.jsx';

export default function Accounts(){
 const [state,setState]=useState({loading:true,data:[],error:null});
 const [copied,setCopied]=useState('');
 useEffect(()=>{let alive=true; setState({loading:true,data:[],error:null}); fetch('/api/accounts').then(r=>{if(!r.ok) throw new Error(r.status+' '+r.statusText); return r.json()}).then(json=>{if(alive) setState({loading:false,data:json.data||[],error:null})}).catch(error=>{if(alive) setState({loading:false,data:[],error:String(error)})}); return()=>{alive=false}},[]);
 const copy=async(text,label)=>{await navigator.clipboard.writeText(text); setCopied(label); setTimeout(()=>setCopied(''),1300)};
 const {t,lang}=useLang();
 const regionTitle=(a,i)=>{
  const region=a.region||a.regionName||'';
  const clean=region.replace(/[🇦-🇿]/gu,'').trim();
  const regionEn=(a.region_en||a.regionEn||a.region_name_en||a.country_en||clean.split(/[-—]/).pop()||clean).trim();
  const regionText=lang==='en'?regionEn:region;
  return regionText?`${t.accounts?.regionPrefix||'Region'} · ${regionText}`:`${t.accounts?.accountLabel||'Account'} ${i+1}`;
 };
 return <>
  <Hero title={t.accounts?.title||'Shared Apple ID Accounts'} sub={t.accounts?.sub||'Real-time sync · Status monitoring · Quick copy'}/>
  <Notice/>
  {state.loading&&<p>Loading accounts...</p>}
  {state.error&&<p className="err">API error: {state.error}</p>}
  {!state.loading&&!state.error&&<div className="accountPanel">
    <div className="accountStats"><div><b>{state.data.length}</b><span>Total accounts</span></div><div><b>{state.data.filter(a=>a.status===1).length}</b><span>Available</span></div><div><b>{state.data[0]?.synced_at||'-'}</b><span>Last sync</span></div></div>
  </div>}
  {copied&&<div className="toast">Copied: {copied}</div>}
  <div className="accountGrid">{state.data.map((a,i)=><div className="accountCard" key={a.id||i}>
    <div className="accountHead"><span className="avatar">{String(i+1).padStart(2,'0')}</span><div><h3>{regionTitle(a,i)}</h3></div><span className={a.status===1?'badge ok':'badge'}>{a.status===1?(t.accounts?.available||'✅ Available'):(t.accounts?.maintenance||'🔒 Maintenance')}</span></div>
    <div className="field"><label>{t.accounts?.email||'Email'}</label><code>{a.email||a.id}</code><button onClick={()=>copy(a.email||a.id,t.accounts?.email||'Email')}>{t.accounts?.copy||'Copy'}</button></div>
    <div className="field protected"><label>{t.accounts?.password||'Password'}</label><code>{a.has_password?'••••••••••':'--'}</code><button disabled={!a.passwd||a.passwd==='PROTECTED'} onClick={()=>copy(a.passwd,t.accounts?.password||'Password')}>{a.passwd==='PROTECTED'?(t.accounts?.protected||'Protected'):(t.accounts?.copy||'Copy')}</button></div>
    {a.status===1&&<small>{t.accounts?.usageTip||'⚠️ Download only. Log out immediately after use and do not sign in to iCloud.'}</small>}
  </div>)}</div>
  {!state.loading&&!state.error&&state.data.length===0&&<Empty text="No accounts available"/>}
 </>
}
