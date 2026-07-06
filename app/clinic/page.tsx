import type { Metadata } from 'next';
import { ClinicAuthProvider } from '@/components/clinic/ClinicAuthProvider';
import ClinicShell from '@/components/clinic/ClinicShell';

export const metadata: Metadata = {
  title: 'Clinic Console | Geeta Diabetes & Endocrine Centre',
  robots: { index: false, follow: false },
};

export default function ClinicPage() {
  return (
    <ClinicAuthProvider>
      <ClinicShell />
    </ClinicAuthProvider>
  );
}
