'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  isReady: boolean;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
};

const STORAGE_KEY = 'ef.auth.user';

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Mock auth: no real credentials. Persists a lightweight session to
 * localStorage so per-user favourites / saved searches work. Structured so it
 * can be swapped for NextAuth later without touching consumers.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Hydrate from localStorage after mount. Must start from SSR-safe defaults
  // and sync in an effect — the one accepted setState-in-effect case.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      // ignore malformed storage
    }
    setIsReady(true);
  }, []);

  const signIn = useCallback((email: string, name?: string) => {
    const next: User = {
      id: email.toLowerCase(),
      email,
      name: name?.trim() || email.split('@')[0],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isReady, signIn, signOut }),
    [user, isReady, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
