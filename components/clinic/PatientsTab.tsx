'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Search, Phone, ChevronRight, RefreshCw } from 'lucide-react';
import { db } from '@/lib/firebase';
import { PatientRow, profileToRow } from './clinic-data';

export default function PatientsTab({ onOpenPatient }: { onOpenPatient: (uid: string) => void }) {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const snap = await getDocs(collection(db, 'users'));
      const rows: PatientRow[] = [];
      snap.forEach((d) => rows.push(profileToRow(d.id, d.data())));
      rows.sort((a, b) => a.name.localeCompare(b.name));
      setPatients(rows);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.includes('permission')
        ? 'Permission denied — make sure the latest security rules are published.'
        : msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? patients.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.phone || '').includes(q) ||
        p.email.toLowerCase().includes(q))
    : patients;

  return (
    <div>
      <div className="clinic-search-row">
        <div className="clinic-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, phone, or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="clinic-icon-btn" onClick={load} title="Refresh" aria-label="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {loading && <div className="clinic-center"><div className="clinic-spinner" /></div>}
      {error && <p className="clinic-error">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="clinic-empty">{q ? 'No patients match your search.' : 'No registered patients yet.'}</p>
      )}

      <div className="clinic-patient-list">
        {filtered.map((p) => (
          <button key={p.uid} className="clinic-patient-row" onClick={() => onOpenPatient(p.uid)}>
            <span className="clinic-avatar">{p.name.charAt(0).toUpperCase()}</span>
            <span className="clinic-patient-main">
              <strong>{p.name}</strong>
              <small>{p.email}</small>
            </span>
            {p.phone && <span className="clinic-patient-phone"><Phone size={12} /> {p.phone}</span>}
            <ChevronRight size={16} className="clinic-row-arrow" />
          </button>
        ))}
      </div>
      {!loading && !error && (
        <p className="clinic-total">{patients.length} registered patient{patients.length === 1 ? '' : 's'}</p>
      )}
    </div>
  );
}
