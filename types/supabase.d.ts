export type Database = {
    public: {
      Tables: {
        stabcash: {
          Row: {
            id: number       // int4 → number
            balance: string  // int8 → string, mert JavaScript nem tud pontosan kezelni 64 bites intet
          }
          Insert: {
            id?: number
            balance: string
          }
          Update: {
            id?: number
            balance?: string
          }
        }
      }
      Views: {}
      Functions: {}
      Enums: {}
    }
  }


  declare module 'nuxt/app' {
    interface NuxtApp {
      $supabase: import('@supabase/supabase-js').SupabaseClient<Database>;
    }
    interface NuxtAppOptions {
      $supabase: import('@supabase/supabase-js').SupabaseClient<Database>;
    }
  }
