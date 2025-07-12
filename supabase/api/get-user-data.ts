import { supabase } from '@/supabase/supabase'

export const getUserData = async (userId?: string) => {
 if (!userId) {
  return
 }

 const { data, error } = await supabase
  .from('user_data')
  .select('*')
  .eq('id', userId)
  .single()

 if (error) {
  throw new Error('Error fetching user data')
 }

 return data
}
