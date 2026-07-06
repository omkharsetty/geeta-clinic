import { Timestamp } from 'firebase/firestore';
import { UserProfile } from '@/lib/portal-types';

export interface PatientRow {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: Timestamp | string;
}

export interface StaffAppointment {
  id: string;
  /** Patient uid for registered patients; empty string for clinic-side bookings. */
  uid: string;
  /** 'patient' = lives under users/{uid}/appointments; 'clinic' = clinicBookings. */
  source: 'patient' | 'clinic';
  patientName: string;
  phone: string;
  date: string; // YYYY-MM-DD
  slot: string; // e.g. "09:30 AM"
  type: string;
  specialty: string;
  notes?: string;
  status?: string;
}

/** Sort key for slot strings like "09:30 AM" / "06:00 PM". */
export function slotMinutes(slot: string): number {
  const m = slot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + parseInt(m[2], 10);
}

export function todayStr(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function profileToRow(uid: string, data: Partial<UserProfile> & { createdAt?: Timestamp | string }): PatientRow {
  return {
    uid,
    name: data.name || 'Patient',
    email: data.email || '',
    phone: data.phone,
    address: data.address,
    createdAt: data.createdAt,
  };
}
