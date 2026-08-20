'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const STORAGE_KEY = 'ef.theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

function apply(theme: Theme) {
  // `system` clears the attribute so the prefers-color-scheme media query wins;
  // an explicit choice stamps data-theme so the CSS override takes over.
  const root = document.documentElement;
  if (theme === 'system') delete root.dataset.theme;
  else root.dataset.theme = theme;
}

/** Context API state: app-wide theme preference, persisted to localStorage. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(stored);
    apply(stored);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    apply(t);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
