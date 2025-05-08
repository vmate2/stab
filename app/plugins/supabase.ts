import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/types/supabase'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // A $supabase típusosítása a SupabaseClient típussal és a generált Database típusunkkal
  const supabase: SupabaseClient<Database> = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAPIkey
  )

  nuxtApp.provide('supabase', supabase)
})
