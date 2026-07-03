export default function Ekg({ className = '' }: { className?: string }) {
  // Repeating ECG heartbeat trace, animated via stroke-dashoffset in CSS
  const beat =
    'h40 l8 -14 l10 34 l12 -58 l12 46 l8 -8 h40';
  return (
    <svg
      className={`ekg ${className}`}
      viewBox="0 0 1300 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="ekg-path ekg-path-bg"
        d={`M-10 60 ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat}`}
        fill="none"
      />
      <path
        className="ekg-path ekg-path-glow"
        d={`M-10 60 ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat} ${beat}`}
        fill="none"
      />
    </svg>
  );
}
