'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFavourites } from '@/hooks/use-favourites';
import { AuthButton } from './auth-button';
import { ThemeToggle } from './theme-toggle';

const NAV = [
  { href: '/', label: 'Search' },
  { href: '/favourites', label: 'Favourites' },
  { href: '/saved-searches', label: 'Saved searches' },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useFavourites();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span aria-hidden className="text-primary text-xl">◈</span>
          EstateFinder
        </Link>

        <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
          {NAV.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  active
                    ? 'bg-accent text-primary font-medium'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {item.label}
                {item.href === '/favourites' && count > 0 && (
                  <span className="ml-1.5 rounded-full bg-primary px-1.5 text-xs text-primary-fg">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
