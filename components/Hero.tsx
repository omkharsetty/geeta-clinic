'use client';

import Image from 'next/image';
import { MessageCircle, Phone, Stethoscope, Award, Sparkles, GraduationCap, Calendar, Globe } from 'lucide-react';
import { useLang } from './LanguageProvider';
import { LiveStatusFloating } from './LiveStatus';
import Reveal from './Reveal';
import { WA_URL, TEL } from '@/lib/translations';

export default function Hero() {
  const { t } = useLang();

  return (
    <section id="home" className="hero">
      <div className="hero-bg">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
      </div>
      <div className="container hero-inner">
        <div className="hero-content">
          <Reveal>
            <span className="badge">
              <span className="badge-dot" />
              <span>{t('hero.badge')}</span>
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1>
              {t('hero.title1')} <span className="accent">{t('hero.title2')}</span> {t('hero.title3')}{' '}
              <span className="accent">{t('hero.title4')}</span> {t('hero.title5')}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="hero-sub">{t('hero.sub')}</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="hero-ctas">
              <a href={WA_URL} className="btn btn-primary btn-lg" target="_blank" rel="noopener">
                <MessageCircle size={20} /> <span>{t('hero.chatWa')}</span>
              </a>
              <a href={TEL} className="btn btn-ghost btn-lg">
                <Phone size={20} /> <span>{t('hero.call')}</span>
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="hero-stats">
              <div className="stat">
                <GraduationCap className="stat-icon" size={22} />
                <strong>DM</strong>
                <span>{t('hero.stat1Title')}</span>
              </div>
              <div className="stat">
                <Calendar className="stat-icon" size={22} />
                <strong>6<span className="stat-sm">days/wk</span></strong>
                <span>{t('hero.stat2Title')}</span>
              </div>
              <div className="stat">
                <Globe className="stat-icon" size={22} />
                <strong>3<span className="stat-sm">langs</span></strong>
                <span>{t('hero.stat3Title')}</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="hero-visual">
            <div className="hero-photo-wrap">
              <Image
                src="/images/doctor.jpeg"
                alt="Dr. Geeta Annamaneni"
                fill
                sizes="(max-width: 1000px) 380px, 440px"
                className="hero-photo"
                priority
              />
              <div className="hero-photo-glow" />
              <div className="floating-card floating-card-1">
                <div className="fc-icon"><Stethoscope size={22} /></div>
                <div>
                  <div className="fc-title">{t('hero.fc1Title')}</div>
                  <LiveStatusFloating />
                </div>
              </div>
              <div className="floating-card floating-card-2">
                <div className="fc-icon"><Award size={22} /></div>
                <div>
                  <div className="fc-title">{t('hero.fc2Title')}</div>
                  <div className="fc-val">{t('hero.fc2Val')}</div>
                </div>
              </div>
              <div className="floating-card floating-card-3">
                <div className="fc-icon"><Sparkles size={22} /></div>
                <div>
                  <div className="fc-title">NMC</div>
                  <div className="fc-val">62613</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
