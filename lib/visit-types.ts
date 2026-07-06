// Visit records written by clinic staff (web console only — the mobile app
// ignores this subcollection, so it is safe to evolve).

export interface RxItem {
  medicine: string;
  /** Dose pattern morning-afternoon-night, e.g. "1-0-1" */
  pattern: string;
  timing: 'Before food' | 'After food' | 'With food' | 'Empty stomach' | 'At bedtime';
  durationDays: number;
  notes?: string;
}

export interface Vitals {
  bp?: string; // "120/80"
  pulse?: number;
  weightKg?: number;
  heightCm?: number;
  sugar?: number; // mg/dL
  sugarType?: 'Fasting' | 'Post-Prandial' | 'Random';
}

export interface Visit {
  id: string;
  date: string; // ISO timestamp
  createdBy: 'doctor' | 'staff';
  vitals?: Vitals;
  complaint?: string;
  diagnosis?: string;
  advice?: string;
  followUpDate?: string; // YYYY-MM-DD
  prescriptions: RxItem[];
}

export const RX_TIMINGS: RxItem['timing'][] = [
  'After food', 'Before food', 'With food', 'Empty stomach', 'At bedtime',
];

// Common endocrine prescriptions offered as type-ahead suggestions.
export const COMMON_MEDS = [
  'Tab Metformin 500 mg', 'Tab Metformin 1000 mg SR',
  'Tab Glimepiride 1 mg', 'Tab Glimepiride 2 mg',
  'Tab Sitagliptin 100 mg', 'Tab Vildagliptin 50 mg',
  'Tab Dapagliflozin 10 mg', 'Tab Empagliflozin 25 mg',
  'Inj Insulin Glargine', 'Inj Insulin Aspart', 'Inj Mixtard 30/70',
  'Tab Thyroxine 25 mcg', 'Tab Thyroxine 50 mcg', 'Tab Thyroxine 75 mcg', 'Tab Thyroxine 100 mcg',
  'Tab Carbimazole 5 mg', 'Tab Carbimazole 10 mg',
  'Cap Vitamin D3 60000 IU (weekly)', 'Tab Calcium + Vitamin D3',
  'Tab Methylcobalamin 1500 mcg',
  'Tab Atorvastatin 10 mg', 'Tab Atorvastatin 20 mg',
  'Tab Telmisartan 40 mg', 'Tab Amlodipine 5 mg',
  'Tab Folic Acid 5 mg', 'Tab Myo-Inositol',
];

const TE_TIMING: Record<RxItem['timing'], string> = {
  'Before food': 'భోజనానికి ముందు',
  'After food': 'భోజనం తర్వాత',
  'With food': 'భోజనంతో పాటు',
  'Empty stomach': 'ఖాళీ కడుపుతో',
  'At bedtime': 'పడుకునే ముందు',
};

/** "1-0-1" + timing → bilingual instruction line. */
export function rxInstruction(item: RxItem): { en: string; te: string } {
  const parts = item.pattern.split('-').map((n) => parseInt(n, 10) || 0);
  const [m, a, n] = [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  const en: string[] = [];
  const te: string[] = [];
  if (m) { en.push(`${m} morning`); te.push(`ఉదయం ${m}`); }
  if (a) { en.push(`${a} afternoon`); te.push(`మధ్యాహ్నం ${a}`); }
  if (n) { en.push(`${n} night`); te.push(`రాత్రి ${n}`); }
  const enLine = `${en.join(', ')} · ${item.timing} · ${item.durationDays} days`;
  const teLine = `${te.join(', ')} · ${TE_TIMING[item.timing]} · ${item.durationDays} రోజులు`;
  return { en: enLine, te: teLine };
}

export const CLINIC_LETTERHEAD = {
  name: 'Geeta Diabetes & Endocrine Centre',
  doctor: 'Dr. Geeta Annamaneni',
  quals: 'MBBS, MD, DM (Endocrinology)',
  reg: 'NMC Reg. No 62613',
  address: 'C/O Focus Diagnostics, Chandramama Children Hospital Opposite Road, Sundaraiah Bhavan Rd, Ongole, Andhra Pradesh 523001',
  phone: '+91 96030 62942',
  timings: 'Mon–Sat · 9 AM–2 PM & 6–8 PM · Sunday closed',
};
