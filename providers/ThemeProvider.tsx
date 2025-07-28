import React, { createContext, useContext, useMemo } from 'react'

import { ColorSchemeName } from 'react-native'

import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native'

import { PaperProvider } from 'react-native-paper'

import {
 createEmotionTheme,
 createNavigationTheme,
 createTheme,
 type EmotionTheme,
} from '@/constants/Theme'
import { useColorScheme } from '@/hooks/useColorScheme'

// Unified theme context
interface UnifiedThemeContextType {
 colorScheme: ColorSchemeName
 paper: ReturnType<typeof createTheme>
 navigation: ReturnType<typeof createNavigationTheme>
 emotion: EmotionTheme
 isDark: boolean
}

const UnifiedThemeContext = createContext<UnifiedThemeContextType | null>(null)

interface UnifiedThemeProviderProps {
 children: React.ReactNode
 colorScheme?: ColorSchemeName // Allow override for testing
}

export const UnifiedThemeProvider: React.FC<UnifiedThemeProviderProps> = ({
 children,
 colorScheme: overrideColorScheme,
}) => {
 const systemColorScheme = useColorScheme()
 const colorScheme = overrideColorScheme ?? systemColorScheme

 const themes = useMemo(
  () => ({
   colorScheme,
   paper: createTheme(colorScheme),
   navigation: createNavigationTheme(colorScheme),
   emotion: createEmotionTheme(colorScheme),
   isDark: colorScheme === 'dark',
  }),
  [colorScheme]
 )

 return (
  <UnifiedThemeContext.Provider value={themes}>
   <EmotionThemeProvider theme={themes.emotion}>
    <PaperProvider theme={themes.paper}>
     <NavigationThemeProvider value={themes.navigation}>
      {children}
     </NavigationThemeProvider>
    </PaperProvider>
   </EmotionThemeProvider>
  </UnifiedThemeContext.Provider>
 )
}

// Custom hooks for each theme system
export const useUnifiedTheme = () => {
 const context = useContext(UnifiedThemeContext)
 if (!context) {
  throw new Error('useUnifiedTheme must be used within UnifiedThemeProvider')
 }
 return context
}

export const usePaperTheme = () => useUnifiedTheme().paper
export const useNavigationTheme = () => useUnifiedTheme().navigation
export const useEmotionTheme = () => useUnifiedTheme().emotion
export const useMatrixTheme = () => {
 const { emotion, isDark, colorScheme } = useUnifiedTheme()
 return { ...emotion, isDark, colorScheme }
}
