import React from 'react'

import { useColorScheme } from 'react-native'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import { createTheme } from '@/constants/Colors'
import { useUserProvider } from '@/providers'

import DigitalRain from '../Plinko/DigitalRain'

import { UserSettingsModal } from './UserSettingsModal'
import { UserStats } from './UserStats'

const PlayerInfo = () => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)
 const { settingsModalVisible, setSettingsModalVisible } = useUserProvider()

 return (
  <ParallaxScrollView
   headerImage={<DigitalRain />}
   headerBackgroundColor={{
    light: theme.colors.matrixDarkBG,
    dark: theme.colors.surface,
   }}
  >
   <UserStats />

   <UserSettingsModal
    isVisible={settingsModalVisible}
    onClose={() => setSettingsModalVisible(false)}
   />
  </ParallaxScrollView>
 )
}

export default PlayerInfo
