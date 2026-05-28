import { features } from '../navigation.jsx';
import { Hero } from '../components/common.jsx';
import { BilingualNote, RichSection, useSiteContent } from '../components/Bilingual.jsx';
import { useLang } from '../LanguageContext.jsx';

export default function Home(){
  const {t}=useLang();
  const home = useSiteContent('home');
  return <>
    <Hero title={home.title || t.home.title} sub={home.sub || t.home.sub}/>
    <BilingualNote />

    <section className="homeIntro card">
      <h2>{home.introTitle || t.home.introTitle}</h2>
      <p>{home.introDesc || t.home.introDesc}</p>
    </section>

    <div className="grid cards homeFeatureGrid">
      {features.map(({id,Icon})=><a href={'#'+id} className="card" key={id}><Icon/><h3>{t.nav[id]}</h3><p>{t.homeDesc[id]}</p></a>)}
    </div>

    <RichSection title={home.highlightsTitle} className="homeHighlights">
      <div className="richGrid">
        {(home.highlights||[]).map((item,i)=><article key={i} className="richBlock"><h3>{item.title}</h3><p>{item.text}</p></article>)}
      </div>
    </RichSection>

    <RichSection title={home.workflowTitle} className="homeWorkflow">
      <div className="workflowList">
        {(home.workflow||[]).map((item,i)=><article key={i} className="workflowItem"><span>{item.step}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}
      </div>
    </RichSection>

    <RichSection title={home.contentTitle} className="homeContentBlocks">
      <div className="richGrid">
        {(home.contentBlocks||[]).map((item,i)=><article key={i} className="richBlock"><h3>{item.title}</h3><p>{item.text}</p></article>)}
      </div>
    </RichSection>

    <section className="adPolicy card" aria-label="Advertising placement policy">
      <span className="adLabel">{home.adTitle}</span>
      <h2>{home.adTitle}</h2>
      <p>{home.adDesc}</p>
    </section>

    <section className="homeWhy card">
      <h2>{home.whyTitle || t.home.whyTitle}</h2>
      <p>{home.whyP1 || t.home.whyP1}</p>
      <p>{home.whyP2 || t.home.whyP2}</p>
      <p>{home.whyP3 || t.home.whyP3}</p>
    </section>

    <section className="homeFaq card">
      <h2>{home.faqTitle || t.home.faqTitle}</h2>
      {(home.faq||t.home.faq||[]).map((item,i)=><details key={i}><summary>{item.q}</summary><p>{item.a}</p></details>)}
    </section>

    {(home.updates||t.home.updates||[]).length>0&&<section className="homeUpdates card">
      <h2>{home.updatesTitle || t.home.updatesTitle}</h2>
      {(home.updates||t.home.updates).map((u,i)=><div className="updateItem" key={i}><span className="updateDate">{u.date}</span><p>{u.text}</p></div>)}
    </section>}
  </>
}
