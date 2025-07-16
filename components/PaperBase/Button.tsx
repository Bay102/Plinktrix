import React from 'react'

import { useColorScheme } from 'react-native'

import { Button as PaperButton,ButtonProps } from 'react-native-paper'

import { createTheme } from '@/constants/Colors'

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
