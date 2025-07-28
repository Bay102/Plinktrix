import React from 'react'

import { SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native'

import PlinkoDigitalRain from '@/components/shared/PlinkoDigitalRain'
import { createTheme } from '@/constants/Theme'
import { useUserProvider } from '@/providers'

import { UserSettingsModal } from './UserSettingsModal'
import { UserStats } from './UserStats'

const PlayerInfo = () => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)
 const { settingsModalVisible, setSettingsModalVisible } = useUserProvider()

 return (
  // <ParallaxScrollView
  //  headerImage={<PlinkoDigitalRain />}
  //  headerBackgroundColor={{
  //   light: theme.colors.matrixDarkBG,
  //   dark: theme.colors.surface,
  //  }}
  // >
  <SafeAreaView style={styles.container}>
   <View style={styles.content}>
    <PlinkoDigitalRain />
    <UserStats />
    <UserSettingsModal
     isVisible={settingsModalVisible}
     onClose={() => setSettingsModalVisible(false)}
    />
   </View>
  </SafeAreaView>
  // </ParallaxScrollView>
 )
}

export default PlayerInfo

const styles = StyleSheet.create({
 container: { flex: 1 },
 content: {
  flex: 1,
  paddingTop: 140,
  paddingHorizontal: 8,
 },
})
