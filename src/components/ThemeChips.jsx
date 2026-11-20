import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeChips() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className="flex flex-wrap gap-3">
      {themes.map((t) => {
        const on = t.id === theme;
        return (
          <button
            key={t.id} role="radio" aria-checked={on} onClick={() => setTheme(t.id)}
            className={`flex items-center gap-3 rounded-full border px-4 py-2.5 text-left ${on ? "border-gold bg-gold/10 font-bold text-cream" : "border-line text-cream hover:border-gold/60"}`}
          >
            <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full" style={{ background: t.dot }} />
            {t.name}
          </button>
        );
      })}
    </div>
  );
}
