'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, LogOut, ShieldCheck, KeyRound, Stethoscope, Users } from 'lucide-react';
import { useClinicAuth } from './ClinicAuthProvider';
import ClinicLogin from './ClinicLogin';
import PasswordChange from './PasswordChange';

export default function ClinicShell() {
  const { user, role, loading, mustChangePassword, passwordDaysLeft, logout } = useClinicAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  return (
    <div className="clinic">
      <div className="clinic-bg">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-grid-lines" />
      </div>

      <header className="clinic-header">
        <Link href="/" className="clinic-back">
          <ArrowLeft size={16} /> <span>Website</span>
        </Link>
        <div className="clinic-brand">
          <Image src="/images/icon.png" alt="" width={36} height={36} />
          <strong>Clinic Console</strong>
        </div>
        <div className="clinic-header-right">
          {user && !mustChangePassword && (
            <>
              <span className="clinic-role-badge">
                {role === 'doctor' ? <Stethoscope size={13} /> : <Users size={13} />}
                {role === 'doctor' ? 'Doctor' : 'Staff'}
              </span>
              <button className="clinic-icon-btn" onClick={() => setShowPasswordChange((v) => !v)} aria-label="Change password" title="Change password">
                <KeyRound size={16} />
              </button>
              <button className="clinic-icon-btn" onClick={logout} aria-label="Log out" title="Log out">
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </header>

      {loading ? (
        <div className="clinic-center"><div className="clinic-spinner" /></div>
      ) : !user ? (
        <ClinicLogin />
      ) : mustChangePassword ? (
        <PasswordChange forced />
      ) : showPasswordChange ? (
        <PasswordChange />
      ) : (
        <main className="clinic-main">
          <div className="clinic-card clinic-welcome">
            <div className="clinic-login-icon"><ShieldCheck size={28} /></div>
            <h1>Signed in as <span className="accent">{role === 'doctor' ? 'Dr. Geeta' : 'Clinic Staff'}</span></h1>
            <p className="clinic-sub">
              Authentication is set up. The dashboard (appointments, patients, records) arrives in the next step.
            </p>
            {passwordDaysLeft !== null && (
              <p className={`clinic-pw-note ${passwordDaysLeft <= 5 ? 'warn' : ''}`}>
                <KeyRound size={13} /> Password expires in {passwordDaysLeft} day{passwordDaysLeft === 1 ? '' : 's'}
              </p>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
