export default function VerifiedBadge({ size = 18 }) {
  return (
    <svg role="img" aria-label="Verified" width={size} height={size} viewBox="0 0 24 24" className="inline-block shrink-0 align-[-2px]">
      <circle cx="12" cy="12" r="11" fill="var(--color-gold)" />
      <path d="M7 12.5l3.2 3.2L17 8.8" fill="none" stroke="var(--color-ink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
