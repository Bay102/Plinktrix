import { getUserData } from '@/supabase/api/get-user-data'
import { supabase } from '@/supabase/supabase'
import { UserData } from '@/supabase/types'
import { Session, User } from '@supabase/supabase-js'
import { router } from 'expo-router'
import { createContext, ReactNode, useEffect, useState } from 'react'
export interface AuthContextType {
 user: User | null | undefined
 setUser: (user: User | null | undefined) => void
 userData: UserData | undefined
 setUserData: (userData?: UserData) => void
 logOut: () => Promise<void>
 session: Session | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
 children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
 const [user, setUser] = useState<User | null | undefined>(undefined)
 const [isLoading, setIsLoading] = useState(true)
 const [userData, setUserData] = useState<UserData | undefined>(undefined)
 const [session, setSession] = useState<Session | null>(null)

 // Fetch user data when user changes
 useEffect(() => {
  const fetchUserData = async () => {
   if (user?.id) {
    try {
     const data = await getUserData(user.id)
     setUserData(data)
    } catch (error) {
     console.error('Error fetching user data:', error)
    }
   } else {
    setUserData(undefined)
   }
  }

  fetchUserData()
 }, [user?.id])

 useEffect(() => {
  if (!supabase) {
   console.log('No supabase')
   setIsLoading(false)
   return
  }

  // Get initial session
  const initializeAuth = async () => {
   try {
    const {
     data: { session },
    } = await supabase.auth.getSession()
    setSession(session)
    setUser(session?.user || null)
   } catch (error) {
    console.error('Error initializing auth:', error)
   } finally {
    setIsLoading(false)
    console.log('Initialized auth')
   }
  }

  initializeAuth()

  // Listen for auth changes
  const {
   data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
   console.log('Auth state changed:', event)
   setSession(session)
   setUser(session?.user || null)
  })

  console.log('Auth Changed')
  return () => {
   subscription.unsubscribe()
  }
 }, [])

 const logOut = async (): Promise<void> => {
  try {
   router.replace('/')
   await supabase.auth.signOut()
   setUser(null)
   setUserData(undefined)
   setSession(null)
  } catch (error) {
   console.error('Error signing out:', error)
  }
 }

 const value: AuthContextType = {
  user,
  setUser,
  logOut,
  userData,
  setUserData,
  session,
 }

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
