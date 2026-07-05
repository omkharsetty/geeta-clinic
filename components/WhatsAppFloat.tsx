import { MessageCircle } from 'lucide-react';
import { WA_URL } from '@/lib/translations';

export default function WhatsAppFloat() {
  return (
    <a href={WA_URL} className="whatsapp-float" target="_blank" rel="noopener" aria-label="WhatsApp">
      <MessageCircle size={28} fill="currentColor" strokeWidth={0} />
      <span className="whatsapp-pulse" />
    </a>
  );
}
