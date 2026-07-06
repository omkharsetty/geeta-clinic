'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { X, Plus, Trash2, Stethoscope } from 'lucide-react';
import { db } from '@/lib/firebase';
import { RxItem, Visit, Vitals, COMMON_MEDS, RX_TIMINGS } from '@/lib/visit-types';
import { useClinicAuth } from './ClinicAuthProvider';

const emptyRx = (): RxItem => ({ medicine: '', pattern: '1-0-1', timing: 'After food', durationDays: 30 });

export default function VisitForm({
  uid,
  patientName,
  onClose,
  onSaved,
}: {
  uid: string;
  patientName: string;
  onClose: () => void;
  onSaved: (visit: Visit) => void;
}) {
  const { role } = useClinicAuth();
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [sugar, setSugar] = useState('');
  const [sugarType, setSugarType] = useState<'Fasting' | 'Post-Prandial' | 'Random'>('Fasting');
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [rx, setRx] = useState<RxItem[]>([emptyRx()]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const setRxField = (i: number, field: keyof RxItem, value: string | number) => {
    setRx((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  };
  const setPatternPart = (i: number, part: 0 | 1 | 2, value: string) => {
    setRx((rows) => rows.map((r, idx) => {
      if (idx !== i) return r;
      const parts = r.pattern.split('-');
      while (parts.length < 3) parts.push('0');
      parts[part] = value;
      return { ...r, pattern: parts.join('-') };
    }));
  };

  const isDoctor = role === 'doctor';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const meds = isDoctor ? rx.filter((r) => r.medicine.trim()) : [];
    setBusy(true);
    try {
      const vitals: Vitals = {
        ...(bp.trim() ? { bp: bp.trim() } : {}),
        ...(pulse ? { pulse: Number(pulse) } : {}),
        ...(weight ? { weightKg: Number(weight) } : {}),
        ...(height ? { heightCm: Number(height) } : {}),
        ...(sugar ? { sugar: Number(sugar), sugarType } : {}),
      };
      const data = {
        date: new Date().toISOString(),
        createdBy: (role || 'staff') as 'doctor' | 'staff',
        prescriptions: meds.map((r) => ({
          medicine: r.medicine.trim(),
          pattern: r.pattern,
          timing: r.timing,
          durationDays: Number(r.durationDays) || 0,
          ...(r.notes?.trim() ? { notes: r.notes.trim() } : {}),
        })),
        ...(Object.keys(vitals).length ? { vitals } : {}),
        ...(complaint.trim() ? { complaint: complaint.trim() } : {}),
        // Clinical fields are doctor-only (also enforced by security rules)
        ...(isDoctor && diagnosis.trim() ? { diagnosis: diagnosis.trim() } : {}),
        ...(isDoctor && advice.trim() ? { advice: advice.trim() } : {}),
        ...(isDoctor && followUp ? { followUpDate: followUp } : {}),
      };
      const ref = await addDoc(collection(db, 'users', uid, 'visits'), data);
      onSaved({ id: ref.id, ...data } as Visit);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.includes('permission')
        ? 'Permission denied — make sure the latest security rules are published.'
        : msg);
      setBusy(false);
    }
  };

  return (
    <div className="book-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="New visit">
      <div className="book-modal clinic-book-modal clinic-visit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="book-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <h3><Stethoscope size={18} /> {isDoctor ? 'New visit' : 'Record vitals'} — {patientName}</h3>
        {!isDoctor && (
          <p className="clinic-sub" style={{ marginTop: -4 }}>
            Staff can record vitals and the patient&rsquo;s complaint. Diagnosis and prescriptions are added by the doctor.
          </p>
        )}

        <form onSubmit={submit} className="clinic-form">
          <label>Vitals</label>
          <div className="clinic-vitals-grid">
            <input type="text" placeholder="BP (120/80)" value={bp} onChange={(e) => setBp(e.target.value)} maxLength={10} />
            <input type="number" placeholder="Pulse" value={pulse} onChange={(e) => setPulse(e.target.value)} min={20} max={250} />
            <input type="number" placeholder="Weight kg" value={weight} onChange={(e) => setWeight(e.target.value)} min={1} max={400} step="0.1" />
            <input type="number" placeholder="Height cm" value={height} onChange={(e) => setHeight(e.target.value)} min={30} max={250} />
            <input type="number" placeholder="Sugar mg/dL" value={sugar} onChange={(e) => setSugar(e.target.value)} min={10} max={1000} />
            <select value={sugarType} onChange={(e) => setSugarType(e.target.value as typeof sugarType)}>
              <option>Fasting</option>
              <option>Post-Prandial</option>
              <option>Random</option>
            </select>
          </div>

          {isDoctor ? (
            <div className="clinic-form-2col">
              <div>
                <label>Complaint</label>
                <textarea rows={2} maxLength={2000} value={complaint} onChange={(e) => setComplaint(e.target.value)} />
              </div>
              <div>
                <label>Diagnosis</label>
                <textarea rows={2} maxLength={2000} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
              </div>
            </div>
          ) : (
            <>
              <label>Complaint</label>
              <textarea rows={2} maxLength={2000} value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Why has the patient come in?" />
            </>
          )}

          {isDoctor && (<>
          <label>Prescription</label>
          <datalist id="common-meds">
            {COMMON_MEDS.map((m) => <option key={m} value={m} />)}
          </datalist>
          <div className="clinic-rx-list">
            {rx.map((r, i) => (
              <div key={i} className="clinic-rx-row">
                <input
                  className="clinic-rx-med"
                  type="text"
                  list="common-meds"
                  placeholder="Medicine…"
                  value={r.medicine}
                  onChange={(e) => setRxField(i, 'medicine', e.target.value)}
                  maxLength={120}
                />
                <div className="clinic-rx-pattern" title="Morning – Afternoon – Night">
                  {([0, 1, 2] as const).map((part) => (
                    <select
                      key={part}
                      value={r.pattern.split('-')[part] || '0'}
                      onChange={(e) => setPatternPart(i, part, e.target.value)}
                      aria-label={['Morning', 'Afternoon', 'Night'][part]}
                    >
                      {['0', '1', '2', '½'].map((v) => <option key={v}>{v}</option>)}
                    </select>
                  ))}
                </div>
                <select value={r.timing} onChange={(e) => setRxField(i, 'timing', e.target.value)}>
                  {RX_TIMINGS.map((t) => <option key={t}>{t}</option>)}
                </select>
                <input
                  className="clinic-rx-days"
                  type="number"
                  min={1}
                  max={365}
                  value={r.durationDays}
                  onChange={(e) => setRxField(i, 'durationDays', e.target.value)}
                  aria-label="Days"
                />
                <span className="clinic-rx-days-label">days</span>
                <button type="button" className="clinic-icon-btn" onClick={() => setRx((rows) => rows.filter((_, idx) => idx !== i))} aria-label="Remove">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="clinic-add-rx" onClick={() => setRx((rows) => [...rows, emptyRx()])}>
            <Plus size={14} /> Add medicine
          </button>

          <div className="clinic-form-2col">
            <div>
              <label>Advice</label>
              <textarea rows={2} maxLength={2000} value={advice} onChange={(e) => setAdvice(e.target.value)} placeholder="Diet, exercise, tests to get done…" />
            </div>
            <div>
              <label>Follow-up date</label>
              <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
            </div>
          </div>
          </>)}

          <button className="btn btn-primary btn-lg" disabled={busy}>
            {busy ? 'Saving…' : isDoctor ? 'Save visit' : 'Save vitals'}
          </button>
          {error && <p className="clinic-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
