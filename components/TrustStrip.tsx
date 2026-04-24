'use client';

import { GraduationCap, ShieldCheck, MessageCircle, Globe } from 'lucide-react';
import { useLang } from './LanguageProvider';
import Reveal from './Reveal';

export default function TrustStrip() {
  const { t } = useLang();
  const items = [
    { icon: GraduationCap, t: t('trust.1.t'), s: t('trust.1.s') },
    { icon: ShieldCheck, t: t('trust.2.t'), s: t('trust.2.s') },
    { icon: MessageCircle, t: t('trust.3.t'), s: t('trust.3.s') },
    { icon: Globe, t: t('trust.4.t'), s: t('trust.4.s') },
  ];

  return (
    <section className="trust-strip">
      <div className="container trust-strip-inner">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <Reveal key={i} delay={i * 80}>
              <div className="trust-item">
                <div className="trust-ico"><Icon size={22} /></div>
                <div>
                  <strong>{it.t}</strong>
                  <span>{it.s}</span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
