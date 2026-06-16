import { useLang } from '../LanguageContext.jsx';
import { siteContent } from '../data/siteContent.js';

export function useSiteContent(page) {
  const { lang } = useLang();
  return siteContent[lang]?.[page] || siteContent.en[page] || {};
}

export function BilingualNote({ className = '' }) {
  const { lang, toggle } = useLang();
  const isZh = lang === 'zh';

  return (
    <div className={`bilingualNote ${className}`.trim()}>
      <strong>{isZh ? '双语内容提示' : 'Bilingual content'}</strong>
      <span>{isZh ? '本站核心页面提供中文与英文版本，可使用右上角语言按钮切换。' : 'Core pages are available in English and Chinese. Use the language button in the header to switch anytime.'}</span>
      <button onClick={toggle}>{isZh ? 'Switch to English' : '切换到中文'}</button>
    </div>
  );
}

export function RichSection({ title, children, className = '' }) {
  return <section className={`richSection card ${className}`.trim()}>{title && <h2>{title}</h2>}{children}</section>;
}
