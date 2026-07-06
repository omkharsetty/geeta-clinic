'use client';

import { useState } from 'react';
import { ShieldCheck, UserRound, KeyRound } from 'lucide-react';
import { useClinicAuth } from './ClinicAuthProvider';

export default function ClinicLogin() {
  const { login } = useClinicAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        setError('Incorrect username or password.');
      } else if (msg.includes('too-many-requests')) {
        setError('Too many failed attempts. Please wait a few minutes and try again.');
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
        <div className="clinic-login-icon"><ShieldCheck size={28} /></div>
        <h1>Clinic Console</h1>
        <p className="clinic-sub">Authorized staff only</p>
        <form onSubmit={submit} className="clinic-form">
          <label><UserRound size={13} /> Username</label>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="doctor or staff"
          />
          <label><KeyRound size={13} /> Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary btn-lg" disabled={busy || !username || !password}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          {error && <p className="clinic-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
