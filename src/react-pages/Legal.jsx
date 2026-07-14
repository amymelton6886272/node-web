import { Hero } from '../components/common.jsx';
import { BilingualNote, RichSection, useSiteContent } from '../components/Bilingual.jsx';

function LegalSections({ sections = [] }) {
  return <div className="legalSections">{sections.map((section, i) => <article className="legalSection" key={i}><h2>{section.title}</h2><p>{section.text}</p></article>)}</div>;
}

const policyPages = {
  terms: {
    title: 'Terms of Use',
    sub: 'Rules and limitations for using Storewise tools, guides, generated data, and external links.',
    effective: 'Effective date: 2026-06-16',
    sections: [
      { title: '1. Acceptance of terms', text: 'By accessing Storewise, you agree to use the site for lawful, personal, research, educational, and development-support purposes. If you do not agree with these terms, do not use the site.' },
      { title: '2. Informational tools only', text: 'Storewise provides App Store research tools, safety explanations, checklists, and generated test data. Results are not guarantees, professional advice, purchase recommendations, legal advice, financial advice, or approval from Apple or any third-party service.' },
      { title: '3. User responsibility', text: 'You are responsible for verifying prices, subscriptions, refunds, regional availability, permissions, and account changes through Apple or the relevant service before acting. You must comply with applicable laws, platform rules, developer terms, and local regulations.' },
      { title: '4. Prohibited use', text: 'Do not use Storewise to facilitate fraud, impersonation, unauthorized access, credential sharing, account abuse, platform circumvention, spam, scraping that harms services, or misuse of generated addresses for delivery, billing, identity verification, or deception.' },
      { title: '5. Third-party services', text: 'Some pages may link to or request information from Apple public endpoints, IP lookup services, app metadata providers, hosting providers, advertising providers, and other external services. Those services have their own terms and privacy policies.' },
      { title: '6. Changes', text: 'Storewise may update tools, content, data sources, advertising integrations, and these terms as the site evolves. Continued use after updates means you accept the revised terms.' },
    ],
  },
  editorial: {
    title: 'Editorial Policy',
    sub: 'How Storewise writes, reviews, labels, and corrects content for users researching Apple and App Store decisions.',
    effective: 'Effective date: 2026-06-16',
    sections: [
      { title: '1. Purpose', text: 'Storewise publishes practical, cautious, and verifiable content for Apple and iOS users. The goal is to help readers understand app pricing, subscriptions, permissions, refunds, privacy labels, regional differences, and common safety risks before taking action.' },
      { title: '2. Independence', text: 'Storewise is independent and is not affiliated with Apple, Google, GitHub, Docker, app developers, payment providers, or advertising networks mentioned on the site. Trademarks and service marks belong to their respective owners.' },
      { title: '3. Writing standards', text: 'Content should explain what a tool does, where data may come from, what the result does not prove, and when users should verify information at the source. Pages should avoid exaggeration, fear-based claims, unsupported rankings, and misleading calls to action.' },
      { title: '4. Corrections', text: 'If content is outdated, unclear, inaccurate, or missing important context, users can contact the maintainer with the page URL, the affected text or result, device/browser information, and supporting details. Reasonable corrections may be reviewed and published.' },
      { title: '5. Advertising separation', text: 'Ads, if enabled, do not determine editorial conclusions. Advertising units should be visually separated from publisher content and should not appear on empty results, error-only screens, pop-ups, or purely navigational areas.' },
    ],
  },
  dataSources: {
    title: 'Data Sources',
    sub: 'Where Storewise may obtain app, price, IP, address-format, and safety reference information.',
    effective: 'Effective date: 2026-06-16',
    sections: [
      { title: '1. Apple and App Store data', text: 'App names, icons, prices, identifiers, descriptions, screenshots, ratings, and availability signals may come from Apple public APIs, public App Store pages, or Apple-hosted media URLs. These sources can change, cache, omit data, or vary by region.' },
      { title: '2. Pricing and exchange rates', text: 'Price comparison tools may combine App Store price data with currency conversion estimates. Taxes, subscription trial terms, regional restrictions, account state, and final checkout prices must be confirmed in the App Store.' },
      { title: '3. IP and network data', text: 'IP checks may request information from public geolocation or network metadata services. IP geolocation is approximate and can reflect VPN endpoints, proxy servers, ISP records, or database delay rather than a user’s physical location.' },
      { title: '4. Generated test data', text: 'Address generator data is synthetic and intended for development, testing, UI mockups, and sample datasets. It should not be treated as real identity, billing, shipping, verification, or legal information.' },
      { title: '5. Human-readable guidance', text: 'Guides, checklists, glossary entries, and risk rules are editorial explanations. They are designed to help users reason about common patterns but should not be treated as certifications, guarantees, or professional advice.' },
      { title: '6. Reporting issues', text: 'If a data source appears stale, incorrect, unavailable, or misleading, contact the maintainer with the page URL, query used, observed result, expected result, and date of observation.' },
    ],
  },
};

function PolicyPage({ id }) {
  const data = policyPages[id];
  return <>
    <Hero title={data.title} sub={data.sub}/>
    <section className="legal card">
      <p className="effectiveDate">{data.effective}</p>
      <LegalSections sections={data.sections}/>
    </section>
  </>;
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
      <div className="legalLinkRow"><strong>{data.linksTitle}</strong><a href="/privacy">Privacy</a><a href="/disclaimer">Disclaimer</a><a href="/knowledge">Knowledge</a><a href="/checklists">Checklists</a></div>
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
      <div className="legalLinkRow"><strong>Important pages:</strong><a href="/privacy">Privacy Policy</a><a href="/disclaimer">Disclaimer</a><a href="/about">About</a></div>
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

export function Terms(){
  return <PolicyPage id="terms" />;
}

export function EditorialPolicy(){
  return <PolicyPage id="editorial" />;
}

export function DataSources(){
  return <PolicyPage id="dataSources" />;
}
