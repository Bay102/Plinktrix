import { createNavigationTheme, createTheme } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { AuthProvider } from '@/providers/AuthProvider'
import { UserProvider } from '@/providers/UserProvider'
import { ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider } from 'react-native-paper'
import 'react-native-reanimated'

export default function RootLayout() {
 const colorScheme = useColorScheme()
 const [loaded] = useFonts({
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  VT323: require('../assets/fonts/VT323-Regular.ttf'),
 })

 if (!loaded) {
  return null
 }

 return (
  <AuthProvider>
   <UserProvider>
    <PaperProvider theme={createTheme(colorScheme)}>
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
