import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Auth {
  /** false when Supabase isn't configured; sign-in UI should stay hidden */
  enabled: boolean;
  user: User | null;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // A failed Google sign-in comes back as ?error_description=… (and/or in the hash)
  useEffect(() => {
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.slice(1));
    const description = url.searchParams.get('error_description') ?? hash.get('error_description');
    if (!description) return;
    setError(`sign-in failed: ${description}`);
    for (const key of ['error', 'error_code', 'error_description']) url.searchParams.delete(key);
    window.history.replaceState(null, '', url.pathname + url.search);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    if (!supabase) return;
    setError(null);
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (e) setError(`sign-in failed: ${e.message}`);
  };

  const signOut = async () => {
    if (!supabase) return;
    setError(null);
    const { error: e } = await supabase.auth.signOut();
    if (e) setError(`sign-out failed: ${e.message}`);
  };

  return (
    <AuthContext.Provider value={{ enabled: supabase !== null, user, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): Auth {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export function displayName(user: User): string {
  const meta = user.user_metadata as { full_name?: unknown; name?: unknown };
  const name = meta.full_name ?? meta.name;
  return typeof name === 'string' && name.trim() ? name.trim() : 'signed in';
}
