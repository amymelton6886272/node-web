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
      <div className="legalLinkRow"><strong>{data.linksTitle}</strong><a href="#privacy">Privacy</a><a href="#disclaimer">Disclaimer</a><a href="#knowledge">Knowledge</a><a href="#checklists">Checklists</a></div>
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
