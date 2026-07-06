'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { X, Search, UserPlus, User, Phone } from 'lucide-react';
import { db } from '@/lib/firebase';
import { APPOINTMENT_SLOTS, SPECIALTIES } from '@/lib/portal-types';
import { PatientRow, profileToRow, StaffAppointment, todayStr } from './clinic-data';

const TYPES = ['In-Person Clinic', 'Video Teleconsultation'] as const;

export default function NewBookingModal({
  taken,
  onClose,
  onBooked,
}: {
  /** All existing appointments (both sources), used to block occupied slots. */
  taken: StaffAppointment[];
  onClose: () => void;
  onBooked: () => void;
}) {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PatientRow | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<string>(TYPES[0]);
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [date, setDate] = useState(todayStr());
  const [slot, setSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDocs(collection(db, 'users')).then((snap) => {
      const rows: PatientRow[] = [];
      snap.forEach((d) => rows.push(profileToRow(d.id, d.data())));
      rows.sort((a, b) => a.name.localeCompare(b.name));
      setPatients(rows);
    }).catch(() => {});
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const matches = q
    ? patients.filter((p) => p.name.toLowerCase().includes(q) || (p.phone || '').includes(q)).slice(0, 6)
    : [];

  const takenSlots = taken.filter((a) => a.date === date).map((a) => a.slot);
  const isSunday = new Date(date + 'T12:00:00').getDay() === 0;

  const bookingName = mode === 'existing' ? selected?.name || '' : name.trim();
  const bookingPhone = mode === 'existing' ? selected?.phone || phone.trim() : phone.trim();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!bookingName) { setError(mode === 'existing' ? 'Select a patient first.' : 'Enter the caller’s name.'); return; }
    if (bookingPhone.replace(/\D/g, '').length < 10) { setError('Enter a valid 10-digit phone number.'); return; }
    if (!date || !slot || isSunday) { setError('Pick a date (not Sunday) and a free slot.'); return; }
    if (takenSlots.includes(slot)) { setError('That slot was just taken — pick another.'); return; }

    setBusy(true);
    try {
      const randId = 'GEC-' + Math.floor(100000 + Math.random() * 900000);
      const data = {
        patientName: bookingName,
        phone: bookingPhone,
        date,
        slot,
        type,
        specialty,
        ...(notes.trim() ? { notes: notes.trim() } : {}),
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`GeetaEndocrineClinic-AP-${randId}`)}`,
      };
      if (mode === 'existing' && selected) {
        await addDoc(collection(db, 'users', selected.uid, 'appointments'), data);
      } else {
        await addDoc(collection(db, 'clinicBookings'), data);
      }
      onBooked();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.includes('permission')
        ? 'Permission denied — make sure the latest security rules are published.'
        : msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="book-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="New booking">
      <div className="book-modal clinic-book-modal" onClick={(e) => e.stopPropagation()}>
        <button className="book-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <h3>New booking</h3>

        <div className="clinic-mode-toggle">
          <button className={mode === 'existing' ? 'active' : ''} onClick={() => setMode('existing')}>
            <User size={14} /> Existing patient
          </button>
          <button className={mode === 'new' ? 'active' : ''} onClick={() => { setMode('new'); setSelected(null); }}>
            <UserPlus size={14} /> New caller
          </button>
        </div>

        <form onSubmit={submit} className="clinic-form">
          {mode === 'existing' ? (
            selected ? (
              <div className="clinic-selected-patient">
                <span className="clinic-avatar">{selected.name.charAt(0).toUpperCase()}</span>
                <span className="clinic-patient-main">
                  <strong>{selected.name}</strong>
                  <small>{selected.phone || selected.email}</small>
                </span>
                <button type="button" className="clinic-icon-btn" onClick={() => setSelected(null)} aria-label="Change patient">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="clinic-search">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search patient by name or phone…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                {matches.length > 0 && (
                  <div className="clinic-typeahead">
                    {matches.map((p) => (
                      <button type="button" key={p.uid} onClick={() => { setSelected(p); setQuery(''); }}>
                        <strong>{p.name}</strong>
                        <small>{p.phone || p.email}</small>
                      </button>
                    ))}
                  </div>
                )}
                {q && matches.length === 0 && (
                  <p className="clinic-empty">No match — use &ldquo;New caller&rdquo; instead.</p>
                )}
              </>
            )
          ) : (
            <>
              <label>Caller&rsquo;s name</label>
              <input type="text" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </>
          )}

          {(mode === 'new' || (selected && !selected.phone)) && (
            <>
              <label><Phone size={12} /> Phone</label>
              <input type="tel" maxLength={30} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </>
          )}

          <div className="clinic-form-2col">
            <div>
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((tp) => <option key={tp}>{tp}</option>)}
              </select>
            </div>
            <div>
              <label>Specialty</label>
              <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <label>Date</label>
          <input type="date" min={todayStr()} value={date} onChange={(e) => { setDate(e.target.value); setSlot(''); }} />
          {isSunday && <p className="clinic-error">Clinic is closed on Sundays.</p>}

          {!isSunday && (
            <>
              <label>Slot</label>
              <div className="portal-slots">
                {APPOINTMENT_SLOTS.map((sl) => {
                  const isTaken = takenSlots.includes(sl);
                  return (
                    <button
                      type="button"
                      key={sl}
                      disabled={isTaken}
                      className={`portal-slot ${slot === sl ? 'active' : ''} ${isTaken ? 'taken' : ''}`}
                      onClick={() => setSlot(sl)}
                    >
                      {sl}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <label>Notes (optional)</label>
          <input type="text" maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} />

          <button className="btn btn-primary btn-lg" disabled={busy || !slot || isSunday}>
            {busy ? 'Booking…' : 'Confirm booking'}
          </button>
          {error && <p className="clinic-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
