import { supabase } from '@/supabase/supabase'
import { AuthError } from '@supabase/supabase-js'

export const login = async (email: string, password: string) => {
 try {
  const { data, error } = await supabase.auth.signInWithPassword({
   email: email,
   password: password,
  })

  if (error instanceof AuthError) {
   console.log(error)
   throw new Error(error.message)
  }

  return { data }
 } catch (error) {
  console.log(error)
  throw new Error(error instanceof Error ? error.message : 'Unknown error')
 }
}
