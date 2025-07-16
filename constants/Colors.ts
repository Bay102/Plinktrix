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
 matrixGray: '#AAA',
 matrixDarkGray: '#666',
 // Matrix backgrounds and effects
 matrixDarkBG: 'rgba(0, 0, 0, 0.75)',
 matrixGreenShadow: 'rgba(0, 255, 0, 0.7)',
 matrixGreenBG: 'rgba(0, 255, 0, 0.1)',
}

const baseColors = {
 light: {
  text: '#11181C',
  background: '#ffffff',
  surface: '#f5f5f5',
  surfaceVariant: '#e1e1e1',
  icon: MatrixColors.matrixDarkBG,
  tabIconDefault: '#687076',
  tabIconSelected: MatrixColors.matrixGreen,
  tint: MatrixColors.matrixGreen,
 },
 dark: {
  text: '#ECEDEE',
  background: '#151718',
  surface: '#000',
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

// Legacy exports for backward compatibility
export const Colors = {
 light: baseColors.light,
 dark: baseColors.dark,
}
