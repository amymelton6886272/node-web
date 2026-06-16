import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from './i18n/en.js';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || ((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en'); }
    catch { return 'en'; }
  });
  const [t, setT] = useState(en);

  useEffect(() => {
    try { localStorage.setItem('lang', lang); } catch {}
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    let active = true;
    if (lang === 'zh') {
      import('./i18n/zh.js').then((mod) => {
        if (active) setT(mod.default);
      }).catch(() => {
        if (active) setT(en);
      });
    } else {
      setT(en);
    }

    return () => { active = false; };
  }, [lang]);

  const toggle = useCallback(() => setLang(l => l === 'en' ? 'zh' : 'en'), []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
