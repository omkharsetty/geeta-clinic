'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { X, Search, UserPlus, User, Plus, Trash2, IndianRupee } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Bill, BillItem, BILL_PRESETS, PAYMENT_MODES, newReceiptNo, inr } from '@/lib/bill-types';
import { PatientRow, profileToRow } from './clinic-data';
import { useClinicAuth } from './ClinicAuthProvider';

interface ItemDraft { label: string; amount: string }

export default function BillForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (bill: Bill) => void;
}) {
  const { role } = useClinicAuth();
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PatientRow | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState<ItemDraft[]>([{ label: 'Consultation', amount: '' }]);
  const [payMode, setPayMode] = useState<Bill['paymentMode']>('Cash');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDocs(collection(db, 'users')).then((snap) => {
      const rows: PatientRow[] = [];
      snap.forEach((d) => rows.push(profileToRow(d.id, d.data())));
      rows.sort((a, b) => a.name.localeCompare(b.name));
      setPatients(rows);
    }).catch(() => {});
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const matches = q
    ? patients.filter((p) => p.name.toLowerCase().includes(q) || (p.phone || '').includes(q)).slice(0, 6)
    : [];

  const total = items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
  const billName = mode === 'existing' ? selected?.name || '' : name.trim();
  const billPhone = mode === 'existing' ? (selected?.phone || '') : (phone ? `+91 ${phone}` : '');

  const setItem = (i: number, field: keyof ItemDraft, value: string) =>
    setItems((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const finalItems: BillItem[] = items
      .filter((it) => it.label.trim() && Number(it.amount) > 0)
      .map((it) => ({ label: it.label.trim(), amount: Number(it.amount) }));
    if (!billName) { setError(mode === 'existing' ? 'Select a patient first.' : 'Enter the patient’s name.'); return; }
    if (finalItems.length === 0) { setError('Add at least one item with an amount.'); return; }

    setBusy(true);
    try {
      const data = {
        receiptNo: newReceiptNo(),
        patientName: billName,
        phone: billPhone,
        date: new Date().toISOString(),
        items: finalItems,
        total: finalItems.reduce((s, it) => s + it.amount, 0),
        paymentMode: payMode,
        createdBy: (role || 'staff') as 'doctor' | 'staff',
      };
      const ref = mode === 'existing' && selected
        ? await addDoc(collection(db, 'users', selected.uid, 'bills'), data)
        : await addDoc(collection(db, 'clinicBills'), data);
      onSaved({ id: ref.id, ...data });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.includes('permission')
        ? 'Permission denied — make sure the latest security rules are published.'
        : msg);
      setBusy(false);
    }
  };

  return (
    <div className="book-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="New bill">
      <div className="book-modal clinic-book-modal" onClick={(e) => e.stopPropagation()}>
        <button className="book-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <h3><IndianRupee size={18} /> New bill</h3>

        <div className="clinic-mode-toggle">
          <button className={mode === 'existing' ? 'active' : ''} onClick={() => setMode('existing')}>
            <User size={14} /> Registered patient
          </button>
          <button className={mode === 'new' ? 'active' : ''} onClick={() => { setMode('new'); setSelected(null); }}>
            <UserPlus size={14} /> Walk-in
          </button>
        </div>

        <form onSubmit={submit} className="clinic-form">
          {mode === 'existing' ? (
            selected ? (
              <div className="clinic-selected-patient">
                <span className="clinic-avatar">{selected.name.charAt(0).toUpperCase()}</span>
                <span className="clinic-patient-main">
                  <strong>{selected.name}</strong>
                  <small>{selected.phone || selected.email}</small>
                </span>
                <button type="button" className="clinic-icon-btn" onClick={() => setSelected(null)} aria-label="Change patient">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="clinic-search">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search patient by name or phone…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                {matches.length > 0 && (
                  <div className="clinic-typeahead">
                    {matches.map((p) => (
                      <button type="button" key={p.uid} onClick={() => { setSelected(p); setQuery(''); }}>
                        <strong>{p.name}</strong>
                        <small>{p.phone || p.email}</small>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )
          ) : (
            <>
              <label>Patient name</label>
              <input type="text" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              <label>Mobile (optional)</label>
              <div className="clinic-phone-row">
                <span className="clinic-phone-prefix">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </>
          )}

          <label>Items</label>
          <datalist id="bill-presets">
            {BILL_PRESETS.map((p) => <option key={p} value={p} />)}
          </datalist>
          <div className="clinic-rx-list">
            {items.map((it, i) => (
              <div key={i} className="clinic-rx-row">
                <input
                  className="clinic-rx-med"
                  type="text"
                  list="bill-presets"
                  placeholder="Item…"
                  value={it.label}
                  onChange={(e) => setItem(i, 'label', e.target.value)}
                  maxLength={100}
                />
                <span className="clinic-phone-prefix">₹</span>
                <input
                  className="clinic-bill-amount"
                  type="number"
                  min={0}
                  max={1000000}
                  placeholder="0"
                  value={it.amount}
                  onChange={(e) => setItem(i, 'amount', e.target.value)}
                />
                <button type="button" className="clinic-icon-btn" onClick={() => setItems((rows) => rows.filter((_, idx) => idx !== i))} aria-label="Remove">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="clinic-add-rx" onClick={() => setItems((rows) => [...rows, { label: '', amount: '' }])}>
            <Plus size={14} /> Add item
          </button>

          <div className="clinic-form-2col">
            <div>
              <label>Payment mode</label>
              <select value={payMode} onChange={(e) => setPayMode(e.target.value as Bill['paymentMode'])}>
                {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="clinic-bill-total">
              <label>Total</label>
              <strong>{inr(total)}</strong>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" disabled={busy || total <= 0}>
            {busy ? 'Saving…' : `Save & print receipt (${inr(total)})`}
          </button>
          {error && <p className="clinic-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
