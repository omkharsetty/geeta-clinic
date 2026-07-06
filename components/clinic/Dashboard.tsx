'use client';

import { useState } from 'react';
import { CalendarDays, Users } from 'lucide-react';
import AppointmentsTab from './AppointmentsTab';
import PatientsTab from './PatientsTab';
import PatientDetail from './PatientDetail';

type Tab = 'appointments' | 'patients';

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('appointments');
  const [patientUid, setPatientUid] = useState<string | null>(null);

  if (patientUid) {
    return <PatientDetail uid={patientUid} onBack={() => setPatientUid(null)} />;
  }

  return (
    <div>
      <nav className="clinic-tabs">
        <button className={tab === 'appointments' ? 'active' : ''} onClick={() => setTab('appointments')}>
          <CalendarDays size={16} /> Appointments
        </button>
        <button className={tab === 'patients' ? 'active' : ''} onClick={() => setTab('patients')}>
          <Users size={16} /> Patients
        </button>
      </nav>
      {tab === 'appointments' && <AppointmentsTab onOpenPatient={setPatientUid} />}
      {tab === 'patients' && <PatientsTab onOpenPatient={setPatientUid} />}
    </div>
  );
}
