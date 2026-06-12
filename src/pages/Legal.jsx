import { Hero } from '../components/common.jsx';
import { BilingualNote, RichSection, useSiteContent } from '../components/Bilingual.jsx';

function LegalSections({ sections = [] }) {
  return <div className="legalSections">{sections.map((section, i) => <article className="legalSection" key={i}><h2>{section.title}</h2><p>{section.text}</p></article>)}</div>;
}

export function About(){
  const data = useSiteContent('about');
  return <>
    <Hero title={data.title} sub={data.sub}/>
    <BilingualNote />
    <section className="aboutStats">
      {(data.stats||[]).map((item,i)=><div className="statCard card" key={i}><span>{item.label}</span><b>{item.value}</b></div>)}
    </section>
    <section className="legal card aboutLong">
      <LegalSections sections={data.sections}/>
    </section>
    <RichSection title={data.contactTitle} className="contactPanel">
      <p>{data.contactDesc}</p>
      <p><strong>{data.contactTG}: </strong><a href="https://t.me/Wolffy_chat_bot" target="_blank" rel="noreferrer">@Wolffy_chat_bot</a></p>
      <div className="legalLinkRow"><strong>{data.linksTitle}</strong><a href="/privacy" onClick={e=>{e.preventDefault();location.pushState({},'','/privacy');window.dispatchEvent(new PopStateEvent('popstate'))}}>Privacy</a><a href="/disclaimer" onClick={e=>{e.preventDefault();location.pushState({},'','/disclaimer');window.dispatchEvent(new PopStateEvent('popstate'))}}>Disclaimer</a><a href="/knowledge" onClick={e=>{e.preventDefault();location.pushState({},'','/knowledge');window.dispatchEvent(new PopStateEvent('popstate'))}}>Knowledge</a><a href="/checklists" onClick={e=>{e.preventDefault();location.pushState({},'','/checklists');window.dispatchEvent(new PopStateEvent('popstate'))}}>Checklists</a></div>
    </RichSection>
  </>;
}

export function Disclaimer(){
  const data = useSiteContent('disclaimer');
  return <>
    <Hero title={data.title} sub={data.sub}/>
    <BilingualNote />
    <section className="legal card"><p className="effectiveDate">{data.effective}</p><LegalSections sections={data.sections}/></section>
    <RichSection title={data.reminderTitle} className="legalChecklist">
      <ul>{(data.reminders||[]).map((item,i)=><li key={i}>{item}</li>)}</ul>
    </RichSection>
  </>;
}

export function Contact(){
  const data = useSiteContent('contact');
  return <>
    <Hero title={data.title} sub={data.sub}/>
    <BilingualNote />
    <section className="legal card aboutLong">
      <LegalSections sections={data.sections}/>
    </section>
    <RichSection title={data.faqTitle} className="legalChecklist">
      <ul>{(data.items||[]).map((item,i)=><li key={i}>{item}</li>)}</ul>
    </RichSection>
    <section className="legal card">
      <div className="legalLinkRow"><strong>Important pages:</strong><a href="/privacy" onClick={e=>{e.preventDefault();location.pushState({},'','/privacy');window.dispatchEvent(new PopStateEvent('popstate'))}}>Privacy Policy</a><a href="/disclaimer" onClick={e=>{e.preventDefault();location.pushState({},'','/disclaimer');window.dispatchEvent(new PopStateEvent('popstate'))}}>Disclaimer</a><a href="/about" onClick={e=>{e.preventDefault();location.pushState({},'','/about');window.dispatchEvent(new PopStateEvent('popstate'))}}>About</a></div>
    </section>
  </>;
}

export function Privacy(){
  const data = useSiteContent('privacy');
  return <>
    <Hero title={data.title} sub={data.sub}/>
    <BilingualNote />
    <section className="legal card"><p className="effectiveDate">{data.effective}</p><LegalSections sections={data.sections}/></section>
    <RichSection title={data.choicesTitle} className="legalChecklist">
      <ul>{(data.choices||[]).map((item,i)=><li key={i}>{item}</li>)}</ul>
    </RichSection>
  </>;
}
