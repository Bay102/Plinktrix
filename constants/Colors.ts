/**
 * Simplified theming system with dynamic color switching
 */
import {
 DarkTheme as NavigationDarkTheme,
 DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import { ColorSchemeName } from 'react-native'
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

// Base colors that are shared between light and dark themes
const baseColors = {
 primary: '#0f0',
 secondary: '#0F0',
 error: '#B00020',
 success: '#28a745',
 warning: '#ffc107',
 // Matrix theme colors
 matrixCyan: '#0CF',
 matrixBlue: '#0AF',
 matrixRed: '#F00',
 matrixGold: '#FFD700',
 matrixGreen: '#0F0',
 matrixDarkGreen: '#070',
 matrixGray: '#AAA',
 matrixDarkGray: '#666',
 // Matrix backgrounds and effects
 matrixDarkBG: 'rgba(0, 0, 0, 0.9)',
 matrixGreenShadow: 'rgba(0, 255, 0, 0.7)',
 matrixGreenBG: 'rgba(0, 255, 0, 0.1)',
}

// Theme-specific colors
const themeColors = {
 light: {
  text: '#11181C',
  background: '#ffffff',
  surface: '#f5f5f5',
  surfaceVariant: '#e1e1e1',
  icon: '#687076',
  tabIconDefault: '#687076',
  tabIconSelected: baseColors.primary,
  tint: baseColors.primary,
 },
 dark: {
  text: '#ECEDEE',
  background: '#151718',
  surface: '#000',
  surfaceVariant: '#2c2c2c',
  icon: '#9BA1A6',
  tabIconDefault: '#9BA1A6',
  tabIconSelected: baseColors.primary,
  tint: baseColors.primary,
 },
}

// Main theme function that dynamically returns theme based on color scheme
export const createTheme = (colorScheme: ColorSchemeName = 'light') => {
 const isDark = colorScheme === 'dark'
 const colors = {
  ...baseColors,
  ...themeColors[isDark ? 'dark' : 'light'],
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
export const createNavigationTheme = (
 colorScheme: ColorSchemeName = 'light'
) => {
 const isDark = colorScheme === 'dark'
 const colors = themeColors[isDark ? 'dark' : 'light']
 const baseNavTheme = isDark ? NavigationDarkTheme : NavigationDefaultTheme

 return {
  ...baseNavTheme,
  colors: {
   ...baseNavTheme.colors,
   primary: baseColors.primary,
   background: colors.background,
   card: colors.surface,
   text: colors.text,
   border: colors.surfaceVariant,
   notification: baseColors.error,
  },
 }
}

// // Export matrix colors for direct access
export { baseColors as MatrixColors }

// // Legacy exports for backward compatibility
export const Colors = {
 light: themeColors.light,
 dark: themeColors.dark,
}

// // Default theme export
// export const Theme = createTheme('light')
