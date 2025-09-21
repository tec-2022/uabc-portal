import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (import.meta.env.SSR) {
    throw new Error('Supabase client usado en SSR/build. Úsalo en código de navegador.')
  }
  if (browserClient) return browserClient

  const url = import.meta.env.PUBLIC_SUPABASE_URL
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Faltan PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY')
  }
  browserClient = createClient(url, key)
  return browserClient
}
