'use client';

import Image from 'next/image';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { useLang } from './LanguageProvider';
import { WA_URL, TEL, PHONE_DISPLAY } from '@/lib/translations';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Image src="/images/icon.png" alt="Logo" width={52} height={52} />
            <strong>Geeta Diabetes &amp;<br />Endocrine Centre</strong>
          </div>
          <p>{t('footer.about')}</p>
        </div>
        <div>
          <h4>{t('footer.quick')}</h4>
          <a href="#about">{t('nav.about')}</a>
          <a href="#services">{t('nav.services')}</a>
          <a href="#timings">{t('nav.timings')}</a>
          <a href="#faq">{t('nav.faq')}</a>
          <a href="#location">{t('loc.eyebrow')}</a>
        </div>
        <div>
          <h4>{t('footer.contact')}</h4>
          <p><Phone size={14} style={{ display: 'inline', marginRight: 6 }} /> <a href={TEL}>{PHONE_DISPLAY}</a></p>
          <p><MessageCircle size={14} style={{ display: 'inline', marginRight: 6 }} /> <a href={WA_URL} target="_blank" rel="noopener">WhatsApp</a></p>
          <p><MapPin size={14} style={{ display: 'inline', marginRight: 6 }} /> Ongole, Andhra Pradesh 523001</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>{t('footer.copy')}</p>
          <p className="small">
            {t('footer.disclaimer')} · <a href="/clinic" className="footer-staff-link">Staff Login</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
