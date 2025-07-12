/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import {
 DarkTheme as NavigationDarkTheme,
 DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'

// Base colors that are shared between light and dark themes
const baseColors = {
 primary: '#0f0',
 secondary: '#0F0',
 error: '#B00020',
 success: '#28a745',
 warning: '#ffc107',
}

// Light theme colors
const lightColors = {
 text: '#11181C',
 background: '#ffffff',
 surface: '#f5f5f5',
 surfaceVariant: '#e1e1e1',
 icon: '#687076',
 tabIconDefault: '#687076',
 tabIconSelected: baseColors.primary,
 tint: baseColors.primary,
}

// Dark theme colors
const darkColors = {
 text: '#ECEDEE',
 background: '#151718',
 surface: '#1e1e1e',
 surfaceVariant: '#2c2c2c',
 icon: '#9BA1A6',
 tabIconDefault: '#9BA1A6',
 tabIconSelected: baseColors.primary,
 tint: baseColors.primary,
}

// Export legacy Colors object for backward compatibility
export const Colors = {
 light: lightColors,
 dark: darkColors,
}

// Light theme configuration
export const LightTheme = {
 ...MD3LightTheme,
 roundness: 8,
 colors: {
  ...MD3LightTheme.colors,
  ...baseColors,
  ...lightColors,
 },
 fonts: {
  ...MD3LightTheme.fonts,
  regular: {
   fontFamily: 'SpaceMono',
   fontWeight: 'normal',
  },
  medium: {
   fontFamily: 'SpaceMono',
   fontWeight: '500',
  },
  light: {
   fontFamily: 'SpaceMono',
   fontWeight: '300',
  },
 },
 animation: {
  ...MD3LightTheme.animation,
  scale: 1.0,
 },
}

// Dark theme configuration
export const DarkTheme = {
 ...MD3DarkTheme,
 roundness: 8,
 colors: {
  ...MD3DarkTheme.colors,
  ...baseColors,
  ...darkColors,
 },
 fonts: {
  ...MD3DarkTheme.fonts,
  regular: {
   fontFamily: 'SpaceMono',
   fontWeight: 'normal',
  },
  medium: {
   fontFamily: 'SpaceMono',
   fontWeight: '500',
  },
  light: {
   fontFamily: 'SpaceMono',
   fontWeight: '300',
  },
 },
 animation: {
  ...MD3DarkTheme.animation,
  scale: 1.0,
 },
}

// React Navigation theme configurations
export const CustomNavigationLightTheme = {
 ...NavigationDefaultTheme,
 colors: {
  ...NavigationDefaultTheme.colors,
  primary: baseColors.primary,
  background: lightColors.background,
  card: lightColors.surface,
  text: lightColors.text,
  border: lightColors.surfaceVariant,
  notification: baseColors.error,
 },
}

export const CustomNavigationDarkTheme = {
 ...NavigationDarkTheme,
 colors: {
  ...NavigationDarkTheme.colors,
  primary: baseColors.primary,
  background: darkColors.background,
  card: darkColors.surface,
  text: darkColors.text,
  border: darkColors.surfaceVariant,
  notification: baseColors.error,
 },
}

// Default theme export for backward compatibility
export const Theme = LightTheme
