import { AsyncStorageAdapter } from '@/services/storage.utils'
import { Database } from '@/supabase/supa-schema'
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
 process.env.EXPO_PUBLIC_SUPABASE_URL!,
 process.env.EXPO_PUBLIC_SUPABASE_KEY!,
 {
  auth: {
   storage: AsyncStorageAdapter,
   autoRefreshToken: true,
   persistSession: true,
   detectSessionInUrl: false,
  },
 }
)
