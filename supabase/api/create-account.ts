import { supabase } from '@/supabase/supabase'

export const createAccount = async (
 email: string,
 password: string,
 username: string
) => {
 try {
  //! TODO: refactor this to work with RLS policies
  // First, check if username already exists
  const { data: existingUser, error: checkError } = await supabase
   .from('user_data')
   .select('username')
   .eq('username', username)
   .single()

  if (checkError && checkError.code !== 'PGRST116') {
   // PGRST116 means no rows found, which is what we want
   return { data: null, error: checkError }
  }

  if (existingUser) {
   return { data: null, error: new Error('Username already exists') }
  }

  // Create the auth user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
   email,
   password,
  })

  if (signUpError) {
   return { data: null, error: signUpError }
  }

  // If signup was successful and we have a user, create the user_data row
  if (signUpData.user) {
   const { data: userData, error: userDataError } = await supabase
    .from('user_data')
    .insert({
     username: username,
     //  account_level: 'free', // Default account level
    })
    .select()
    .single()

   if (userDataError) {
    return { data: null, error: userDataError }
   }

   return {
    data: {
     user: signUpData.user,
     session: signUpData.session,
     userData: userData,
    },
    error: null,
   }
  }

  return { data: signUpData, error: null }
 } catch (error) {
  return { data: null, error: error as Error }
 }
}
