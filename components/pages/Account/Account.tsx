import { useState } from 'react'

import { SafeAreaView, useColorScheme } from 'react-native'

import { observer } from 'mobx-react-lite'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import MatrixButton from '@/components/shared/MatrixButton'
import PlinkoDigitalRain from '@/components/shared/PlinkoDigitalRain'
import { createTheme } from '@/constants/Theme'
import { useAuthProvider } from '@/providers'

import Login from './Login'
import PlayerInfo from './PlayerInfo'
import SignUp from './SignUp'

type FormMode = 'none' | 'login' | 'signup'

export default observer(function Account() {
 const { user } = useAuthProvider()
 const [formMode, setFormMode] = useState<FormMode>('none')

 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)

 return (
  <SafeAreaView style={{ flex: 1 }}>
   {user ? (
    <PlayerInfo />
   ) : (
    <>
     {formMode === 'none' && (
      <ParallaxScrollView
       headerBackgroundColor={{
        light: theme.colors.matrixDarkBG,
        dark: theme.colors.surface,
       }}
       headerImage={<PlinkoDigitalRain />}
      >
       <MatrixButton title="[ LOGIN ]" onPress={() => setFormMode('login')} />
       <MatrixButton
        title="[ SIGN UP ]"
        onPress={() => setFormMode('signup')}
       />
      </ParallaxScrollView>
     )}

     {formMode === 'login' && <Login setFormMode={setFormMode} />}

     {formMode === 'signup' && <SignUp setFormMode={setFormMode} />}
    </>
   )}
  </SafeAreaView>
 )
})
