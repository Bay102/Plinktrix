import { createContext, ReactNode, useState } from 'react'

export interface UserContextType {
 settingsModalVisible: boolean
 setSettingsModalVisible: (visible: boolean) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
 children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
 const [settingsModalVisible, setSettingsModalVisible] = useState(false)

 const value: UserContextType = {
  settingsModalVisible,
  setSettingsModalVisible,
 }

 return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
