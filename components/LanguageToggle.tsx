'use client';

import { useLang } from './LanguageProvider';

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <span className="lang-toggle">
      <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
      <button className={`lang-btn ${lang === 'te' ? 'active' : ''}`} onClick={() => setLang('te')}>తెలుగు</button>
    </span>
  );
}
