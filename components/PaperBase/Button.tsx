import React from 'react'

import { useColorScheme } from 'react-native'

import { ButtonProps, Button as PaperButton } from 'react-native-paper'

import { createTheme } from '@/constants/Theme'

export const Button = (props: ButtonProps) => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)

 return (
  <PaperButton
   theme={{ colors: { primary: theme.colors.matrixGreen } }}
   {...props}
  />
 )
}
