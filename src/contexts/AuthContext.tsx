codex/implementar-autenticacao-com-supabase-1ws49x
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseConfigError } from '../lib/supabaseClient';
import type { UserPlan } from '../../types';


import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseConfigError } from '../lib/supabaseClient';
import type { UserPlan } from '../../types';
main
export type UserRole = 'USER' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  plan: UserPlan;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  userPlan: UserPlan;
  userRole: UserRole;
  signInWithPassword: (email: string, password: string) => Promise<void>;
codex/implementar-autenticacao-com-supabase-1ws49x
  signUp: (email: string, password: string, emailRedirectTo?: string) => Promise<void>;

  signUp: (email: string, password: string) => Promise<void>;
main
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getDefaultProfile = (user: User): UserProfile => ({
  id: user.id,
  email: user.email ?? null,
  name: (user.user_metadata?.full_name as string | undefined) ?? user.email ?? null,
  plan: 'FREE',
  role: 'USER'
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (currentUser: User) => {
    if (!supabase) {
      setProfile(getDefaultProfile(currentUser));
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error('Falha ao carregar profile:', error.message);
      setProfile(getDefaultProfile(currentUser));
      return;
    }

    if (!data) {
      const fallbackProfile = getDefaultProfile(currentUser);
      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: fallbackProfile.id,
          email: fallbackProfile.email,
          name: fallbackProfile.name,
          plan: fallbackProfile.plan,
          role: fallbackProfile.role
        })
        .select()
        .single();

      if (insertError) {
        console.error('Falha ao criar profile:', insertError.message);
        setProfile(fallbackProfile);
        return;
      }

      setProfile({
        id: created.id,
        email: created.email,
        name: created.name,
        plan: created.plan,
        role: created.role
      });
      return;
    }

    setProfile({
      id: data.id,
      email: data.email,
      name: data.name,
      plan: data.plan ?? 'FREE',
      role: data.role ?? 'USER'
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) {
        console.error('Erro ao recuperar sessão:', error.message);
        setSession(null);
        setUser(null);
        setProfile(null);
      } else {
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          await loadProfile(data.session.user);
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    };

    init();

    const subscription = supabase
      ? supabase.auth.onAuthStateChange(async (_event, nextSession) => {
          setSession(nextSession);
          const nextUser = nextSession?.user ?? null;
          setUser(nextUser);
          if (nextUser) {
            await loadProfile(nextUser);
          } else {
            setProfile(null);
          }
        })
      : null;

    return () => {
      mounted = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error(supabaseConfigError ?? 'Supabase não configurado.');
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
  }, []);

codex/implementar-autenticacao-com-supabase-1ws49x
  const signUp = useCallback(
    async (email: string, password: string, emailRedirectTo?: string) => {
      if (!supabase) {
        throw new Error(supabaseConfigError ?? 'Supabase não configurado.');
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: emailRedirectTo ? { emailRedirectTo } : undefined
      });
      if (error) {
        throw new Error(error.message);
      }
    },
    []
  );

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error(supabaseConfigError ?? 'Supabase não configurado.');
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message);
    }
  }, []);
main

  const signOut = useCallback(async () => {
    if (!supabase) {
      throw new Error(supabaseConfigError ?? 'Supabase não configurado.');
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }, []);

codex/implementar-autenticacao-com-supabase-1ws49x
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      userPlan: profile?.plan ?? 'FREE',
      userRole: profile?.role ?? 'USER',
      signInWithPassword,
      signUp,
      signOut
    }),
    [loading, profile, session, signInWithPassword, signOut, signUp, user]
  );

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    profile,
    loading,
    userPlan: profile?.plan ?? 'FREE',
    userRole: profile?.role ?? 'USER',
    signInWithPassword,
    signUp,
    signOut
  }), [loading, profile, session, signInWithPassword, signOut, signUp, user]);
main

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
