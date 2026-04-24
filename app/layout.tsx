import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Fraunces, Noto_Sans_Telugu } from 'next/font/google';
import { LanguageProvider } from '@/components/LanguageProvider';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const telugu = Noto_Sans_Telugu({ subsets: ['telugu'], variable: '--font-telugu', display: 'swap' });

export const metadata: Metadata = {
  title: 'Geeta Diabetes & Endocrine Centre | Dr. Geeta Annamaneni | Ongole',
  description:
    'Dr. Geeta Annamaneni — MBBS, MD, DM Endocrinology. Specialist in Diabetes, Thyroid, PCOS, and Endocrine disorders in Ongole, Andhra Pradesh.',
  keywords: [
    'Endocrinologist Ongole',
    'Diabetes doctor Ongole',
    'Thyroid specialist Andhra Pradesh',
    'PCOS specialist Ongole',
    'Dr Geeta Annamaneni',
    'Geeta Diabetes and Endocrine Centre',
  ],
  metadataBase: new URL('https://geetaendocrine.com'),
  alternates: { canonical: 'https://geetaendocrine.com' },
  openGraph: {
    title: 'Geeta Diabetes & Endocrine Centre | Endocrinologist in Ongole',
    description: 'Specialist endocrine and diabetes care in Ongole with Dr. Geeta Annamaneni (DM Endocrinology).',
    url: 'https://geetaendocrine.com',
    siteName: 'Geeta Diabetes & Endocrine Centre',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/images/doctor.jpeg', width: 1200, height: 630, alt: 'Dr. Geeta Annamaneni' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Geeta Diabetes & Endocrine Centre | Endocrinologist in Ongole',
    description: 'Diabetes, thyroid, PCOS, obesity, and endocrine care in Ongole.',
    images: ['/images/doctor.jpeg'],
  },
  icons: { icon: '/images/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable} ${telugu.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
