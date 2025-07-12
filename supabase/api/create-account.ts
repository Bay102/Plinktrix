import { supabase } from '@/supabase/supabase'

export const createAccount = async (email: string, password: string) => {
 const { data, error } = await supabase.auth.signUp({ email, password })
 return { data, error }
}
