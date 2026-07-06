'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, LogOut, KeyRound, Stethoscope, Users } from 'lucide-react';
import { useClinicAuth } from './ClinicAuthProvider';
import ClinicLogin from './ClinicLogin';
import PasswordChange from './PasswordChange';
import Dashboard from './Dashboard';

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
          <div className="clinic-topline">
            <h1>Welcome, <span className="accent">{role === 'doctor' ? 'Dr. Geeta' : 'Clinic Staff'}</span></h1>
            {passwordDaysLeft !== null && passwordDaysLeft <= 7 && (
              <span className="clinic-pw-note warn">
                <KeyRound size={13} /> Password expires in {passwordDaysLeft} day{passwordDaysLeft === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <Dashboard />
        </main>
      )}
    </div>
  );
}
