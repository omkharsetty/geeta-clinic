'use client';

import { Droplet, Activity, Flower2, Scale, Sun, Dna, Bone, Video, LucideIcon } from 'lucide-react';
import { useLang } from './LanguageProvider';

const items: { icon: LucideIcon; tKey: string }[] = [
  { icon: Droplet, tKey: 'svc.diabetes.t' },
  { icon: Activity, tKey: 'svc.thyroid.t' },
  { icon: Flower2, tKey: 'svc.pcos.t' },
  { icon: Scale, tKey: 'svc.obesity.t' },
  { icon: Sun, tKey: 'svc.vitd.t' },
  { icon: Dna, tKey: 'svc.adrenal.t' },
  { icon: Bone, tKey: 'svc.bone.t' },
  { icon: Video, tKey: 'svc.tele.t' },
];

export default function Ticker() {
  const { t } = useLang();
  // Two identical tracks make the marquee loop seamlessly
  const track = (ariaHidden: boolean) => (
    <div className="ticker-track" aria-hidden={ariaHidden || undefined}>
      {items.map(({ icon: Icon, tKey }) => (
        <span className="ticker-item" key={tKey}>
          <Icon size={16} />
          {t(tKey)}
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker" role="marquee">
      <div className="ticker-inner">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
