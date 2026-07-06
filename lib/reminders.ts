// One-tap patient reminders — builds bilingual message text and deep links
// for WhatsApp / SMS. Sending is manual (staff taps a button); no paid
// gateway involved.

import { CLINIC_LETTERHEAD as L } from './visit-types';

/** Normalise an Indian number to digits with country code, e.g. "919603062942". */
export function waPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const ten = digits.slice(-10);
  return ten.length === 10 ? `91${ten}` : digits;
}

export function waLink(phone: string, message: string): string {
  return `https://wa.me/${waPhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function smsLink(phone: string, message: string): string {
  return `sms:+${waPhone(phone)}?&body=${encodeURIComponent(message)}`;
}

const fmtDate = (dateStr: string) =>
  new Date(dateStr + 'T12:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

export function appointmentReminder(name: string, date: string, slot: string, type: string): string {
  const isVideo = type === 'Video Teleconsultation';
  return (
`Namaste ${name} garu,

This is a reminder of your ${isVideo ? 'video consultation' : 'appointment'} with ${L.doctor} (${L.name}) on ${fmtDate(date)} at ${slot}.
${isVideo ? 'We will call you at this time.' : `Address: ${L.address}`}

నమస్తే ${name} గారు, ${fmtDate(date)} న ${slot} కి డా. గీత అన్నమనేని గారి వద్ద మీ అపాయింట్‌మెంట్ ఉంది. దయచేసి సమయానికి రండి.

— ${L.name}, ${L.phone}`
  );
}

export function followUpReminder(name: string, date: string): string {
  return (
`Namaste ${name} garu,

${L.doctor} has advised a follow-up visit on ${fmtDate(date)}. Please reply here or call ${L.phone} to book your slot.

నమస్తే ${name} గారు, డా. గీత గారు ${fmtDate(date)} న ఫాలో-అప్ విజిట్ సూచించారు. స్లాట్ బుక్ చేసుకోవడానికి ఇక్కడ రిప్లై చేయండి లేదా ${L.phone} కి కాల్ చేయండి.

— ${L.name}`
  );
}
