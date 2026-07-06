'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signInAnonymously } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { ArrowLeft, MapPin, Video, CheckCircle2, MessageCircle, Phone as PhoneIcon, CalendarCheck } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { useLang } from '../LanguageProvider';
import LanguageToggle from '../LanguageToggle';
import { APPOINTMENT_SLOTS, SPECIALTIES } from '@/lib/portal-types';
import { WA_URL, TEL } from '@/lib/translations';

const todayStr = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function BookOnline() {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'In-Person Clinic' | 'Video Teleconsultation'>('In-Person Clinic');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ date: string; slot: string } | null>(null);

  const isSunday = date && new Date(date + 'T12:00:00').getDay() === 0;

  const reset = () => {
    setDone(null);
    setDate('');
    setSlot('');
    setNotes('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || phone.length !== 10) { setError(t('ob.errName')); return; }
    if (!date || !slot || isSunday) { setError(t('ob.errSlot')); return; }
    setBusy(true);
    try {
      if (!auth.currentUser) await signInAnonymously(auth);
      await addDoc(collection(db, 'webBookings'), {
        patientName: name.trim(),
        phone: `+91 ${phone}`,
        date,
        slot,
        type,
        specialty,
        status: 'Requested',
        createdAt: new Date().toISOString(),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      setDone({ date, slot });
    } catch (err) {
      console.error(err);
      setError('Something went wrong — please try again, or book on WhatsApp below.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="clinic obook">
      <div className="clinic-bg">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-grid-lines" />
      </div>

      <header className="clinic-header">
        <Link href="/" className="clinic-back">
          <ArrowLeft size={16} /> <span>Geeta Diabetes &amp; Endocrine Centre</span>
        </Link>
        <LanguageToggle />
      </header>

      <div className="clinic-center">
        {done ? (
          <div className="clinic-card clinic-login-card">
            <div className="clinic-login-icon obook-done-icon"><CheckCircle2 size={30} /></div>
            <h1>{t('ob.doneTitle')}</h1>
            <p className="clinic-sub">
              {new Date(done.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} · {done.slot}
              <br />{t('ob.doneSub')}
            </p>
            <div className="clinic-reminder-actions">
              <a className="btn btn-primary" href={WA_URL} target="_blank" rel="noopener">
                <MessageCircle size={16} /> {t('ob.doneWa')}
              </a>
              <a className="btn btn-ghost clinic-reminder-alt" href={TEL}>
                <PhoneIcon size={15} /> {t('hero.call')}
              </a>
            </div>
            <button className="clinic-link-btn" onClick={reset}>{t('ob.another')}</button>
          </div>
        ) : (
          <div className="clinic-card obook-card">
            <div className="obook-head">
              <Image src="/images/icon.png" alt="" width={46} height={46} />
              <div>
                <h1><CalendarCheck size={19} /> {t('ob.title')}</h1>
                <p className="clinic-sub">{t('ob.sub')}</p>
              </div>
            </div>

            <form onSubmit={submit} className="clinic-form">
              <div className="clinic-form-2col">
                <div>
                  <label>{t('ob.name')}</label>
                  <input type="text" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label>{t('ob.phone')}</label>
                  <div className="clinic-phone-row">
                    <span className="clinic-phone-prefix">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="10-digit"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                  </div>
                </div>
              </div>

              <label>{t('ob.type')}</label>
              <div className="clinic-mode-toggle">
                <button type="button" className={type === 'In-Person Clinic' ? 'active' : ''} onClick={() => setType('In-Person Clinic')}>
                  <MapPin size={14} /> {t('ob.inPerson')}
                </button>
                <button type="button" className={type === 'Video Teleconsultation' ? 'active' : ''} onClick={() => setType('Video Teleconsultation')}>
                  <Video size={14} /> {t('ob.video')}
                </button>
              </div>

              <div className="clinic-form-2col">
                <div>
                  <label>{t('ob.specialty')}</label>
                  <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                    {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label>{t('ob.date')}</label>
                  <input type="date" min={todayStr()} value={date} onChange={(e) => { setDate(e.target.value); setSlot(''); }} />
                </div>
              </div>
              {isSunday && <p className="clinic-error">{t('ob.sunday')}</p>}

              {date && !isSunday && (
                <>
                  <label>{t('ob.slot')}</label>
                  {(['Morning', 'Evening'] as const).map((period) => {
                    const slots = APPOINTMENT_SLOTS.filter((sl) =>
                      period === 'Morning'
                        ? sl.endsWith('AM') || sl.startsWith('12') || sl.startsWith('01')
                        : sl.endsWith('PM') && !sl.startsWith('12') && !sl.startsWith('01')
                    );
                    return (
                      <div key={period} className="clinic-slot-group">
                        <span className="clinic-slot-period">{period === 'Morning' ? t('ob.morning') : t('ob.evening')}</span>
                        <div className="clinic-slots">
                          {slots.map((sl) => (
                            <button
                              type="button"
                              key={sl}
                              className={`clinic-slot ${slot === sl ? 'active' : ''}`}
                              onClick={() => setSlot(sl)}
                            >
                              {sl.replace(' AM', '').replace(' PM', '')}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <p className="obook-subject-note">{t('ob.subjectNote')}</p>
                </>
              )}

              <label>{t('ob.notes')}</label>
              <input type="text" maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} />

              <button className="btn btn-primary btn-lg" disabled={busy || !date || !slot || !!isSunday}>
                {busy ? '…' : t('ob.submit')}
              </button>
              {error && <p className="clinic-error">{error}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
