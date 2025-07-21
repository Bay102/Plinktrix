import React from 'react'

import { useColorScheme } from 'react-native'

import { TextInput as PaperTextInput, TextInputProps } from 'react-native-paper'

import { createTheme } from '@/constants/Colors'

export const TextInput = (props: TextInputProps) => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)

 return (
  <PaperTextInput
   theme={{
    colors: {
     primary: theme.colors.matrixGreen,
     onPrimaryContainer: theme.colors.matrixGreen,
     onPrimary: theme.colors.matrixGreen,
     tertiary: theme.colors.matrixGreen,
     onTertiary: theme.colors.matrixGreen,
     outline: theme.colors.black,
    },
   }}
   {...props}
  />
 )
}
