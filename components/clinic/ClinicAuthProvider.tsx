'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { STAFF_ACCOUNTS, roleForEmail, PASSWORD_MAX_AGE_DAYS } from '@/lib/clinic-auth';

interface ClinicAuthContextType {
  user: FirebaseUser | null;
  role: 'doctor' | 'staff' | null;
  loading: boolean;
  /** Days until the current password expires (negative = already expired). */
  passwordDaysLeft: number | null;
  mustChangePassword: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const ClinicAuthContext = createContext<ClinicAuthContextType | undefined>(undefined);

export function ClinicAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordChangedAt, setPasswordChangedAt] = useState<Date | null>(null);

  const role = roleForEmail(user?.email);

  const readPasswordMeta = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, 'staffMeta', uid));
      const ts = snap.exists() ? (snap.data().passwordChangedAt as Timestamp | undefined) : undefined;
      setPasswordChangedAt(ts ? ts.toDate() : null);
    } catch {
      setPasswordChangedAt(null);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      // Only staff accounts belong in the clinic console; sign anyone else out.
      if (u && !roleForEmail(u.email)) {
        await signOut(auth);
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(u);
      if (u) await readPasswordMeta(u.uid);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const passwordDaysLeft = passwordChangedAt
    ? PASSWORD_MAX_AGE_DAYS - Math.floor((Date.now() - passwordChangedAt.getTime()) / 86400000)
    : null;

  // No timestamp on record (first login) or expired → force a change.
  const mustChangePassword = !!user && (passwordChangedAt === null || (passwordDaysLeft !== null && passwordDaysLeft <= 0));

  const login = async (username: string, password: string) => {
    const key = username.trim().toLowerCase();
    const account = STAFF_ACCOUNTS[key];
    const email = account ? account.email : key; // allow typing the full email too
    if (!roleForEmail(email)) throw new Error('Unknown username. Use "doctor" or "staff".');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => signOut(auth);

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) throw new Error('Not signed in.');
    if (newPassword.length < 8) throw new Error('New password must be at least 8 characters.');
    if (newPassword === currentPassword) throw new Error('New password must be different from the current one.');
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, newPassword);
    await setDoc(doc(db, 'staffMeta', user.uid), { passwordChangedAt: serverTimestamp() });
    await readPasswordMeta(user.uid);
  };

  return (
    <ClinicAuthContext.Provider
      value={{ user, role, loading, passwordDaysLeft, mustChangePassword, login, logout, changePassword }}
    >
      {children}
    </ClinicAuthContext.Provider>
  );
}

export function useClinicAuth() {
  const ctx = useContext(ClinicAuthContext);
  if (!ctx) throw new Error('useClinicAuth must be used within ClinicAuthProvider');
  return ctx;
}
