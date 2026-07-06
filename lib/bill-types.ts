// Clinic bills — created by staff/doctor in the web console.

export interface BillItem {
  label: string;
  amount: number; // INR
}

export interface Bill {
  id: string;
  receiptNo: string;
  patientName: string;
  phone: string;
  date: string; // ISO timestamp
  items: BillItem[];
  total: number;
  paymentMode: 'Cash' | 'UPI' | 'Card';
  createdBy: 'doctor' | 'staff';
  notes?: string;
}

export const PAYMENT_MODES: Bill['paymentMode'][] = ['Cash', 'UPI', 'Card'];

// Quick-pick line items (amounts are typed in at billing time)
export const BILL_PRESETS = [
  'Consultation',
  'Follow-up consultation',
  'Video consultation',
  'Blood sugar test (glucometer)',
  'Injection / dressing',
];

export function newReceiptNo(): string {
  return 'R-' + Date.now().toString(36).toUpperCase();
}

export function inr(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}
