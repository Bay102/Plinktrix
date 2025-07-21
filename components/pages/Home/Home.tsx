import React, { useCallback, useState } from 'react'

import { RefreshControl, StyleSheet, useColorScheme, View } from 'react-native'

import Leaderboard from '@/components/pages/Home/Leaderboard'
import { Text } from '@/components/PaperBase/Text'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { MatrixContainer } from '@/components/shared/MatrixContainer'
import PlinkoDigitalRain from '@/components/shared/PlinkoDigitalRain'
import { createTheme, MatrixColors } from '@/constants/Colors'
import { useAppStore } from '@/providers/StoreProvider'

const Home = () => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)
 const appStore = useAppStore()
 const [refreshing, setRefreshing] = useState(false)

 const onRefresh = useCallback(async () => {
  setRefreshing(true)
  try {
   await appStore.fetchLeaderboard()
  } catch (error) {
   console.error('Error refreshing leaderboard:', error)
  } finally {
   setRefreshing(false)
  }
 }, [appStore])

 return (
  <ParallaxScrollView
   headerBackgroundColor={{
    light: theme.colors.surface,
    dark: theme.colors.surface,
   }}
   headerImage={<PlinkoDigitalRain />}
   refreshControl={
    <RefreshControl
     refreshing={refreshing}
     onRefresh={onRefresh}
     tintColor={MatrixColors.matrixGreen}
     colors={[MatrixColors.matrixGreen]}
     progressBackgroundColor={MatrixColors.matrixDarkBG}
    />
   }
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

export default Home

const styles = StyleSheet.create({
 container: {
  paddingTop: 20,
 },
 text: {
  color: MatrixColors.white,
 },
})
