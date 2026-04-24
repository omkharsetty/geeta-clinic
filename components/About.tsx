'use client';

import Image from 'next/image';
import { useLang } from './LanguageProvider';
import Reveal from './Reveal';

export default function About() {
  const { t } = useLang();

  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">{t('about.eyebrow')}</span>
            <h2>{t('about.title')}</h2>
          </div>
        </Reveal>
        <div className="about-grid">
          <Reveal>
            <div className="about-photo">
              <div className="photo-frame">
                <Image
                  src="/images/doctor.jpeg"
                  alt="Dr. Geeta Annamaneni"
                  width={380}
                  height={506}
                  className="doctor-photo"
                />
                <div className="photo-deco" />
              </div>
              <div className="photo-badge">
                <strong>Dr. Geeta Annamaneni</strong>
                <span>MBBS · MD · DM (Endocrinology)</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="about-text">
              <p className="lead">{t('about.lead')}</p>
              <p>{t('about.body')}</p>
              <div className="creds-grid">
                <div className="cred">
                  <span className="cred-label">MBBS</span>
                  <span className="cred-desc">{t('about.mbbs')}</span>
                </div>
                <div className="cred">
                  <span className="cred-label">MD</span>
                  <span className="cred-desc">{t('about.md')}</span>
                </div>
                <div className="cred highlight">
                  <span className="cred-label">DM</span>
                  <span className="cred-desc">{t('about.dm')}</span>
                </div>
                <div className="cred">
                  <span className="cred-label">NMC</span>
                  <span className="cred-desc">Reg. No 62613</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
