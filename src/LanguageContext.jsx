import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LANGS } from './i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('lang') || (navigator.language.startsWith('zh') ? 'zh' : 'en'); }
    catch { return 'en'; }
  });

  useEffect(() => {
    try { localStorage.setItem('lang', lang); } catch {}
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const toggle = useCallback(() => setLang(l => l === 'en' ? 'zh' : 'en'), []);

  const t = useMemo(() => LANGS[lang] || LANGS.en, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
