import { useColorScheme } from 'react-native'

import { Text as PaperText, TextProps } from 'react-native-paper'

import { createTheme } from '@/constants/Theme'

export const Text = (props: TextProps<any>) => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)

 return (
  <PaperText
   theme={{ colors: { primary: theme.colors.matrixGreen } }}
   {...props}
  />
 )
}
