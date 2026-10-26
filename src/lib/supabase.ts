import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * null when Supabase isn't configured; the app then runs guest-only.
 * PKCE: Google returns a one-time ?code= that supabase-js exchanges and then
 * removes, so tokens never appear in the URL and no stray "#" is left behind.
 */
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { flowType: 'pkce' } }) : null;
