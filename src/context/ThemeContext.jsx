import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_THEME, THEMES } from "../content/themes.js";

const Ctx = createContext(null);
export const useTheme = () => useContext(Ctx);

const KEY = "isoka_theme";
const read = () => {
  try { const t = localStorage.getItem(KEY); return THEMES.some((x) => x.id === t) ? t : DEFAULT_THEME; } catch { return DEFAULT_THEME; }
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(read);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = THEMES.find((t) => t.id === theme).bar;
  }, [theme]);

  const setTheme = useCallback((id) => {
    setThemeState(id);
    try { localStorage.setItem(KEY, id); } catch { /* private mode: it just won't be remembered */ }
  }, []);

  return <Ctx.Provider value={{ theme, setTheme, open, setOpen, themes: THEMES }}>{children}</Ctx.Provider>;
}
