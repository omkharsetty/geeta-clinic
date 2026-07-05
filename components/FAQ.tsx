'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLang } from './LanguageProvider';
import Reveal from './Reveal';

const items = [
  { q: 'faq.1.q', a: 'faq.1.a' },
  { q: 'faq.2.q', a: 'faq.2.a' },
  { q: 'faq.3.q', a: 'faq.3.a' },
  { q: 'faq.4.q', a: 'faq.4.a' },
  { q: 'faq.5.q', a: 'faq.5.a' },
  { q: 'faq.6.q', a: 'faq.6.a' },
];

export default function FAQ() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">{t('faq.eyebrow')}</span>
            <h2>{t('faq.title')}</h2>
          </div>
        </Reveal>
        <div className="faq-list">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={it.q} delay={Math.min(i * 50, 250)}>
                <div className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button className="faq-summary" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                    <span>{t(it.q)}</span>
                    <span className="faq-ico">{isOpen ? <Minus size={20} /> : <Plus size={20} />}</span>
                  </button>
                  {isOpen && <p className="faq-answer">{t(it.a)}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
