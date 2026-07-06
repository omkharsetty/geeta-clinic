'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useClinicAuth } from './ClinicAuthProvider';

export default function PasswordChange({ forced }: { forced?: boolean }) {
  const { changePassword, logout } = useClinicAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await changePassword(current, next);
      setDone(true);
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('invalid-credential') || msg.includes('wrong-password')) {
        setError('Current password is incorrect.');
      } else if (msg.includes('weak-password')) {
        setError('New password is too weak — use at least 8 characters with a mix of letters and numbers.');
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="clinic-center">
      <div className="clinic-card clinic-login-card">
        <div className="clinic-login-icon"><RefreshCw size={28} /></div>
        <h1>{forced ? 'Password update required' : 'Change password'}</h1>
        <p className="clinic-sub">
          {forced
            ? 'For security, clinic passwords must be changed every 30 days. Set a new password to continue.'
            : 'Choose a new password (minimum 8 characters).'}
        </p>
        {done ? (
          <p className="clinic-ok">Password updated. You&apos;re all set for the next 30 days.</p>
        ) : (
          <form onSubmit={submit} className="clinic-form">
            <label>Current password</label>
            <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
            <label>New password</label>
            <input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
            <label>Confirm new password</label>
            <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <button className="btn btn-primary btn-lg" disabled={busy || !current || !next || !confirm}>
              {busy ? 'Updating…' : 'Update password'}
            </button>
            {error && <p className="clinic-error">{error}</p>}
          </form>
        )}
        {forced && !done && (
          <button className="clinic-link-btn" onClick={logout}>Sign out instead</button>
        )}
      </div>
    </div>
  );
}
