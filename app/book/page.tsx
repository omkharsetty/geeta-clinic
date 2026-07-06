import type { Metadata } from 'next';
import BookOnline from '@/components/book/BookOnline';

export const metadata: Metadata = {
  title: 'Book an Appointment | Geeta Diabetes & Endocrine Centre | Ongole',
  description:
    'Book an appointment with Dr. Geeta Annamaneni (MBBS, MD, DM Endocrinology) in Ongole — diabetes, thyroid, PCOS and endocrine care.',
};

export default function BookPage() {
  return <BookOnline />;
}
