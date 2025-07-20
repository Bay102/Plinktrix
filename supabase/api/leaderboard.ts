import log from '@/logger'
import { supabase } from '@/supabase/supabase'

export const getLeaderboard = async () => {
 try {
  const { data, error } = await supabase
   .from('user_data')
   .select('id, username, bytes_downloaded')
   .order('bytes_downloaded', { ascending: false })

  if (error) throw error

  log.info(data)
  return data
 } catch (error) {
  log.error(error)
  return []
 }
}
