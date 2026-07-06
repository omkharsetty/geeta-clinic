'use client';

import Image from 'next/image';
import { X, Printer } from 'lucide-react';
import { Visit, rxInstruction, CLINIC_LETTERHEAD as L } from '@/lib/visit-types';
import { UserProfile } from '@/lib/portal-types';

export default function PrescriptionPrint({
  visit,
  profile,
  onClose,
}: {
  visit: Visit;
  profile: UserProfile | null;
  onClose: () => void;
}) {
  const d = new Date(visit.date);
  const v = visit.vitals;

  return (
    <div className="rx-overlay">
      <div className="rx-toolbar">
        <button className="btn btn-primary" onClick={() => window.print()}>
          <Printer size={16} /> Print
        </button>
        <button className="clinic-icon-btn" onClick={onClose} aria-label="Close"><X size={17} /></button>
      </div>

      <div className="rx-sheet">
        <header className="rx-head">
          <Image src="/images/icon.png" alt="" width={64} height={64} unoptimized />
          <div className="rx-head-main">
            <h1>{L.name}</h1>
            <p><strong>{L.doctor}</strong> · {L.quals}</p>
            <p>{L.reg}</p>
          </div>
          <div className="rx-head-side">
            <p>{L.phone}</p>
            <p>{L.timings}</p>
          </div>
        </header>
        <p className="rx-address">{L.address}</p>
        <hr />

        <div className="rx-patient">
          <span><strong>Patient:</strong> {profile?.name || 'Patient'}</span>
          {profile?.phone && <span><strong>Phone:</strong> {profile.phone}</span>}
          <span><strong>Date:</strong> {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        {v && Object.keys(v).length > 0 && (
          <div className="rx-vitals">
            {v.bp && <span>BP: <strong>{v.bp}</strong></span>}
            {v.pulse && <span>Pulse: <strong>{v.pulse}</strong></span>}
            {v.weightKg && <span>Weight: <strong>{v.weightKg} kg</strong></span>}
            {v.heightCm && <span>Height: <strong>{v.heightCm} cm</strong></span>}
            {v.sugar && <span>Sugar ({v.sugarType}): <strong>{v.sugar} mg/dL</strong></span>}
          </div>
        )}

        {(visit.complaint || visit.diagnosis) && (
          <div className="rx-notes">
            {visit.complaint && <p><strong>Complaint:</strong> {visit.complaint}</p>}
            {visit.diagnosis && <p><strong>Diagnosis:</strong> {visit.diagnosis}</p>}
          </div>
        )}

        {visit.prescriptions.length > 0 && (
          <>
            <h2 className="rx-symbol">℞</h2>
            <table className="rx-table">
              <thead>
                <tr><th>#</th><th>Medicine</th><th>Directions</th></tr>
              </thead>
              <tbody>
                {visit.prescriptions.map((r, i) => {
                  const ins = rxInstruction(r);
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td className="rx-med">{r.medicine}{r.notes ? <small> — {r.notes}</small> : null}</td>
                      <td>
                        <div>{ins.en}</div>
                        <div className="rx-te">{ins.te}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {visit.advice && (
          <p className="rx-advice"><strong>Advice:</strong> {visit.advice}</p>
        )}
        {visit.followUpDate && (
          <p className="rx-followup">
            <strong>Follow-up:</strong>{' '}
            {new Date(visit.followUpDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}

        <footer className="rx-foot">
          <div className="rx-sign">
            <span>{L.doctor}</span>
            <small>{L.quals} · {L.reg}</small>
          </div>
        </footer>
      </div>
    </div>
  );
}
