import React from 'react'

import { StyleSheet, useColorScheme, View } from 'react-native'

import Leaderboard from '@/components/pages/Home/Leaderboard'
import { Text } from '@/components/PaperBase/Text'
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
   <View style={styles.container}>
    <MatrixContainer title="WELCOME">
     <Text style={styles.text}>Get ready to play Plinktrix!</Text>
    </MatrixContainer>

    <Leaderboard />
   </View>
  </ParallaxScrollView>
 )
}

export default Index

const styles = StyleSheet.create({
 container: {
  paddingTop: 20,
 },
 text: {
  color: MatrixColors.white,
 },
})
