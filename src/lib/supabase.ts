import { createClient, type SupabaseClient } from '@supabase/supabase-js'
let browserClient: SupabaseClient | null = null
export function getSupabaseClient(): SupabaseClient {
  if (import.meta.env.SSR) throw new Error('Supabase en SSR')
  const url = import.meta.env.PUBLIC_SUPABASE_URL
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  if (!browserClient) browserClient = createClient(url, key)
  return browserClient
}
