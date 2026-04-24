'use client';

import { Map, Phone } from 'lucide-react';
import { useLang } from './LanguageProvider';
import Reveal from './Reveal';
import { MAPS_URL, MAPS_EMBED, TEL } from '@/lib/translations';

export default function Location() {
  const { t } = useLang();

  return (
    <section id="location" className="section section-alt">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">{t('loc.eyebrow')}</span>
            <h2>{t('loc.title')}</h2>
          </div>
        </Reveal>
        <div className="location-grid">
          <Reveal>
            <div className="location-info">
              <h3>{t('loc.address')}</h3>
              <address>
                <strong>Geeta Diabetes &amp; Endocrine Centre</strong>
                C/O Focus Diagnostics,<br />
                Chandramama Children Hospital Opposite Road,<br />
                Sundaraiah Bhavan Rd,<br />
                Ongole, Andhra Pradesh 523001, India
              </address>
              <div className="location-actions">
                <a href={MAPS_URL} className="btn btn-primary" target="_blank" rel="noopener">
                  <Map size={18} /> <span>{t('loc.openMaps')}</span>
                </a>
                <a href={TEL} className="btn btn-ghost">
                  <Phone size={18} /> <span>{t('loc.callClinic')}</span>
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="location-map">
              <iframe
                src={MAPS_EMBED}
                width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location Map"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
