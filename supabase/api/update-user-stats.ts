import { supabase } from '@/supabase/supabase'
import { UserData } from '@/supabase/types'

export interface GameResultData {
 ballsUsed: {
  regular: number
  gold: number
 }
 scoreEarned: number
}

export const updateUserStats = async (
 userId: string,
 gameResult: GameResultData
): Promise<UserData | null> => {
 if (!userId) {
  throw new Error('User ID is required')
 }

 // First, get current user data
 const { data: currentUser, error: fetchError } = await supabase
  .from('user_data')
  .select('*')
  .eq('id', userId)
  .single()

 if (fetchError) {
  throw new Error('Error fetching current user data')
 }

 // Calculate new values
 const newRegularBalls = Math.max(
  0,
  currentUser.regular_packets - gameResult.ballsUsed.regular
 )
 const newBonusBalls = Math.max(
  0,
  currentUser.bonus_packets - gameResult.ballsUsed.gold
 )
 const newScore = currentUser.bytes_downloaded + gameResult.scoreEarned
 const totalBallsDropped =
  gameResult.ballsUsed.regular + gameResult.ballsUsed.gold
 const newPacketsDropped = currentUser.packets_dropped + totalBallsDropped

 // Update user stats in a single transaction
 const { data: updatedUser, error: updateError } = await supabase
  .from('user_data')
  .update({
   regular_packets: newRegularBalls,
   bonus_packets: newBonusBalls,
   bytes_downloaded: newScore,
   packets_dropped: newPacketsDropped,
  })
  .eq('id', userId)
  .select()
  .single()

 if (updateError) {
  throw new Error('Error updating user stats')
 }

 return updatedUser
}

export const getUserStats = async (
 userId: string
): Promise<UserData | null> => {
 if (!userId) {
  throw new Error('User ID is required')
 }

 const { data, error } = await supabase
  .from('user_data')
  .select('*')
  .eq('id', userId)
  .single()

 if (error) {
  throw new Error('Error fetching user stats')
 }

 return data
}
