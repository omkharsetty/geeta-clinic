'use client';

import { useEffect, useState } from 'react';
import { useLang } from './LanguageProvider';
import { Circle } from 'lucide-react';

function isOpenNow() {
  const now = new Date();
  const day = now.getDay();
  const t = now.getHours() + now.getMinutes() / 60;
  if (day === 0) return false;
  return (t >= 9 && t < 14) || (t >= 18 && t < 20);
}

export function LiveStatusBadge() {
  const { t } = useLang();
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isOpenNow());
    const id = setInterval(() => setOpen(isOpenNow()), 60000);
    return () => clearInterval(id);
  }, []);

  if (open === null) return null;

  return (
    <span className={`top-item hide-mobile live-status ${open ? 'open' : 'closed'}`}>
      <Circle size={10} fill="currentColor" strokeWidth={0} />
      {open ? t('top.openNow') : t('top.closed')}
    </span>
  );
}

export function LiveStatusFloating() {
  const { t } = useLang();
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(isOpenNow());
    const id = setInterval(() => setOpen(isOpenNow()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`fc-val ${open ? 'open' : 'closed'}`}>
      {open === null ? '—' : open ? t('top.openNow') : t('top.closed')}
    </div>
  );
}
