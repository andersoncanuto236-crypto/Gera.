import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type UserPlan = 'FREE' | 'PAID';
type UserRole = 'USER' | 'ADMIN';

type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  business_name: string | null;
  niche: string | null;
  audience: string | null;
  tone: string | null;
  plan: UserPlan;
  role: UserRole;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  userPlan: UserPlan;
  userRole: UserRole;
  updateProfile: (updates: Partial<Profile>) => void;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, emailRedirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,name,plan,role,business_name,niche,audience,tone')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('fetchProfile error:', error.message);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    email: data.email ?? null,
    name: (data as any).name ?? null,
    business_name: (data as any).business_name ?? null,
    niche: (data as any).niche ?? null,
    audience: (data as any).audience ?? null,
    tone: (data as any).tone ?? null,
    plan: (data.plan as UserPlan) ?? 'FREE',
    role: (data.role as UserRole) ?? 'USER',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPlan, setUserPlan] = useState<UserPlan>('FREE');
  const [userRole, setUserRole] = useState<UserRole>('USER');
  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile((current) => (current ? { ...current, ...updates } : current));
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const s = data.session ?? null;
      setSession(s);
      setUser(s?.user ?? null);

      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        if (!mounted) return;

        setProfile(p);
        setUserPlan(p?.plan ?? 'FREE');
        setUserRole(p?.role ?? 'USER');
      } else {
        setProfile(null);
        setUserPlan('FREE');
        setUserRole('USER');
      }

      setLoading(false);
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const p = await fetchProfile(newSession.user.id);
        if (!mounted) return;

        setProfile(p);
        setUserPlan(p?.plan ?? 'FREE');
        setUserRole(p?.role ?? 'USER');
      } else {
        setProfile(null);
        setUserPlan('FREE');
        setUserRole('USER');
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      profile,
      userPlan,
      userRole,
      updateProfile,
      signInWithPassword: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signUp: async (email, password, emailRedirectTo) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: emailRedirectTo ? { emailRedirectTo } : undefined,
        });
        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [user, session, loading, profile, userPlan, userRole, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
