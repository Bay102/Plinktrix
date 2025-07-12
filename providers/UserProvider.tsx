import { UserData } from '@/supabase/types'
import { createContext, ReactNode, useState } from 'react'

export interface UserContextType {
 userData: UserData | null | undefined
 setUserData: (userData: UserData | null | undefined) => void
 settingsModalVisible: boolean
 setSettingsModalVisible: (visible: boolean) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
 children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
 const [userData, setUserData] = useState<UserData | null | undefined>(
  undefined
 )

 const [settingsModalVisible, setSettingsModalVisible] = useState(false)

 const value: UserContextType = {
  userData,
  setUserData,
  settingsModalVisible,
  setSettingsModalVisible,
 }

 return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
