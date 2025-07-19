import { useContext } from 'react'

import { AuthContext, AuthContextType } from './AuthProvider'
import { UserContext, UserContextType } from './UserProvider'

export function useUserProvider(): UserContextType {
 const context = useContext(UserContext)
 if (context === undefined) {
  throw new Error('useUserProvider must be used within a UserProvider')
 }
 return context
}

export function useAuthProvider(): AuthContextType {
 const context = useContext(AuthContext)
 if (context === undefined) {
  throw new Error('useAuthProvider must be used within a AuthProvider')
 }
 return context
}
