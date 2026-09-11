export function BrandMark({ className = '' }) {
  return <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className={className}>
    <rect x="1" y="1" width="34" height="34" rx="10" fill="currentColor" />
    <path d="M24 12a8.5 8.5 0 1 0 0 12M16 18h9" stroke="var(--background)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>;
}
