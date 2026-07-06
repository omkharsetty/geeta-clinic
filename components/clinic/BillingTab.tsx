'use client';

import { useState, useEffect } from 'react';
import { collectionGroup, collection, onSnapshot } from 'firebase/firestore';
import { IndianRupee, Plus, Printer, Banknote, Smartphone, CreditCard, ReceiptText, BarChart3 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Bill, inr } from '@/lib/bill-types';
import { todayStr } from './clinic-data';
import BillForm from './BillForm';
import ReceiptPrint from './ReceiptPrint';
import BillingReports from './BillingReports';

const MODE_ICON = { Cash: Banknote, UPI: Smartphone, Card: CreditCard } as const;

export default function BillingTab() {
  const [patientBills, setPatientBills] = useState<Bill[]>([]);
  const [clinicBills, setClinicBills] = useState<Bill[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<'bills' | 'reports'>('bills');
  const [printBill, setPrintBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const onErr = (err: Error) => {
      setError(err.message.includes('permission')
        ? 'Permission denied — make sure the latest security rules are published.'
        : err.message);
      setLoading(false);
    };
    const unsub1 = onSnapshot(collectionGroup(db, 'bills'), (snap) => {
      const rows: Bill[] = [];
      snap.forEach((d) => rows.push({ id: d.id, ...d.data() } as Bill));
      setPatientBills(rows);
      setLoading(false);
    }, onErr);
    const unsub2 = onSnapshot(collection(db, 'clinicBills'), (snap) => {
      const rows: Bill[] = [];
      snap.forEach((d) => rows.push({ id: d.id, ...d.data() } as Bill));
      setClinicBills(rows);
    }, onErr);
    return () => { unsub1(); unsub2(); };
  }, []);

  const bills = [...patientBills, ...clinicBills].sort((a, b) => b.date.localeCompare(a.date));
  const today = todayStr();
  const todaysBills = bills.filter((b) => b.date.slice(0, 10) === today);
  const todayTotal = todaysBills.reduce((s, b) => s + b.total, 0);
  const modeTotal = (m: Bill['paymentMode']) =>
    todaysBills.filter((b) => b.paymentMode === m).reduce((s, b) => s + b.total, 0);

  if (loading) return <div className="clinic-center"><div className="clinic-spinner" /></div>;

  return (
    <div>
      <div className="clinic-bill-summary">
        <div className="clinic-bill-stat">
          <small>Today&rsquo;s collection</small>
          <strong>{inr(todayTotal)}</strong>
          <span>{todaysBills.length} bill{todaysBills.length === 1 ? '' : 's'}</span>
        </div>
        {(['Cash', 'UPI', 'Card'] as const).map((m) => {
          const Icon = MODE_ICON[m];
          return (
            <div className="clinic-bill-stat" key={m}>
              <small><Icon size={12} /> {m}</small>
              <strong>{inr(modeTotal(m))}</strong>
            </div>
          );
        })}
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> New bill
        </button>
      </div>

      <div className="clinic-mode-toggle clinic-billing-views">
        <button className={view === 'bills' ? 'active' : ''} onClick={() => setView('bills')}>
          <ReceiptText size={14} /> Bills
        </button>
        <button className={view === 'reports' ? 'active' : ''} onClick={() => setView('reports')}>
          <BarChart3 size={14} /> Reports
        </button>
      </div>

      {error && <p className="clinic-error">{error}</p>}

      {view === 'reports' ? (
        <BillingReports bills={bills} />
      ) : (
      <>
      {bills.length === 0 && !error && (
        <p className="clinic-empty"><IndianRupee size={15} /> No bills yet — create the first one.</p>
      )}

      <div className="clinic-patient-list">
        {bills.slice(0, 50).map((b) => (
          <div key={`${b.receiptNo}-${b.id}`} className="clinic-appt-row" style={{ cursor: 'default' }}>
            <span className="clinic-bill-amount-lg">{inr(b.total)}</span>
            <span className="clinic-appt-main">
              <strong>{b.patientName}</strong>
              <small>
                {b.items.map((it) => it.label).join(', ')} · {b.paymentMode} · {b.receiptNo}
              </small>
            </span>
            <span className="clinic-appt-side">
              <small className="clinic-appt-date">
                {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ·{' '}
                {new Date(b.date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
              </small>
            </span>
            <button className="clinic-icon-btn" onClick={() => setPrintBill(b)} aria-label="Print receipt" title="Print receipt">
              <Printer size={15} />
            </button>
          </div>
        ))}
      </div>
      </>
      )}

      {showForm && (
        <BillForm
          onClose={() => setShowForm(false)}
          onSaved={(b) => { setShowForm(false); setPrintBill(b); }}
        />
      )}
      {printBill && <ReceiptPrint bill={printBill} onClose={() => setPrintBill(null)} />}
    </div>
  );
}
