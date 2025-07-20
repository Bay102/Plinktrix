import React from 'react'

import { StyleSheet, useColorScheme } from 'react-native'

import { Text } from 'react-native-paper'

import Leaderboard from '@/components/pages/Home/Leaderboard'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { MatrixContainer } from '@/components/shared/MatrixContainer'
import PlinkoDigitalRain from '@/components/shared/PlinkoDigitalRain'
import { createTheme, MatrixColors } from '@/constants/Colors'

const Index = () => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)

 return (
  <ParallaxScrollView
   headerBackgroundColor={{
    light: theme.colors.surface,
    dark: theme.colors.surface,
   }}
   headerImage={<PlinkoDigitalRain />}
  >
   <MatrixContainer title="WELCOME">
    <Text style={styles.text}>Get ready to play Plinktrix!</Text>
   </MatrixContainer>
   <Leaderboard />
  </ParallaxScrollView>
 )
}

export default Index

const styles = StyleSheet.create({
 text: {
  color: MatrixColors.white,
 },
})
