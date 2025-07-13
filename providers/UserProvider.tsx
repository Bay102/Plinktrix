import { createContext, ReactNode, useState } from 'react'
import { ColorSchemeName, useColorScheme } from 'react-native'

export interface UserContextType {
 settingsModalVisible: boolean
 setSettingsModalVisible: (visible: boolean) => void
 colorScheme: ColorSchemeName
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
 children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
 const [settingsModalVisible, setSettingsModalVisible] = useState(false)
 const colorScheme = useColorScheme()

 const value: UserContextType = {
  settingsModalVisible,
  setSettingsModalVisible,
  colorScheme,
 }

 return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
