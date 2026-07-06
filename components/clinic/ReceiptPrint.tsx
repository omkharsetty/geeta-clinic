'use client';

import Image from 'next/image';
import { X, Printer } from 'lucide-react';
import { Bill, inr } from '@/lib/bill-types';
import { CLINIC_LETTERHEAD as L } from '@/lib/visit-types';

export default function ReceiptPrint({ bill, onClose }: { bill: Bill; onClose: () => void }) {
  const d = new Date(bill.date);

  return (
    <div className="rx-overlay">
      <div className="rx-toolbar">
        <button className="btn btn-primary" onClick={() => window.print()}>
          <Printer size={16} /> Print
        </button>
        <button className="clinic-icon-btn" onClick={onClose} aria-label="Close"><X size={17} /></button>
      </div>

      <div className="rx-sheet rx-receipt">
        <header className="rx-head">
          <Image src="/images/icon.png" alt="" width={56} height={56} unoptimized />
          <div className="rx-head-main">
            <h1>{L.name}</h1>
            <p><strong>{L.doctor}</strong> · {L.quals}</p>
            <p>{L.reg}</p>
          </div>
          <div className="rx-head-side">
            <p>{L.phone}</p>
          </div>
        </header>
        <p className="rx-address">{L.address}</p>
        <hr />

        <h2 className="rx-receipt-title">RECEIPT</h2>
        <div className="rx-patient">
          <span><strong>No:</strong> {bill.receiptNo}</span>
          <span><strong>Date:</strong> {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</span>
        </div>
        <div className="rx-patient">
          <span><strong>Received from:</strong> {bill.patientName}</span>
          {bill.phone && <span><strong>Phone:</strong> {bill.phone}</span>}
        </div>

        <table className="rx-table rx-receipt-table">
          <thead>
            <tr><th>#</th><th>Description</th><th className="rx-amount">Amount</th></tr>
          </thead>
          <tbody>
            {bill.items.map((it, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{it.label}</td>
                <td className="rx-amount">{inr(it.amount)}</td>
              </tr>
            ))}
            <tr className="rx-total-row">
              <td colSpan={2}><strong>Total ({bill.paymentMode})</strong></td>
              <td className="rx-amount"><strong>{inr(bill.total)}</strong></td>
            </tr>
          </tbody>
        </table>

        <footer className="rx-foot">
          <div className="rx-sign">
            <span>{L.name}</span>
            <small>Authorised signatory</small>
          </div>
        </footer>
      </div>
    </div>
  );
}
