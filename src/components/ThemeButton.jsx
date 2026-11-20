import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeButton({ compact = false, className = "" }) {
  const { setOpen } = useTheme();
  return (
    <button
      onClick={() => setOpen(true)} aria-label="Change theme"
      className={`inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-cream hover:border-gold ${className}`}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-1.2-.9-1.6-.9-2.6 0-1 .8-1.6 1.8-1.6H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z" />
        <circle cx="7.5" cy="11" r="1" fill="currentColor" /><circle cx="10.5" cy="7" r="1" fill="currentColor" /><circle cx="15" cy="7.5" r="1" fill="currentColor" />
      </svg>
      {!compact && "Theme"}
    </button>
  );
}
