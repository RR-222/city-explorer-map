import { createClient } from '@supabase/supabase-js';

// Diagnostic wrapper: print env vars and avoid throwing when they are missing so the app can render
console.log('--- supabase env diagnostic ---');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY (first 12 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice?.(0,12));

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('Supabase env vars missing: please ensure .env.local contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart Vite.');
}

// Minimal dummy supabase client to prevent the whole app from crashing while we diagnose env injection.
const dummySupabase = {
  auth: {
    async getUser() { return { data: { user: null } }; },
    onAuthStateChange() { return { subscription: { unsubscribe() {} } }; },
    async signUp() { return { error: new Error('Supabase not configured') }; },
    async signInWithPassword() { return { error: new Error('Supabase not configured') }; },
    async signOut() { return; }
  },
  from() {
    // simple stub for places queries used in UI; operations will fail when env missing
    return {
      select: async () => ({ data: [], error: new Error('Supabase not configured') })
    };
  }
};

export const supabase = (url && anonKey) ? createClient(url, anonKey) : dummySupabase;
