'use client';

import { useState, useEffect } from 'react';
import { collectionGroup, collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StaffAppointment } from './clinic-data';

/** Live list of all appointments (patient bookings + clinic phone bookings). */
export function useStaffAppointments() {
  const [patientAppts, setPatientAppts] = useState<StaffAppointment[]>([]);
  const [clinicAppts, setClinicAppts] = useState<StaffAppointment[]>([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collectionGroup(db, 'appointments'), (snap) => {
      const rows: StaffAppointment[] = [];
      snap.forEach((d) => {
        const uid = d.ref.parent.parent?.id;
        if (!uid) return;
        rows.push({ id: d.id, uid, source: 'patient', ...(d.data() as Omit<StaffAppointment, 'id' | 'uid' | 'source'>) });
      });
      setPatientAppts(rows);
    }, () => {});

    const unsub2 = onSnapshot(collection(db, 'clinicBookings'), (snap) => {
      const rows: StaffAppointment[] = [];
      snap.forEach((d) => {
        rows.push({ id: d.id, uid: '', source: 'clinic', ...(d.data() as Omit<StaffAppointment, 'id' | 'uid' | 'source'>) });
      });
      setClinicAppts(rows);
    }, () => {});

    return () => { unsub1(); unsub2(); };
  }, []);

  return [...patientAppts, ...clinicAppts];
}
