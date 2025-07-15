import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import DigitalRain from '@/components/pages/Plinko/DigitalRain'
import { MatrixContainer } from '@/components/ui/MatrixContainer'
import { createTheme } from '@/constants/Colors'
import React from 'react'
import { useColorScheme } from 'react-native'
import { Text } from 'react-native-paper'

const Index = () => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)
 return (
  <ParallaxScrollView
   headerBackgroundColor={{
    light: theme.colors.surface,
    dark: theme.colors.surface,
   }}
   headerImage={<DigitalRain />}
  >
   <MatrixContainer title="WELCOME">
    <Text>Welcome to the Matrix</Text>
    <ThemedText>Hello World</ThemedText>
   </MatrixContainer>
  </ParallaxScrollView>
 )
}

export default Index

// const styles = StyleSheet.create({})
