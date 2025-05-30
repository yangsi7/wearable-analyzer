import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

const REFRESH_THRESHOLD = 60 * 1000; // 1 minute before expiry

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
};

export async function refreshSession() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.expires_at) {
    const expiresAt = new Date(session.expires_at * 1000);
    const now = new Date();

    if (expiresAt.getTime() - now.getTime() < REFRESH_THRESHOLD) {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return newSession;
    }
  }

  return session;
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const session = await refreshSession();
  return session;
}

export async function getUser() {
  const session = await refreshSession();
  return session?.user || null;
}

export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  if (error) throw error;
  return data;
}

export async function getSessionId(): Promise<string | null> {
  const session = await refreshSession();
  const jwt = session?.access_token;
  if (!jwt) return null;

  const payload = jwt.split('.')[1];
  const decoded = JSON.parse(atob(payload));
  return decoded.session_id;
}