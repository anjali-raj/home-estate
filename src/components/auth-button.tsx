'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export function AuthButton() {
  const { user, isReady, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isReady) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-border" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="hidden sm:inline text-muted">
          Hi, <span className="text-foreground font-medium">{user.name}</span>
        </span>
        <button
          onClick={signOut}
          className="rounded-full border border-border px-3 py-1.5 hover:bg-accent"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90"
      >
        Sign in
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              signIn(email, name);
              setOpen(false);
            }}
            className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-border bg-surface p-4 shadow-xl"
          >
            <p className="mb-1 text-sm font-semibold">Sign in</p>
            <p className="mb-3 text-xs text-muted">
              Demo auth — any email works, no password.
            </p>
            <label className="mb-2 block text-xs font-medium">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="mb-3 block text-xs font-medium">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-fg hover:opacity-90"
            >
              Continue
            </button>
          </form>
        </>
      )}
    </div>
  );
}
