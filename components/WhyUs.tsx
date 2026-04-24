'use client';

import { useLang } from './LanguageProvider';
import Reveal from './Reveal';

export default function WhyUs() {
  const { t } = useLang();
  const cards = [
    { num: '01', tKey: 'why.1.t', dKey: 'why.1.d' },
    { num: '02', tKey: 'why.2.t', dKey: 'why.2.d' },
    { num: '03', tKey: 'why.3.t', dKey: 'why.3.d' },
    { num: '04', tKey: 'why.4.t', dKey: 'why.4.d' },
  ];

  return (
    <section id="why" className="section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">{t('why.eyebrow')}</span>
            <h2>{t('why.title')}</h2>
          </div>
        </Reveal>
        <div className="why-grid">
          {cards.map((c, i) => (
            <Reveal key={c.num} delay={i * 80}>
              <div className="why-card">
                <div className="why-num">{c.num}</div>
                <h3>{t(c.tKey)}</h3>
                <p>{t(c.dKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
