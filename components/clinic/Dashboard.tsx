'use client';

import { useState } from 'react';
import { CalendarDays, Users, BellRing } from 'lucide-react';
import AppointmentsTab from './AppointmentsTab';
import PatientsTab from './PatientsTab';
import PatientDetail from './PatientDetail';
import FollowUpsTab from './FollowUpsTab';
import { useFollowUps } from './useFollowUps';
import { useStaffAppointments } from './useStaffAppointments';

type Tab = 'appointments' | 'followups' | 'patients';

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('appointments');
  const [patientUid, setPatientUid] = useState<string | null>(null);
  const { rows: followUps, actionable, error: fuError } = useFollowUps();
  const allAppointments = useStaffAppointments();

  if (patientUid) {
    return <PatientDetail uid={patientUid} onBack={() => setPatientUid(null)} />;
  }

  return (
    <div>
      <nav className="clinic-tabs">
        <button className={tab === 'appointments' ? 'active' : ''} onClick={() => setTab('appointments')}>
          <CalendarDays size={16} /> Appointments
        </button>
        <button className={tab === 'followups' ? 'active' : ''} onClick={() => setTab('followups')}>
          <BellRing size={16} /> Follow-ups
          {actionable > 0 && <span className="clinic-badge">{actionable}</span>}
        </button>
        <button className={tab === 'patients' ? 'active' : ''} onClick={() => setTab('patients')}>
          <Users size={16} /> Patients
        </button>
      </nav>
      {tab === 'appointments' && <AppointmentsTab onOpenPatient={setPatientUid} />}
      {tab === 'followups' && (
        <FollowUpsTab rows={followUps} error={fuError} taken={allAppointments} onOpenPatient={setPatientUid} />
      )}
      {tab === 'patients' && <PatientsTab onOpenPatient={setPatientUid} />}
    </div>
  );
}
