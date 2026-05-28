import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { Hero, Empty, ToolIntro } from '../components/common.jsx';
import { ContentSection } from '../components/ContentSection.jsx';
import { toolContent } from '../data/toolContent.js';
import { useLang } from '../LanguageContext.jsx';
import { addressCountries } from '../data/addressData.js';
import { makeAddress } from '../utils/address.js';

export default function AddressGenerator(){
 const {t,lang}=useLang();
 const [country,setCountry]=useState('US');
 const [item,setItem]=useState(()=>makeAddress('US'));
 const [saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem('wolffy_addresses')||'[]')}catch{return []}});
 const [copied,setCopied]=useState('');
 const [note,setNote]=useState('');
 const countryInfo=addressCountries.find(x=>x.code===country)||addressCountries[0];
 const labels=t.address;
 const content=toolContent[lang]?.address||toolContent.en.address;
 const copy=async(text,label)=>{await navigator.clipboard.writeText(text); setCopied(label); setTimeout(()=>setCopied(''),1300)};
 const generate=(next=country)=>{setCountry(next); setItem(makeAddress(next)); setNote('')};
 const persist=(list)=>{setSaved(list); localStorage.setItem('wolffy_addresses',JSON.stringify(list))};
 const save=()=>{persist([{...item,note:note.trim()},...saved]); setCopied(labels.saved); setTimeout(()=>setCopied(''),1300)};
 const remove=id=>persist(saved.filter(x=>x.id!==id));
 const clear=()=>{if(confirm(labels.clearConfirm)) persist([])};
 const exportFile=(type)=>{
   if(!saved.length){setCopied(labels.noSaved); setTimeout(()=>setCopied(''),1300); return}
   const rows=saved.map(x=>({note:x.note||'',name:x.name,gender:x.gender,phone:x.phoneClean||x.phone,address:x.address,country:lang==='zh'?(x.countryZh||x.countryName||x.country):(x.countryName||x.country),time:x.time}));
   const content=type==='json'?JSON.stringify(rows,null,2):['Note,Name,Gender,Phone,Address,Country,Time',...rows.map(x=>[x.note,x.name,x.gender,x.phone,x.address,x.country,x.time].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
   const blob=new Blob([content],{type:type==='json'?'application/json':'text/csv;charset=utf-8'});
   const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`addresses.${type==='json'?'json':'csv'}`; a.click(); URL.revokeObjectURL(url);
 };
 const fields=[[labels.name,item.name,'name'],[labels.gender,item.gender,'gender'],[labels.phone,item.phone,'phoneClean'],[labels.street,item.street,'street'],[labels.city,item.city,'city'],[labels.postal,item.postal,'postal'],[labels.address,item.address,'address']];
 const mapUrl=`https://www.google.com/maps?q=${encodeURIComponent(item.address)}&output=embed`;
 return <>
 <Hero title={labels.title} sub={labels.sub}/>
 <ToolIntro page="address"/>
 <ContentSection {...content}/>
 <div className="addressLayout">
    <section className="addressMain card">
      <div className="addressTop"><div><h3>{labels.generated}</h3><p>{labels.clickCopy}</p></div><span className="configType">{lang==='zh'?`${countryInfo.zh} · ${countryInfo.name}`:countryInfo.name}</span></div>
      <div className="addressFields">{fields.map(([label,value,key])=><button className="addressField" key={key} onClick={()=>copy(value,label)}><span>{label}</span><b>{value}</b></button>)}</div>
      <div className="addressControls">
        <select value={country} onChange={e=>generate(e.target.value)}>{addressCountries.map(c=><option key={c.code} value={c.code}>{lang==='zh'?`${c.zh} / ${c.name}`:c.name}</option>)}</select>
        <button onClick={()=>generate()}>{labels.getAnother}</button>
      </div>
      <div className="addressSave"><input value={note} onChange={e=>setNote(e.target.value)} placeholder={labels.notePlaceholder}/><button onClick={save}>{labels.save}</button></div>
    </section>
    <section className="addressMap card"><h3>{labels.map}</h3><iframe title="address map" src={mapUrl} loading="lazy"></iframe></section>
  </div>
  {copied&&<div className="toast">{copied}</div>}
  <section className="savedBox card">
    <div className="savedHead"><div><h3>{labels.savedTitle}</h3><p>{saved.length} {labels.records}</p></div><div className="savedActions"><button onClick={()=>exportFile('csv')}><Download size={15}/> CSV</button><button onClick={()=>exportFile('json')}><Download size={15}/> JSON</button><button className="danger" onClick={clear}><Trash2 size={15}/> {labels.clear}</button></div></div>
    {saved.length===0?<Empty text={labels.empty}/>:<div className="savedGrid">{saved.map(x=><div className="savedCard" key={x.id}><div><b>{x.name}</b><span>{lang==='zh'?(x.countryZh||x.countryName||x.country):(x.countryName||x.country)} · {x.time}</span></div>{x.note&&<p>{x.note}</p>}<button className="savedAddress" onClick={()=>copy(x.address,labels.address)}>{x.address}</button><div className="savedMini"><button onClick={()=>copy(x.phoneClean||x.phone,labels.phone)}>{x.phoneClean||x.phone}</button><button onClick={()=>remove(x.id)}>{labels.delete}</button></div></div>)}</div>}
  </section>
 </>;
}
