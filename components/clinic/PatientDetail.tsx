'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import {
  ArrowLeft, Phone, MapPin, Droplet, Activity, CalendarDays, FileText, Download,
  Stethoscope, Plus, Printer,
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { GlucoseLog, ThyroidLog, Appointment, ExternalReport, UserProfile } from '@/lib/portal-types';
import { Visit } from '@/lib/visit-types';
import { slotMinutes, formatDate } from './clinic-data';
import VisitForm from './VisitForm';
import PrescriptionPrint from './PrescriptionPrint';

const glucoseClass = (v: number, type: string) => {
  const high = type === 'Fasting' ? 126 : 200;
  if (v < 70) return 'low';
  if (v >= high) return 'high';
  return 'normal';
};

export default function PatientDetail({ uid, onBack }: { uid: string; onBack: () => void }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [glucose, setGlucose] = useState<GlucoseLog[]>([]);
  const [thyroid, setThyroid] = useState<ThyroidLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<ExternalReport[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [printVisit, setPrintVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [prof, g, t, a, r, vi] = await Promise.all([
          getDoc(doc(db, 'users', uid)),
          getDocs(collection(db, 'users', uid, 'glucoseLogs')),
          getDocs(collection(db, 'users', uid, 'thyroidLogs')),
          getDocs(collection(db, 'users', uid, 'appointments')),
          getDocs(collection(db, 'users', uid, 'externalReports')),
          getDocs(collection(db, 'users', uid, 'visits')),
        ]);
        setProfile(prof.exists() ? (prof.data() as UserProfile) : null);

        const gl: GlucoseLog[] = [];
        g.forEach((d) => gl.push({ id: d.id, ...d.data() } as GlucoseLog));
        gl.sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime());
        setGlucose(gl);

        const tl: ThyroidLog[] = [];
        t.forEach((d) => tl.push({ id: d.id, ...d.data() } as ThyroidLog));
        tl.sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime());
        setThyroid(tl);

        const al: Appointment[] = [];
        a.forEach((d) => al.push({ id: d.id, ...d.data() } as Appointment));
        al.sort((x, y) => (y.date + slotMinutes(y.slot)).toString().localeCompare((x.date + slotMinutes(x.slot)).toString()));
        setAppointments(al);

        const rl: ExternalReport[] = [];
        r.forEach((d) => rl.push({ id: d.id, ...d.data() } as ExternalReport));
        rl.sort((x, y) => new Date(y.uploadedAt).getTime() - new Date(x.uploadedAt).getTime());
        setReports(rl);

        const vl: Visit[] = [];
        vi.forEach((d) => vl.push({ id: d.id, ...d.data() } as Visit));
        vl.sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime());
        setVisits(vl);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg.includes('permission')
          ? 'Permission denied — make sure the latest security rules are published.'
          : msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [uid]);

  if (loading) return <div className="clinic-center"><div className="clinic-spinner" /></div>;

  return (
    <div className="clinic-patient-detail">
      <button className="clinic-back-btn" onClick={onBack}>
        <ArrowLeft size={15} /> All patients
      </button>

      {error && <p className="clinic-error">{error}</p>}

      <div className="clinic-detail-head">
        <span className="clinic-avatar clinic-avatar-lg">{(profile?.name || 'P').charAt(0).toUpperCase()}</span>
        <div style={{ flex: 1 }}>
          <h2>{profile?.name || 'Patient'}</h2>
          <p className="clinic-detail-meta">
            {profile?.phone && <span><Phone size={12} /> <a href={`tel:${profile.phone}`}>{profile.phone}</a></span>}
            {profile?.address && <span><MapPin size={12} /> {profile.address}</span>}
            <span>{profile?.email}</span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowVisitForm(true)}>
          <Plus size={16} /> New visit
        </button>
      </div>

      <div className="clinic-card clinic-visits-card">
        <h3><Stethoscope size={16} /> Visits <span className="clinic-count">{visits.length}</span></h3>
        {visits.length === 0 && <p className="clinic-empty">No visits recorded yet — use &ldquo;New visit&rdquo; during a consultation.</p>}
        <div className="clinic-mini-list">
          {visits.map((v) => (
            <div key={v.id} className="clinic-mini-row clinic-visit-row">
              <span className="clinic-mini-date" style={{ minWidth: 88 }}>
                {new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
              </span>
              <span className="clinic-mini-main">
                {v.diagnosis || v.complaint || 'Consultation'}
                <br />
                <small>
                  {v.prescriptions.length} medicine{v.prescriptions.length === 1 ? '' : 's'}
                  {v.followUpDate ? ` · follow-up ${formatDate(v.followUpDate)}` : ''} · by {v.createdBy}
                </small>
              </span>
              <button className="clinic-icon-btn" onClick={() => setPrintVisit(v)} aria-label="Print prescription" title="Print prescription">
                <Printer size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="clinic-detail-grid">
        <div className="clinic-card">
          <h3><Droplet size={16} /> Glucose <span className="clinic-count">{glucose.length}</span></h3>
          {glucose.length === 0 && <p className="clinic-empty">No readings.</p>}
          <div className="clinic-mini-list">
            {glucose.slice(0, 15).map((l) => (
              <div key={l.id} className="clinic-mini-row">
                <span className={`clinic-glucose ${glucoseClass(l.value, l.type)}`}>{l.value}</span>
                <span className="clinic-mini-main">{l.type}</span>
                <span className="clinic-mini-date">
                  {new Date(l.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="clinic-card">
          <h3><Activity size={16} /> Thyroid <span className="clinic-count">{thyroid.length}</span></h3>
          {thyroid.length === 0 && <p className="clinic-empty">No entries.</p>}
          <div className="clinic-mini-list">
            {thyroid.slice(0, 15).map((l) => (
              <div key={l.id} className="clinic-mini-row">
                <span className="clinic-glucose normal">{l.doseMcg}<small>mcg</small></span>
                <span className="clinic-mini-main">Energy {l.energyLevel}/5{l.weightKg ? ` · ${l.weightKg}kg` : ''}</span>
                <span className="clinic-mini-date">{l.date.replace(/^\w+\s/, '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="clinic-card">
          <h3><CalendarDays size={16} /> Appointments <span className="clinic-count">{appointments.length}</span></h3>
          {appointments.length === 0 && <p className="clinic-empty">No appointments.</p>}
          <div className="clinic-mini-list">
            {appointments.slice(0, 15).map((a) => (
              <div key={a.id} className="clinic-mini-row">
                <span className="clinic-mini-slot">{a.slot}</span>
                <span className="clinic-mini-main">{a.specialty}<br /><small>{a.type}</small></span>
                <span className="clinic-mini-date">{formatDate(a.date)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="clinic-card">
          <h3><FileText size={16} /> Reports <span className="clinic-count">{reports.length}</span></h3>
          {reports.length === 0 && <p className="clinic-empty">No uploads.</p>}
          <div className="clinic-mini-list">
            {reports.map((r) => (
              <div key={r.id} className="clinic-mini-row">
                <span className="clinic-file-badge">{r.fileType.toUpperCase()}</span>
                <span className="clinic-mini-main">{r.fileName}</span>
                <a className="clinic-icon-btn" href={r.fileData} download={r.fileName} aria-label="Download">
                  <Download size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showVisitForm && (
        <VisitForm
          uid={uid}
          patientName={profile?.name || 'Patient'}
          onClose={() => setShowVisitForm(false)}
          onSaved={(v) => {
            setVisits((prev) => [v, ...prev]);
            setShowVisitForm(false);
            setPrintVisit(v);
          }}
        />
      )}
      {printVisit && (
        <PrescriptionPrint visit={printVisit} profile={profile} onClose={() => setPrintVisit(null)} />
      )}
    </div>
  );
}
