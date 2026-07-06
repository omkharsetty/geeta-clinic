'use client';

import { useState, useMemo } from 'react';
import { Download, BarChart3 } from 'lucide-react';
import { Bill, inr } from '@/lib/bill-types';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface Row {
  key: string;
  label: string;
  bills: number;
  cash: number;
  upi: number;
  card: number;
  total: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

function mondayOf(d: Date): Date {
  const copy = new Date(d);
  const day = (copy.getDay() + 6) % 7; // 0 = Monday
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function periodKey(date: Date, period: Period): { key: string; label: string } {
  if (period === 'daily') {
    const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return { key, label: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) };
  }
  if (period === 'weekly') {
    const mon = mondayOf(date);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    const key = `${mon.getFullYear()}-${pad(mon.getMonth() + 1)}-${pad(mon.getDate())}`;
    const label = `${mon.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${sun.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    return { key, label };
  }
  if (period === 'monthly') {
    const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
    return { key, label: date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) };
  }
  const key = String(date.getFullYear());
  return { key, label: key };
}

const LIMITS: Record<Period, number> = { daily: 31, weekly: 16, monthly: 12, yearly: 10 };

export default function BillingReports({ bills }: { bills: Bill[] }) {
  const [period, setPeriod] = useState<Period>('daily');

  const rows = useMemo<Row[]>(() => {
    const map = new Map<string, Row>();
    for (const b of bills) {
      const d = new Date(b.date);
      if (isNaN(d.getTime())) continue;
      const { key, label } = periodKey(d, period);
      const row = map.get(key) || { key, label, bills: 0, cash: 0, upi: 0, card: 0, total: 0 };
      row.bills += 1;
      row.total += b.total;
      if (b.paymentMode === 'Cash') row.cash += b.total;
      else if (b.paymentMode === 'UPI') row.upi += b.total;
      else row.card += b.total;
      map.set(key, row);
    }
    return Array.from(map.values())
      .sort((a, b) => b.key.localeCompare(a.key))
      .slice(0, LIMITS[period]);
  }, [bills, period]);

  const maxTotal = Math.max(...rows.map((r) => r.total), 1);
  const grand = rows.reduce(
    (acc, r) => ({ bills: acc.bills + r.bills, cash: acc.cash + r.cash, upi: acc.upi + r.upi, card: acc.card + r.card, total: acc.total + r.total }),
    { bills: 0, cash: 0, upi: 0, card: 0, total: 0 }
  );

  const exportCsv = () => {
    const head = ['Period', 'Bills', 'Cash', 'UPI', 'Card', 'Total'];
    const lines = [
      head.join(','),
      ...rows.map((r) => [`"${r.label}"`, r.bills, r.cash, r.upi, r.card, r.total].join(',')),
      ['"TOTAL"', grand.bills, grand.cash, grand.upi, grand.card, grand.total].join(','),
    ];
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `geeta-clinic-collections-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="clinic-report-toolbar">
        <div className="clinic-mode-toggle clinic-period-toggle">
          {(['daily', 'weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
            <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost clinic-export-btn" onClick={exportCsv} disabled={rows.length === 0}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="clinic-empty"><BarChart3 size={15} /> No billing data yet.</p>
      ) : (
        <div className="clinic-report-table-wrap">
          <table className="clinic-report-table">
            <thead>
              <tr>
                <th>Period</th>
                <th className="num">Bills</th>
                <th className="num">Cash</th>
                <th className="num">UPI</th>
                <th className="num">Card</th>
                <th className="num">Total</th>
                <th className="bar-col"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td>{r.label}</td>
                  <td className="num">{r.bills}</td>
                  <td className="num">{inr(r.cash)}</td>
                  <td className="num">{inr(r.upi)}</td>
                  <td className="num">{inr(r.card)}</td>
                  <td className="num total">{inr(r.total)}</td>
                  <td className="bar-col">
                    <span className="clinic-report-bar" style={{ width: `${(r.total / maxTotal) * 100}%` }} />
                  </td>
                </tr>
              ))}
              <tr className="grand">
                <td>Total ({rows.length} {period === 'daily' ? 'days' : period === 'weekly' ? 'weeks' : period === 'monthly' ? 'months' : 'years'})</td>
                <td className="num">{grand.bills}</td>
                <td className="num">{inr(grand.cash)}</td>
                <td className="num">{inr(grand.upi)}</td>
                <td className="num">{inr(grand.card)}</td>
                <td className="num total">{inr(grand.total)}</td>
                <td className="bar-col"></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
