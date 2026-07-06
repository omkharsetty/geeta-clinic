// Data shapes shared with the Geeta Endocrine Care mobile app.
// Field names and allowed values must match the app and firestore.rules exactly.

export interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
  phone?: string;
  address?: string;
}

export interface GlucoseLog {
  id: string;
  timestamp: string;
  type: 'Fasting' | 'Post-Prandial' | 'Random';
  value: number; // mg/dL
  notes?: string;
}

export interface ThyroidLog {
  id: string;
  date: string;
  doseMcg: number;
  weightKg?: number;
  energyLevel: number; // 1–5
  symptoms: string[];
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  date: string;
  slot: string;
  type: 'In-Person Clinic' | 'Video Teleconsultation' | 'Diagnostic Lab Test' | 'Home Sample Collection';
  specialty: string;
  notes?: string;
  qrCode?: string;
  status?: 'Scheduled' | 'Pending Sample' | 'Lab Processing' | 'Report Uploaded';
  labReport?: {
    reportId: string;
    testType: string;
    measuredDate: string;
    technicianName: string;
    parameters: {
      name: string;
      value: number;
      unit: string;
      referenceRange: string;
      status: 'Normal' | 'High' | 'Low';
    }[];
    notes?: string;
    fileName?: string;
    fileSize?: string;
    issuedBy?: string;
  };
}

export interface ExternalReport {
  id: string;
  patientName: string;
  phone: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileData: string; // Base64 data URL
  notes?: string;
  uploadedAt: string;
}

// Same lists the mobile app offers, so bookings look identical on both.
export const APPOINTMENT_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
];

export const SPECIALTIES = [
  'Diabetes Management',
  'Thyroid Disorders',
  'PCOS & Hormonal Care',
  'Obesity & Weight Control',
  'General Endocrine Sync',
];
