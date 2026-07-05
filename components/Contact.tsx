'use client';

import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { useLang } from './LanguageProvider';
import Reveal from './Reveal';
import { WA_URL, TEL, MAPS_URL, PHONE_DISPLAY } from '@/lib/translations';

export default function Contact() {
  const { t } = useLang();

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">{t('contact.eyebrow')}</span>
            <h2>{t('contact.title')}</h2>
          </div>
        </Reveal>
        <div className="contact-grid">
          <Reveal delay={0}>
            <a href={WA_URL} className="contact-card" target="_blank" rel="noopener" style={{ ['--accent' as never]: '#25d366' }}>
              <div className="contact-icon"><MessageCircle size={28} /></div>
              <h3>WhatsApp</h3>
              <p>{PHONE_DISPLAY}</p>
              <span className="contact-cta">{t('contact.chat')}</span>
            </a>
          </Reveal>
          <Reveal delay={100}>
            <a href={TEL} className="contact-card" style={{ ['--accent' as never]: '#0d7377' }}>
              <div className="contact-icon"><Phone size={28} /></div>
              <h3>{t('contact.phone')}</h3>
              <p>{PHONE_DISPLAY}</p>
              <span className="contact-cta">{t('contact.call')}</span>
            </a>
          </Reveal>
          <Reveal delay={200}>
            <a href={MAPS_URL} className="contact-card" target="_blank" rel="noopener" style={{ ['--accent' as never]: '#c9a227' }}>
              <div className="contact-icon"><MapPin size={28} /></div>
              <h3>{t('contact.visit')}</h3>
              <p>{t('contact.visitVal')}</p>
              <span className="contact-cta">{t('contact.directions')}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
