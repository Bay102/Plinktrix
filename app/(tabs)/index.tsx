import ParallaxScrollView from '@/components/ParallaxScrollView'
import DigitalRain from '@/components/pages/Plinko/DigitalRain'
import { MatrixContainer } from '@/components/ui/MatrixContainer'
import { createTheme, MatrixColors } from '@/constants/Colors'
import React from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
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
    <Text style={styles.text}>Get ready to play Plinktrix!</Text>
   </MatrixContainer>
  </ParallaxScrollView>
 )
}

export default Index

const styles = StyleSheet.create({
 text: {
  color: MatrixColors.white,
 },
})
