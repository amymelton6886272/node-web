import { useEffect, useMemo, useState } from 'react';
import { Gift } from 'lucide-react';
import { Empty } from '../components/common.jsx';
import { useLang } from '../LanguageContext.jsx';

const WARM_DAY_API = 'https://kdbi2plm.lc-cn-n1-shared.com/1.1/classes/free_newpro?order=-datekey&limit=1&keys=datekey,uuid,appinfo,iapCount,game';
const WARM_DAY_HEADERS = { 'X-LC-Id': 'kdbi2PLmpxLgD9BhCrCjn7fr-gzGzoHsz', 'X-LC-Key': 'lr4RlDYFUwATYc9wFRKbdGfd' };
const ZXKI_APPFREE_API = 'https://api.zxki.cn/api/appfree';

export default function AppFree(){
 const {t,lang}=useLang();
 const [state,setState]=useState({loading:true,data:null,error:null,source:''});
 const [tab,setTab]=useState('All');
 const fetchJson=async(url,options)=>{
   const res=await fetch(url,options);
   if(!res.ok) throw new Error(res.status+' '+res.statusText);
   return res.json();
 };
 useEffect(()=>{
   let alive=true;
   setState({loading:true,data:null,error:null,source:''});
   const load=async()=>{
     const errors=[];
     try{
       const json=await fetchJson(ZXKI_APPFREE_API);
       if(json?.apps){
         const ids=[...new Set(Object.values(json.apps).flat().map(item=>String(item.url||'').match(/id(\d+)/)?.[1]).filter(Boolean))];
         const lookupMap={};
         const enrich=async(country)=>{
           if(!ids.length) return;
           try{
             const lookup=await fetchJson(`https://itunes.apple.com/lookup?id=${ids.join(',')}&country=${country}`);
             (lookup.results||[]).forEach(app=>{ if(app.trackId&&!lookupMap[app.trackId]) lookupMap[app.trackId]=app; });
           }catch{}
         };
         await enrich(lang==='zh'?'cn':'us');
         await enrich(lang==='zh'?'us':'cn');
         if(alive){setState({loading:false,data:{kind:'zxki',...json,lookupMap},error:null,source:'酷酷API + iTunes'}); return;}
       }
       throw new Error('empty zxki response');
     }catch(e){errors.push('酷酷API: '+String(e.message||e));}
     try{
       const json=await fetchJson(WARM_DAY_API,{headers:WARM_DAY_HEADERS});
       const row=json.results?.[0];
       if(row&&alive){setState({loading:false,data:{kind:'warmday',...row},error:null,source:'WarmDay'}); return;}
       throw new Error('empty warmday response');
     }catch(e){errors.push('WarmDay: '+String(e.message||e));}
     if(alive) setState({loading:false,data:null,error:errors.join(';'),source:''});
   };
   load();
   return()=>{alive=false};
 },[lang]);
 const {loading,data,error,source}=state;
 const cleanName=(name='')=>String(name).replace(/https$/,'').replace(/\/\/\s*/g,' · ').trim();
 const normalizeUrl=url=>{
   const raw=String(url||'').trim();
   if(!raw) return '#';
   const id=appIdFromUrl(raw);
   if(id) return `https://apps.apple.com/${lang==='zh'?'cn':'us'}/app/id${id}`;
   return raw;
 };
 const appIdFromUrl=url=>String(url||'').match(/id(\d+)/)?.[1];
 const groups=useMemo(()=>{
   if(!data) return {};
   if(data.kind==='zxki'){
     const normalize=(items,type)=>(items||[]).map((item,i)=>{
       const appId=appIdFromUrl(item.url);
       const meta=data.lookupMap?.[appId]||{};
       return {
         id:`${type}-${appId||i}`,
         type,
         name:cleanName(item.name)||meta.trackName||'Unknown',
         seller:meta.artistName||meta.sellerName||'',
         icon:meta.artworkUrl512||meta.artworkUrl100||'',
         url:normalizeUrl(item.url),
         price:meta.formattedPrice||'0.00',
         desc:meta.primaryGenreName||'',
         tags:meta.trackContentRating||''
       };
     });
     return Object.fromEntries(Object.entries(data.apps||{}).map(([type,items])=>[type,normalize(items,type)]));
   }
   const normalize=(items,type)=>items.map(item=>{
     const ext=item.ext||item;
     const trackId=ext.trackId||ext.trackid||ext.appId||ext.id||ext.objectId||item.objectId;
     return {
       id:`${type}-${trackId||ext.title}`,
       type,
       name:ext.title||ext.name||'Unknown',
       seller:ext.artistName||ext.sellerName||'',
       icon:ext.icon||ext.artworkUrl512||ext.artworkUrl100,
       url:ext.url||ext.trackViewUrl||(trackId?`https://apps.apple.com/app/id${trackId}`:'#'),
       price:ext.cPrice||ext.price||'0.00',
       desc:ext.sub||ext.introduce||'',
       tags:ext.tags||''
     };
   });
   return {
     'App Free': normalize(data.appinfo?.free||[],'App Free'),
     'App Sale': normalize(data.appinfo?.sale||[],'App Sale'),
     'Game Free': normalize(data.game?.free||[],'Game Free'),
     'Game Sale': normalize(data.game?.sale||[],'Game Sale')
   };
 },[data]);
 const tabs=['All',...Object.keys(groups).filter(k=>groups[k].length)];
 const list=tab==='All'?Object.values(groups).flat():groups[tab]||[];
 const dateLabel=data?.last_updated||data?.datekey&&String(data.datekey).replace(/(\d{4})(\d{2})(\d{2})/,'$1.$2.$3')||t.appfree.dailyDate;
 return <>
 {loading&&<p>{t.appfree.fetching}</p>}
  {error&&<p className="err">API error: {error}</p>}
  {!loading&&!error&&<div className="toolbar">
    <div className="tabs">{tabs.map(tabName=><button key={tabName} className={tab===tabName?'on':''} onClick={()=>setTab(tabName)}>{tabName}</button>)}</div>
    <span className="dailyDate"><b>{dateLabel}</b><em>{list.length} {t.appfree.curated}</em></span>
  </div>}
  <div className="grid appgrid">{list.map(app=><a className="card app" href={app.url} target="_blank" rel="noreferrer" key={app.id}>
    {app.icon?<img src={app.icon} alt="" loading="lazy"/>:<span className="appPlaceholder"><Gift size={24}/></span>}
    <div className="appbody"><h3>{app.name}</h3><p>{app.desc||app.seller||'App Store free'}</p><small>{[app.type,app.tags,app.seller].filter(Boolean).join(' · ')}</small></div>
  </a>)}</div>
  {!loading&&!error&&list.length===0&&<Empty text={t.appfree.noFree}/>}
 </>
}
