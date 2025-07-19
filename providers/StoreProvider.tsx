import React, { createContext, ReactNode, useContext } from 'react'

import { AppStore } from '@/stores/plinko/AppStore'

// Create the store context
const StoreContext = createContext<AppStore | null>(null)

// Store provider component
interface StoreProviderProps {
 children: ReactNode
 store?: AppStore | null
}

export const StoreProvider: React.FC<StoreProviderProps> = ({
 children,
 store = null,
}) => {
 return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

// Hook to use the App store
export const useAppStore = (): AppStore => {
 const store = useContext(StoreContext)
 if (!store) {
  throw new Error('useRootStore must be used within a StoreProvider')
 }
 return store
}

// Hook to use the Plinko store specifically
export const usePlinkoStore = () => {
 const appStore = useAppStore()
 return appStore.plinkoStore
}
