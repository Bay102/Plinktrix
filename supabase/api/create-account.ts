import { supabase } from '@/supabase/supabase'

export const createAccount = async (
 email: string,
 password: string,
 username: string
) => {
 try {
  // Check if username is available using our RLS-bypassing function
  const { data: isAvailable, error: checkError } = await supabase.rpc(
   'is_username_available',
   { username_to_check: username }
  )

  if (checkError) {
   return { data: null, error: checkError }
  }

  if (!isAvailable) {
   return { data: null, error: new Error('Username already exists') }
  }

  // Create the auth user with username in metadata
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
   email,
   password,
   options: {
    data: {
     username: username,
    },
   },
  })

  if (signUpError) {
   return { data: null, error: signUpError }
  }

  // If signup was successful and we have a user, the trigger will automatically
  // create the user_data row. We need to wait a moment and then fetch it.
  if (signUpData.user) {
   // Wait for the trigger to complete (small delay)
   await new Promise((resolve) => setTimeout(resolve, 100))

   // Fetch the created user_data (now that we're authenticated)
   const { data: userData, error: userDataError } = await supabase
    .from('user_data')
    .select('*')
    .eq('id', signUpData.user.id)
    .single()

   if (userDataError) {
    // If we can't fetch user_data, still return the auth data
    console.warn('User created but could not fetch user_data:', userDataError)
    return {
     data: {
      user: signUpData.user,
      session: signUpData.session,
      userData: null,
     },
     error: null,
    }
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
