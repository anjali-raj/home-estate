'use client';

import { useTheme } from '@/lib/theme-context';

const OPTIONS = [
  { value: 'light', icon: '☀', label: 'Light' },
  { value: 'system', icon: '◐', label: 'System' },
  { value: 'dark', icon: '☾', label: 'Dark' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex items-center rounded-full border border-border p-0.5"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={theme === o.value}
          title={o.label}
          onClick={() => setTheme(o.value)}
          className={`grid h-7 w-7 place-items-center rounded-full text-sm transition ${
            theme === o.value
              ? 'bg-accent text-primary'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <span aria-hidden>{o.icon}</span>
        </button>
      ))}
    </div>
  );
}
