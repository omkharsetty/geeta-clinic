'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { useLang } from './LanguageProvider';
import LanguageToggle from './LanguageToggle';
import { LiveStatusBadge } from './LiveStatus';
import { WA_URL, TEL, PHONE_DISPLAY } from '@/lib/translations';

export default function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="top-bar">
        <div className="container top-bar-inner">
          <span className="top-item">
            <Phone size={14} /> <a href={TEL}>{PHONE_DISPLAY}</a>
          </span>
          <span className="top-item hide-mobile">
            <MapPin size={14} /> {t('top.location')}
          </span>
          <LiveStatusBadge />
          <LanguageToggle />
        </div>
      </div>

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <a href="#home" className="logo">
            <Image src="/images/icon.png" alt="Geeta Diabetes & Endocrine Centre" width={52} height={52} className="logo-img" priority />
            <div className="logo-text">
              <strong>{t('brand.name')}</strong>
              <small>{t('brand.sub')}</small>
            </div>
          </a>

          <nav className={`nav ${open ? 'open' : ''}`}>
            <a href="#about" onClick={closeMenu}>{t('nav.about')}</a>
            <a href="#services" onClick={closeMenu}>{t('nav.services')}</a>
            <a href="#why" onClick={closeMenu}>{t('nav.why')}</a>
            <a href="#timings" onClick={closeMenu}>{t('nav.timings')}</a>
            <a href="#faq" onClick={closeMenu}>{t('nav.faq')}</a>
            <a href="#contact" onClick={closeMenu}>{t('nav.contact')}</a>
            <a href={WA_URL} className="btn btn-primary" target="_blank" rel="noopener" onClick={closeMenu}>
              {t('nav.bookNow')}
            </a>
          </nav>

          <button className="menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
    </>
  );
}
