// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Lazy client: solo en navegador.
 * Devuelve null en SSR/build para no romper el "astro build".
 * También soporta window.__ENV (si usas /public/env.js en local).
 */
export function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null; // <- evita build

  const url = (import.meta as any).env?.SUPABASE_URL || (window as any).__ENV?.SUPABASE_URL;
  const key = (import.meta as any).env?.SUPABASE_ANON_KEY || (window as any).__ENV?.SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}
