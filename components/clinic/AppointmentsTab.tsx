'use client';

import { useState, useEffect } from 'react';
import { collectionGroup, collection, onSnapshot, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { CalendarDays, Phone, Video, MapPin, User, Plus, Trash2, PhoneCall, Send, Globe, Check } from 'lucide-react';
import { db } from '@/lib/firebase';
import { StaffAppointment, slotMinutes, todayStr, formatDate } from './clinic-data';
import NewBookingModal from './NewBookingModal';
import ReminderModal from './ReminderModal';
import { appointmentReminder } from '@/lib/reminders';

export default function AppointmentsTab({ onOpenPatient }: { onOpenPatient: (uid: string) => void }) {
  const [patientAppts, setPatientAppts] = useState<StaffAppointment[]>([]);
  const [clinicAppts, setClinicAppts] = useState<StaffAppointment[]>([]);
  const [webRequests, setWebRequests] = useState<StaffAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [remind, setRemind] = useState<StaffAppointment | null>(null);

  useEffect(() => {
    const onErr = (err: Error) => {
      setError(err.message.includes('permission')
        ? 'Permission denied — make sure the latest security rules are published.'
        : err.message);
      setLoading(false);
    };

    const unsub1 = onSnapshot(collectionGroup(db, 'appointments'), (snap) => {
      const rows: StaffAppointment[] = [];
      snap.forEach((d) => {
        const uid = d.ref.parent.parent?.id;
        if (!uid) return;
        rows.push({ id: d.id, uid, source: 'patient', ...(d.data() as Omit<StaffAppointment, 'id' | 'uid' | 'source'>) });
      });
      setPatientAppts(rows);
      setLoading(false);
    }, onErr);

    const unsub2 = onSnapshot(collection(db, 'clinicBookings'), (snap) => {
      const rows: StaffAppointment[] = [];
      snap.forEach((d) => {
        rows.push({ id: d.id, uid: '', source: 'clinic', ...(d.data() as Omit<StaffAppointment, 'id' | 'uid' | 'source'>) });
      });
      setClinicAppts(rows);
    }, onErr);

    const unsub3 = onSnapshot(collection(db, 'webBookings'), (snap) => {
      const rows: StaffAppointment[] = [];
      snap.forEach((d) => {
        rows.push({ id: d.id, uid: '', source: 'clinic', ...(d.data() as Omit<StaffAppointment, 'id' | 'uid' | 'source'>) });
      });
      rows.sort((a, b) => (a.date + slotMinutes(a.slot)).toString().localeCompare((b.date + slotMinutes(b.slot)).toString()));
      setWebRequests(rows);
    }, onErr);

    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  const confirmWebRequest = async (r: StaffAppointment) => {
    try {
      const randId = 'GEC-' + Math.floor(100000 + Math.random() * 900000);
      await addDoc(collection(db, 'clinicBookings'), {
        patientName: r.patientName,
        phone: r.phone,
        date: r.date,
        slot: r.slot,
        type: r.type,
        specialty: r.specialty,
        ...(r.notes ? { notes: r.notes } : {}),
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`GeetaEndocrineClinic-AP-${randId}`)}`,
      });
      await deleteDoc(doc(db, 'webBookings', r.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const rejectWebRequest = async (r: StaffAppointment) => {
    if (!window.confirm(`Remove ${r.patientName}'s online request for ${r.slot} on ${formatDate(r.date)}?`)) return;
    try {
      await deleteDoc(doc(db, 'webBookings', r.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const appointments = [...patientAppts, ...clinicAppts];

  const cancel = async (a: StaffAppointment) => {
    if (!window.confirm(`Cancel ${a.patientName}'s ${a.slot} appointment on ${formatDate(a.date)}?`)) return;
    try {
      await deleteDoc(a.source === 'clinic'
        ? doc(db, 'clinicBookings', a.id)
        : doc(db, 'users', a.uid, 'appointments', a.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const today = todayStr();
  const bySlot = (a: StaffAppointment, b: StaffAppointment) =>
    a.date === b.date ? slotMinutes(a.slot) - slotMinutes(b.slot) : a.date.localeCompare(b.date);

  const todays = appointments.filter((a) => a.date === today).sort(bySlot);
  const upcoming = appointments.filter((a) => a.date > today).sort(bySlot);
  const past = appointments.filter((a) => a.date < today).sort(bySlot).reverse().slice(0, 10);

  const Row = ({ a }: { a: StaffAppointment }) => (
    <div className="clinic-appt-row" onClick={() => a.uid && onOpenPatient(a.uid)} role={a.uid ? 'button' : undefined}>
      <span className="clinic-appt-slot">{a.slot}</span>
      <span className="clinic-appt-main">
        <strong>
          {a.source === 'clinic' ? <PhoneCall size={13} /> : <User size={13} />} {a.patientName}
          {a.source === 'clinic' && <em className="clinic-walkin-tag">phone booking</em>}
        </strong>
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
      {a.phone && (
        <button
          className="clinic-icon-btn"
          onClick={(e) => { e.stopPropagation(); setRemind(a); }}
          aria-label="Send reminder"
          title="Send reminder"
        >
          <Send size={15} />
        </button>
      )}
      <button
        className="clinic-icon-btn"
        onClick={(e) => { e.stopPropagation(); cancel(a); }}
        aria-label="Cancel appointment"
        title="Cancel appointment"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  const Section = ({ title, rows, empty }: { title: string; rows: StaffAppointment[]; empty: string }) => (
    <div className="clinic-appt-section">
      <h4>{title} <span className="clinic-count">{rows.length}</span></h4>
      {rows.length === 0 && empty && <p className="clinic-empty">{empty}</p>}
      {rows.map((a) => <Row key={`${a.source}-${a.uid}-${a.id}`} a={a} />)}
    </div>
  );

  if (loading) return <div className="clinic-center"><div className="clinic-spinner" /></div>;

  return (
    <div className="clinic-appts">
      <div className="clinic-appts-toolbar">
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Plus size={16} /> New booking
        </button>
      </div>
      {error && <p className="clinic-error">{error}</p>}

      {webRequests.length > 0 && (
        <div className="clinic-appt-section">
          <h4><Globe size={13} /> Online requests — confirm with patient <span className="clinic-count">{webRequests.length}</span></h4>
          {webRequests.map((r) => (
            <div key={r.id} className="clinic-appt-row clinic-web-request">
              <span className="clinic-appt-slot">{r.slot}</span>
              <span className="clinic-appt-main">
                <strong><Globe size={13} /> {r.patientName}</strong>
                <small>{r.specialty}{r.notes ? ` — ${r.notes}` : ''}</small>
              </span>
              <span className="clinic-appt-side">
                <small className="clinic-appt-date">{formatDate(r.date)}</small>
                <small className="clinic-appt-type">
                  {r.type === 'Video Teleconsultation' ? <Video size={12} /> : <MapPin size={12} />}
                  {r.type === 'Video Teleconsultation' ? 'Video' : 'Clinic'}
                </small>
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="clinic-appt-phone"><Phone size={12} /> {r.phone}</a>
                )}
              </span>
              <button className="btn btn-primary clinic-fu-book" onClick={() => confirmWebRequest(r)} title="Confirm booking">
                <Check size={14} /> Confirm
              </button>
              <button className="clinic-icon-btn" onClick={() => rejectWebRequest(r)} aria-label="Remove request" title="Remove request">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Section title="Today" rows={todays} empty="No appointments today." />
      <Section title="Upcoming" rows={upcoming} empty="Nothing scheduled ahead." />
      {past.length > 0 && <Section title="Recent" rows={past} empty="" />}
      {appointments.length === 0 && !error && (
        <p className="clinic-empty">
          <CalendarDays size={15} /> No appointments yet — create one with &ldquo;New booking&rdquo;, or they appear when patients book via the app.
        </p>
      )}

      {showNew && (
        <NewBookingModal
          taken={appointments}
          onClose={() => setShowNew(false)}
          onBooked={() => {}}
        />
      )}
      {remind && (
        <ReminderModal
          patientName={remind.patientName}
          phone={remind.phone}
          initialMessage={appointmentReminder(remind.patientName, remind.date, remind.slot, remind.type)}
          onClose={() => setRemind(null)}
        />
      )}
    </div>
  );
}
