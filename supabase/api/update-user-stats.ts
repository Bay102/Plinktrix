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

 const { data: currentUser, error: fetchError } = await supabase
  .from('user_data')
  .select('*')
  .eq('id', userId)
  .single()

 if (fetchError) {
  throw new Error('Error fetching current user data')
 }

 // Validate ball usage
 //  if (gameResult.ballsUsed.regular > currentUser.regular_packets) {
 //   throw new Error('Insufficient regular balls')
 //  }

 //  if (gameResult.ballsUsed.gold > currentUser.bonus_packets) {
 //   throw new Error('Insufficient bonus balls')
 //  }

 // Calculate new values
 const newRegularBalls =
  currentUser.regular_packets - gameResult.ballsUsed.regular

 const newBonusBalls = currentUser.bonus_packets - gameResult.ballsUsed.gold

 const newScore =
  Math.round((currentUser.bytes_downloaded + gameResult.scoreEarned) * 100) /
  100

 const newPacketsDropped =
  currentUser.packets_dropped +
  gameResult.ballsUsed.regular +
  gameResult.ballsUsed.gold

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
  console.error('❌ Error updating user stats in database:', updateError)
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
