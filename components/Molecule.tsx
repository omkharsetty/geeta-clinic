export default function Molecule({ className = '' }: { className?: string }) {
  // Stylised hormone-molecule motif: atoms joined by bonds
  return (
    <svg className={`molecule ${className}`} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <g className="molecule-spin">
        <line x1="100" y1="100" x2="40" y2="60" />
        <line x1="100" y1="100" x2="160" y2="52" />
        <line x1="100" y1="100" x2="150" y2="150" />
        <line x1="100" y1="100" x2="52" y2="152" />
        <line x1="40" y1="60" x2="160" y2="52" />
        <circle cx="100" cy="100" r="14" className="atom atom-core" />
        <circle cx="40" cy="60" r="9" className="atom" />
        <circle cx="160" cy="52" r="11" className="atom atom-alt" />
        <circle cx="150" cy="150" r="8" className="atom" />
        <circle cx="52" cy="152" r="10" className="atom atom-alt" />
      </g>
    </svg>
  );
}
