import { ThemeProvider } from '@react-navigation/native'

import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider } from 'react-native-paper'

import { createNavigationTheme, createTheme } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { AuthProvider } from '@/providers/AuthProvider'
import { UserProvider } from '@/providers/UserProvider'

import 'react-native-reanimated'

export default function RootLayout() {
 const [loaded] = useFonts({
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  VT323: require('../assets/fonts/VT323-Regular.ttf'),
 })
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)

 if (!loaded) {
  return null
 }

 return (
  <AuthProvider>
   <UserProvider>
    <PaperProvider theme={theme}>
     <ThemeProvider value={createNavigationTheme(colorScheme)}>
      <Stack>
       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
       <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
     </ThemeProvider>
    </PaperProvider>
   </UserProvider>
  </AuthProvider>
 )
}
