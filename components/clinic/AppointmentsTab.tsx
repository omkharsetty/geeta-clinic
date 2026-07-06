'use client';

import { useState, useEffect } from 'react';
import { collectionGroup, onSnapshot } from 'firebase/firestore';
import { CalendarDays, Phone, Video, MapPin, User } from 'lucide-react';
import { db } from '@/lib/firebase';
import { StaffAppointment, slotMinutes, todayStr, formatDate } from './clinic-data';

export default function AppointmentsTab({ onOpenPatient }: { onOpenPatient: (uid: string) => void }) {
  const [appointments, setAppointments] = useState<StaffAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collectionGroup(db, 'appointments'),
      (snap) => {
        const rows: StaffAppointment[] = [];
        snap.forEach((d) => {
          const uid = d.ref.parent.parent?.id;
          if (!uid) return;
          rows.push({ id: d.id, uid, ...(d.data() as Omit<StaffAppointment, 'id' | 'uid'>) });
        });
        setAppointments(rows);
        setLoading(false);
      },
      (err) => {
        setError(err.message.includes('permission')
          ? 'Permission denied — make sure the latest security rules are published.'
          : err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const today = todayStr();
  const bySlot = (a: StaffAppointment, b: StaffAppointment) =>
    a.date === b.date ? slotMinutes(a.slot) - slotMinutes(b.slot) : a.date.localeCompare(b.date);

  const todays = appointments.filter((a) => a.date === today).sort(bySlot);
  const upcoming = appointments.filter((a) => a.date > today).sort(bySlot);
  const past = appointments.filter((a) => a.date < today).sort(bySlot).reverse().slice(0, 10);

  const Section = ({ title, rows, empty }: { title: string; rows: StaffAppointment[]; empty: string }) => (
    <div className="clinic-appt-section">
      <h4>{title} <span className="clinic-count">{rows.length}</span></h4>
      {rows.length === 0 && <p className="clinic-empty">{empty}</p>}
      {rows.map((a) => (
        <button key={`${a.uid}-${a.id}`} className="clinic-appt-row" onClick={() => onOpenPatient(a.uid)}>
          <span className="clinic-appt-slot">{a.slot}</span>
          <span className="clinic-appt-main">
            <strong><User size={13} /> {a.patientName}</strong>
            <small>{a.specialty}{a.notes ? ` — ${a.notes}` : ''}</small>
          </span>
          <span className="clinic-appt-side">
            <small className="clinic-appt-date">{formatDate(a.date)}</small>
            <small className="clinic-appt-type">
              {a.type === 'Video Teleconsultation' ? <Video size={12} /> : <MapPin size={12} />}
              {a.type === 'Video Teleconsultation' ? 'Video' : 'Clinic'}
            </small>
            {a.phone && (
              <a href={`tel:${a.phone}`} onClick={(e) => e.stopPropagation()} className="clinic-appt-phone">
                <Phone size={12} /> {a.phone}
              </a>
            )}
          </span>
        </button>
      ))}
    </div>
  );

  if (loading) return <div className="clinic-center"><div className="clinic-spinner" /></div>;
  if (error) return <p className="clinic-error">{error}</p>;

  return (
    <div className="clinic-appts">
      <Section title="Today" rows={todays} empty="No appointments today." />
      <Section title="Upcoming" rows={upcoming} empty="Nothing scheduled ahead." />
      {past.length > 0 && <Section title="Recent" rows={past} empty="" />}
      {appointments.length === 0 && (
        <p className="clinic-empty">
          <CalendarDays size={15} /> No appointments in the system yet — they appear here when patients book via the app or website.
        </p>
      )}
    </div>
  );
}
