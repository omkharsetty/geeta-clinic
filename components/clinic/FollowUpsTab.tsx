'use client';

import { useState } from 'react';
import { Phone, CalendarPlus, CheckCircle2, BellRing } from 'lucide-react';
import { FollowUpRow } from './useFollowUps';
import { StaffAppointment, formatDate } from './clinic-data';
import NewBookingModal from './NewBookingModal';

export default function FollowUpsTab({
  rows,
  error,
  taken,
  onOpenPatient,
}: {
  rows: FollowUpRow[];
  error: string;
  taken: StaffAppointment[];
  onOpenPatient: (uid: string) => void;
}) {
  const [bookFor, setBookFor] = useState<FollowUpRow | null>(null);

  const buckets: { key: FollowUpRow['bucket']; title: string; empty?: string }[] = [
    { key: 'overdue', title: 'Overdue — call these patients', empty: 'Nothing overdue. 🎉' },
    { key: 'today', title: 'Due today', empty: 'No follow-ups due today.' },
    { key: 'upcoming', title: 'Coming up' },
    { key: 'scheduled', title: 'Already scheduled' },
  ];

  const Row = ({ r }: { r: FollowUpRow }) => (
    <div
      className={`clinic-appt-row clinic-fu-row ${r.bucket === 'overdue' ? 'overdue' : ''}`}
      onClick={() => onOpenPatient(r.uid)}
      role="button"
    >
      <span className={`clinic-fu-date ${r.bucket === 'overdue' ? 'overdue' : ''}`}>
        {formatDate(r.followUpDate)}
      </span>
      <span className="clinic-appt-main">
        <strong>{r.patient?.name || 'Patient'}</strong>
        <small>{r.reason} · visit {new Date(r.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</small>
      </span>
      <span className="clinic-fu-actions" onClick={(e) => e.stopPropagation()}>
        {r.patient?.phone && (
          <a href={`tel:${r.patient.phone}`} className="clinic-icon-btn" title="Call patient" aria-label="Call patient">
            <Phone size={15} />
          </a>
        )}
        {r.scheduled ? (
          <span className="clinic-fu-scheduled"><CheckCircle2 size={14} /> Scheduled</span>
        ) : (
          <button className="btn btn-primary clinic-fu-book" onClick={() => setBookFor(r)}>
            <CalendarPlus size={14} /> Book now
          </button>
        )}
      </span>
    </div>
  );

  return (
    <div>
      {error && <p className="clinic-error">{error}</p>}
      {rows.length === 0 && !error && (
        <p className="clinic-empty">
          <BellRing size={15} /> No follow-ups yet — they appear here when the doctor sets a follow-up date on a visit.
        </p>
      )}
      {buckets.map(({ key, title, empty }) => {
        const list = rows.filter((r) => r.bucket === key);
        if (list.length === 0 && !empty) return null;
        if (list.length === 0 && rows.length === 0) return null;
        return (
          <div className="clinic-appt-section" key={key}>
            <h4>{title} <span className="clinic-count">{list.length}</span></h4>
            {list.length === 0 && empty && <p className="clinic-empty">{empty}</p>}
            {list.map((r) => <Row key={r.uid} r={r} />)}
          </div>
        );
      })}

      {bookFor && bookFor.patient && (
        <NewBookingModal
          taken={taken}
          preselect={bookFor.patient}
          presetDate={bookFor.followUpDate}
          onClose={() => setBookFor(null)}
          onBooked={() => {}}
        />
      )}
    </div>
  );
}
