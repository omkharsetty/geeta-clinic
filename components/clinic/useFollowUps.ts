'use client';

import { useState, useEffect, useMemo } from 'react';
import { collectionGroup, collection, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Visit } from '@/lib/visit-types';
import { PatientRow, profileToRow, todayStr } from './clinic-data';

export interface FollowUpRow {
  uid: string;
  patient: PatientRow | null;
  visitDate: string;
  followUpDate: string; // YYYY-MM-DD
  reason: string;
  scheduled: boolean;
  bucket: 'overdue' | 'today' | 'upcoming' | 'scheduled';
}

interface ApptLite { uid: string; phone: string; date: string }

export function useFollowUps() {
  const [visits, setVisits] = useState<(Visit & { uid: string })[]>([]);
  const [appts, setAppts] = useState<ApptLite[]>([]);
  const [patients, setPatients] = useState<Map<string, PatientRow>>(new Map());
  const [error, setError] = useState('');

  useEffect(() => {
    const onErr = (err: Error) =>
      setError(err.message.includes('permission')
        ? 'Permission denied — make sure the latest security rules are published.'
        : err.message);

    const unsub1 = onSnapshot(collectionGroup(db, 'visits'), (snap) => {
      const rows: (Visit & { uid: string })[] = [];
      snap.forEach((d) => {
        const uid = d.ref.parent.parent?.id;
        if (!uid) return;
        rows.push({ id: d.id, uid, ...(d.data() as Omit<Visit, 'id'>) });
      });
      setVisits(rows);
    }, onErr);

    const unsub2 = onSnapshot(collectionGroup(db, 'appointments'), (snap) => {
      const rows: ApptLite[] = [];
      snap.forEach((d) => {
        const data = d.data() as { phone?: string; date?: string };
        rows.push({ uid: d.ref.parent.parent?.id || '', phone: data.phone || '', date: data.date || '' });
      });
      setAppts(rows);
    }, onErr);

    const unsub3 = onSnapshot(collection(db, 'clinicBookings'), (snap) => {
      setAppts((prev) => {
        const clinicRows: ApptLite[] = [];
        snap.forEach((d) => {
          const data = d.data() as { phone?: string; date?: string };
          clinicRows.push({ uid: '', phone: data.phone || '', date: data.date || '' });
        });
        // keep patient-appointment rows, replace clinic ones
        return [...prev.filter((r) => r.uid !== ''), ...clinicRows];
      });
    }, onErr);

    getDocs(collection(db, 'users')).then((snap) => {
      const map = new Map<string, PatientRow>();
      snap.forEach((d) => map.set(d.id, profileToRow(d.id, d.data())));
      setPatients(map);
    }).catch(() => {});

    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  const rows = useMemo<FollowUpRow[]>(() => {
    const today = todayStr();
    // Latest visit with a follow-up per patient supersedes older ones
    const latest = new Map<string, Visit & { uid: string }>();
    for (const v of visits) {
      if (!v.followUpDate) continue;
      const cur = latest.get(v.uid);
      if (!cur || v.date > cur.date) latest.set(v.uid, v);
    }
    const digits = (s: string) => s.replace(/\D/g, '').slice(-10);

    return Array.from(latest.values()).map((v) => {
      const patient = patients.get(v.uid) || null;
      const pPhone = patient?.phone ? digits(patient.phone) : '';
      const scheduled = appts.some((a) =>
        a.date >= v.followUpDate! &&
        (a.uid === v.uid || (pPhone && digits(a.phone) === pPhone))
      );
      const bucket: FollowUpRow['bucket'] = scheduled
        ? 'scheduled'
        : v.followUpDate! < today ? 'overdue'
        : v.followUpDate! === today ? 'today'
        : 'upcoming';
      return {
        uid: v.uid,
        patient,
        visitDate: v.date,
        followUpDate: v.followUpDate!,
        reason: v.diagnosis || v.complaint || 'Consultation',
        scheduled,
        bucket,
      };
    }).sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
  }, [visits, appts, patients]);

  const actionable = rows.filter((r) => r.bucket === 'overdue' || r.bucket === 'today').length;

  return { rows, actionable, error };
}
