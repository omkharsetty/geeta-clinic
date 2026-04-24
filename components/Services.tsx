'use client';

import { Droplet, Activity, Flower2, Scale, Sun, Dna, Bone, Video, LucideIcon } from 'lucide-react';
import { useLang } from './LanguageProvider';
import Reveal from './Reveal';

type Svc = { icon: LucideIcon; tKey: string; dKey: string; accent: string };

const services: Svc[] = [
  { icon: Droplet, tKey: 'svc.diabetes.t', dKey: 'svc.diabetes.d', accent: '#e63946' },
  { icon: Activity, tKey: 'svc.thyroid.t', dKey: 'svc.thyroid.d', accent: '#0d7377' },
  { icon: Flower2, tKey: 'svc.pcos.t', dKey: 'svc.pcos.d', accent: '#d63384' },
  { icon: Scale, tKey: 'svc.obesity.t', dKey: 'svc.obesity.d', accent: '#6a4c93' },
  { icon: Sun, tKey: 'svc.vitd.t', dKey: 'svc.vitd.d', accent: '#f4a261' },
  { icon: Dna, tKey: 'svc.adrenal.t', dKey: 'svc.adrenal.d', accent: '#2a9d8f' },
  { icon: Bone, tKey: 'svc.bone.t', dKey: 'svc.bone.d', accent: '#457b9d' },
  { icon: Video, tKey: 'svc.tele.t', dKey: 'svc.tele.d', accent: '#25d366' },
];

export default function Services() {
  const { t } = useLang();

  return (
    <section id="services" className="section section-alt">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">{t('services.eyebrow')}</span>
            <h2>{t('services.title')}</h2>
          </div>
        </Reveal>
        <div className="services-grid">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.tKey} delay={Math.min(i * 70, 420)}>
                <div className="service-card" style={{ ['--accent' as never]: s.accent }}>
                  <div className="service-icon"><Icon size={28} /></div>
                  <h3>{t(s.tKey)}</h3>
                  <p>{t(s.dKey)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
