'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, MessageSquare, Phone, Send } from 'lucide-react';
import { waLink, smsLink } from '@/lib/reminders';

export default function ReminderModal({
  patientName,
  phone,
  initialMessage,
  onClose,
}: {
  patientName: string;
  phone: string;
  initialMessage: string;
  onClose: () => void;
}) {
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="book-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Send reminder">
      <div className="book-modal clinic-book-modal" onClick={(e) => e.stopPropagation()}>
        <button className="book-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <h3><Send size={17} /> Remind {patientName}</h3>
        <p className="clinic-sub">Review the message, then choose how to send it. WhatsApp is best; use SMS if the patient doesn&rsquo;t have WhatsApp.</p>

        <div className="clinic-form">
          <textarea
            className="clinic-reminder-text"
            rows={9}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1500}
          />
          <div className="clinic-reminder-actions">
            <a
              className="btn btn-primary"
              href={waLink(phone, message)}
              target="_blank"
              rel="noopener"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a className="btn btn-ghost clinic-reminder-alt" href={smsLink(phone, message)}>
              <MessageSquare size={15} /> SMS
            </a>
            <a className="btn btn-ghost clinic-reminder-alt" href={`tel:+${phone.replace(/\D/g, '').slice(-10) ? '91' + phone.replace(/\D/g, '').slice(-10) : phone}`}>
              <Phone size={15} /> Call
            </a>
          </div>
          <p className="clinic-reminder-note">Sending to: <strong>{phone}</strong></p>
        </div>
      </div>
    </div>
  );
}
