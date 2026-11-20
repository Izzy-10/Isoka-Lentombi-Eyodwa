import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import ThemeChips from "./ThemeChips.jsx";
import Logo from "./Logo.jsx";

/** Slide-in panel from the left, like the theme picker in Sibiya AI. */
export default function ThemeDrawer() {
  const { open, setOpen } = useTheme();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Theme">
      <button aria-label="Close" tabIndex={-1} className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
      <aside
        className="drawer-in absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto border-r border-line bg-panel px-6 pb-8"
        style={{ paddingTop: "calc(1.5rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <p className="font-brand text-xl font-bold tracking-[0.2em] text-cream">ISOKA</p>
          </div>
          <button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close theme picker" className="grid h-10 w-10 place-items-center rounded-full text-2xl text-muted hover:text-cream">×</button>
        </div>
        <p className="mt-9 mb-4 text-sm font-medium tracking-[0.2em] text-gold">THEME</p>
        <ThemeChips />
        <p className="mt-8 text-sm text-muted">Your choice is saved on this phone.</p>
      </aside>
    </div>
  );
}
