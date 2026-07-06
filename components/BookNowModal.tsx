'use client';

import { useEffect } from 'react';
import { X, MessageCircle, Phone, MapPin, ChevronRight, CalendarCheck } from 'lucide-react';
import { useLang } from './LanguageProvider';
import { LiveStatusBadge } from './LiveStatus';
import { WA_URL, TEL, PHONE_DISPLAY, MAPS_URL } from '@/lib/translations';

export default function BookNowModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="book-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('book.title')}>
      <div className="book-modal" onClick={(e) => e.stopPropagation()}>
        <button className="book-close" onClick={onClose} aria-label={t('book.close')}>
          <X size={18} />
        </button>

        <h3>{t('book.title')}</h3>
        <div className="book-status"><LiveStatusBadge /></div>
        <p className="book-sub">{t('book.sub')}</p>

        <div className="book-options">
          <a href="/book" className="book-option book-option-online">
            <span className="book-option-icon"><CalendarCheck size={22} /></span>
            <span className="book-option-text">
              <strong>{t('book.online')}</strong>
              <small>{t('book.onlineDesc')}</small>
            </span>
            <ChevronRight size={18} className="book-option-arrow" />
          </a>

          <a href={WA_URL} target="_blank" rel="noopener" className="book-option book-option-wa">
            <span className="book-option-icon"><MessageCircle size={22} /></span>
            <span className="book-option-text">
              <strong>{t('hero.chatWa')}</strong>
              <small>{t('book.waDesc')}</small>
            </span>
            <ChevronRight size={18} className="book-option-arrow" />
          </a>

          <a href={TEL} className="book-option">
            <span className="book-option-icon"><Phone size={22} /></span>
            <span className="book-option-text">
              <strong>{t('hero.call')}</strong>
              <small>{PHONE_DISPLAY} · {t('book.callDesc')}</small>
            </span>
            <ChevronRight size={18} className="book-option-arrow" />
          </a>

          <a href={MAPS_URL} target="_blank" rel="noopener" className="book-option">
            <span className="book-option-icon"><MapPin size={22} /></span>
            <span className="book-option-text">
              <strong>{t('book.visitTitle')}</strong>
              <small>{t('book.visitDesc')} · {t('book.directions')}</small>
            </span>
            <ChevronRight size={18} className="book-option-arrow" />
          </a>
        </div>
      </div>
    </div>
  );
}
