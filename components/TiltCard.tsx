'use client';

import { useRef, ReactNode, CSSProperties } from 'react';

export default function TiltCard({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--tilt-x', `${(y - 0.5) * -8}deg`);
    el.style.setProperty('--tilt-y', `${(x - 0.5) * 8}deg`);
    el.style.setProperty('--glow-x', `${x * 100}%`);
    el.style.setProperty('--glow-y', `${y * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div ref={ref} className={`tilt-card ${className}`} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
