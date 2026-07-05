'use client';

import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { useLang } from './LanguageProvider';
import Reveal from './Reveal';

const schedule = [
  { key: 'day.sun', closed: true },
  { key: 'day.mon', closed: false },
  { key: 'day.tue', closed: false },
  { key: 'day.wed', closed: false },
  { key: 'day.thu', closed: false },
  { key: 'day.fri', closed: false },
  { key: 'day.sat', closed: false },
];

export default function Timings() {
  const { t } = useLang();
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    setToday(new Date().getDay());
  }, []);

  return (
    <section id="timings" className="section section-alt">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">{t('timings.eyebrow')}</span>
            <h2>{t('timings.title')}</h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="timings-card">
            <div className="timings-days">
              {schedule.map((d, i) => (
                <div key={d.key} className={`day-card ${today === i ? 'today' : ''} ${d.closed ? 'closed' : ''}`}>
                  <div className="day-name">{t(d.key)}</div>
                  <div className="day-times">
                    {d.closed ? <span>{t('day.closed')}</span> : (<><span>9:00 – 2:00</span><span>6:00 – 8:00</span></>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="timings-note">
              <Lightbulb className="timings-icon" size={20} />
              <p>{t('timings.note')}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
