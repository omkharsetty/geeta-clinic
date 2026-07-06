// Staff sign-in configuration for the clinic console.
// Usernames map to Firebase Auth email/password accounts (created in the
// Firebase Console; these addresses do not need to be real mailboxes).

export const STAFF_ACCOUNTS: Record<string, { email: string; role: 'doctor' | 'staff' }> = {
  doctor: { email: 'doctor@geetaendocrine.com', role: 'doctor' },
  staff: { email: 'staff@geetaendocrine.com', role: 'staff' },
};

export const STAFF_EMAILS = Object.values(STAFF_ACCOUNTS).map((a) => a.email);

export function roleForEmail(email: string | null | undefined): 'doctor' | 'staff' | null {
  if (!email) return null;
  const entry = Object.values(STAFF_ACCOUNTS).find((a) => a.email === email.toLowerCase());
  return entry?.role ?? null;
}

// Passwords must be rotated within this many days (enforced both in the UI
// and by the Firestore security rules via staffMeta.passwordChangedAt).
export const PASSWORD_MAX_AGE_DAYS = 30;
