export default function Wave({ flip = false, color = '#fff' }: { flip?: boolean; color?: string }) {
  return (
    <div className={`wave ${flip ? 'wave-flip' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path
          d="M0,32 C240,64 480,0 720,24 C960,48 1200,8 1440,32 L1440,64 L0,64 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
