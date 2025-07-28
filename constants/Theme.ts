import { ColorSchemeName } from 'react-native'

import {
 DarkTheme as NavigationDarkTheme,
 DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'

import {
 adaptNavigationTheme,
 MD3DarkTheme,
 MD3LightTheme,
} from 'react-native-paper'

// Base colors that are shared between light and dark themes
export const MatrixColors = {
 white: '#FFF',
 black: '#000',
 // Matrix theme colors
 matrixCyan: '#0CF',
 matrixBlue: '#0AF',
 matrixBlueShadow: 'rgba(0, 173, 255, 0.7)',
 matrixRed: '#F00',
 matrixGold: '#FFD700',
 matrixGoldShadow: 'rgba(255, 215, 0, 0.7)',
 matrixGreen: '#0F0',
 matrixDarkGreen: '#070',
 matrixGray: '#adb5bd',
 matrixDarkGray: '#666',

 // Matrix backgrounds and effects
 matrixDarkBG: 'rgba(0, 0, 0, 0.75)',
 matrixLightBGOpacity: 'rgba(222, 226, 230, 0.75)',
 matrixGreenShadow: 'rgba(0, 255, 0, 0.7)',
 matrixGreenBG: 'rgba(0, 255, 0, 0.5)',
}

const baseColors = {
 light: {
  text: '#11181C',
  background: MatrixColors.matrixLightBGOpacity,
  surface: '#e9ecef', // navigation BG color
  surfaceVariant: '#e1e1e1',
  icon: MatrixColors.matrixDarkBG,
  tabIconDefault: '#687076', // navigation tab icon color
  tabIconSelected: MatrixColors.matrixGreen, // navigation icon selected
  tint: MatrixColors.matrixGreen,
 },
 dark: {
  text: '#ECEDEE',
  background: MatrixColors.matrixDarkBG,
  surface: '#212529',
  surfaceVariant: '#2c2c2c',
  icon: MatrixColors.matrixGreen,
  tabIconDefault: '#9BA1A6',
  tabIconSelected: MatrixColors.matrixGreen,
  tint: MatrixColors.matrixGreen,
 },
}

// Main theme function that dynamically returns theme based on color scheme
export const createTheme = (colorScheme: ColorSchemeName = 'light') => {
 const isDark = colorScheme === 'dark'
 const colors = {
  ...MatrixColors,
  ...baseColors[isDark ? 'dark' : 'light'],
 }

 const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme

 return {
  ...baseTheme,
  roundness: 8,
  colors: {
   ...baseTheme.colors,
   ...colors,
  },
  fonts: {
   ...baseTheme.fonts,
   regular: {
    fontFamily: 'VT323',
    fontWeight: 'normal',
   },
   medium: {
    fontFamily: 'VT323',
    fontWeight: '500',
   },
   light: {
    fontFamily: 'VT323',
    fontWeight: '300',
   },
  },
  animation: {
   ...baseTheme.animation,
   scale: 1.0,
  },
 }
}

// Navigation theme function

const { LightTheme, DarkTheme } = adaptNavigationTheme({
 reactNavigationLight: NavigationDefaultTheme,
 reactNavigationDark: NavigationDarkTheme,
})

export const createNavigationTheme = (
 colorScheme: ColorSchemeName = 'light'
) => {
 const isDark = colorScheme === 'dark'
 const colors = baseColors[isDark ? 'dark' : 'light']
 const baseNavTheme = isDark ? DarkTheme : LightTheme

 return {
  ...baseNavTheme,
  colors: {
   ...baseNavTheme.colors,
   primary: MatrixColors.matrixGreen,
   background: colors.background,
   card: colors.surface,
   text: colors.text,
   border: colors.surfaceVariant,
   notification: MatrixColors.matrixRed,
  },
 }
}

// Emotion theme function
export const createEmotionTheme = (colorScheme: ColorSchemeName = 'light') => {
 const isDark = colorScheme === 'dark'
 const colors = {
  ...MatrixColors,
  ...baseColors[isDark ? 'dark' : 'light'],
 }

 return {
  colors,
  fonts: {
   regular: 'VT323',
   mono: 'SpaceMono',
  },
  fontSizes: {
   xs: 12,
   sm: 14,
   md: 16,
   lg: 18,
   xl: 20,
   xxl: 28,
  },
  spacing: {
   xs: 4,
   sm: 8,
   md: 16,
   lg: 24,
   xl: 32,
  },
  borderWidth: {
   sm: 1,
   md: 2,
   lg: 3,
  },
  borderRadius: {
   sm: 4,
   md: 8,
   lg: 16,
  },
  isDark,
 }
}

export type EmotionTheme = ReturnType<typeof createEmotionTheme>

// Legacy exports for backward compatibility
export const Colors = {
 light: baseColors.light,
 dark: baseColors.dark,
}
