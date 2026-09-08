import { createClient } from '@supabase/supabase-js';

// Diagnostic logs
console.log('--- supabase env diagnostic ---');
console.log('import.meta.env.VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('import.meta.env.VITE_SUPABASE_ANON_KEY (first 12 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice?.(0,12));

// Fallback: read from <meta> tags in index.html if import.meta.env is undefined
const getMeta = (name) => {
  if (typeof document === 'undefined') return undefined;
  const el = document.querySelector(`meta[name="${name}"]`);
  return el ? el.getAttribute('content') : undefined;
};

const metaUrl = getMeta('VITE_SUPABASE_URL');
const metaKey = getMeta('VITE_SUPABASE_ANON_KEY');

const url = import.meta.env.VITE_SUPABASE_URL || metaUrl;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || metaKey;

console.log('resolved VITE_SUPABASE_URL:', url ? '***present***' : 'undefined');
console.log('resolved VITE_SUPABASE_ANON_KEY (first12):', anonKey?.slice?.(0,12));

if (!url || !anonKey) {
  console.error('Supabase env vars missing: please ensure .env.local contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart Vite. Or add them as <meta> in index.html.');
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
    return {
      select: async () => ({ data: [], error: new Error('Supabase not configured') })
    };
  }
};

export const supabase = (url && anonKey) ? createClient(url, anonKey) : dummySupabase;
