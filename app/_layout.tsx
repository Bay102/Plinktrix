import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { useColorScheme } from '@/hooks/useColorScheme'
import { AuthProvider } from '@/providers/AuthProvider'
import { StoreProvider } from '@/providers/StoreProvider'
import { UnifiedThemeProvider } from '@/providers/ThemeProvider'
import { UserProvider } from '@/providers/UserProvider'
import { AppStore } from '@/stores/plinko'

import 'react-native-reanimated'

export default function RootLayout() {
 const [loaded] = useFonts({
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  VT323: require('../assets/fonts/VT323-Regular.ttf'),
 })
 const colorScheme = useColorScheme()

 if (!loaded) {
  return null
 }

 return (
  <StoreProvider store={AppStore}>
   <AuthProvider>
    <UserProvider>
     <UnifiedThemeProvider>
      <Stack>
       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
       <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
     </UnifiedThemeProvider>
    </UserProvider>
   </AuthProvider>
  </StoreProvider>
 )
}
