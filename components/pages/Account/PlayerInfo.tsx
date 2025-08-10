import React from 'react'

import { useColorScheme } from 'react-native'

import ParallaxScrollView from '@/components/ParallaxScrollView'
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
  <ParallaxScrollView
   headerImage={<PlinkoDigitalRain />}
   headerBackgroundColor={{
    light: theme.colors.matrixDarkBG,
    dark: theme.colors.matrixDarkBG,
   }}
   headerHeight={1}
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
