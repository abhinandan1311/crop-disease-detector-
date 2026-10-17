"use client";

import type {
  AuthChangeEvent,
  AuthError,
  Session,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getSupabase, supabaseConfigured } from "@/lib/supabase";

type AuthContextValue = {
  client: SupabaseClient | null;
  session: Session | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = supabaseConfigured();
  const [client, setClient] = useState<SupabaseClient | null>(() =>
    configured ? getSupabase() : null,
  );
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;

    const supabase = getSupabase();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, newSession: Session | null) => {
        setClient(supabase);
        setSession(newSession);
        setLoading(false);
      },
    );

    void supabase.auth.getSession().then(
      (result: {
        data: { session: Session | null };
        error: AuthError | null;
      }) => {
        if (result.error) {
          console.error("Could not restore the Supabase session.", result.error);
        }
        setSession(result.data.session);
        setLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, [configured]);

  const value: AuthContextValue = {
    client,
    session,
    user: session?.user ?? null,
    loading,
    configured,
    signOut: async () => {
      if (!client) return;
      const { error } = await client.auth.signOut();
      if (error) throw error;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
