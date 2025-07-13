import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { Colors, DynamicBGColor } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useAuthProvider, useUserProvider } from '@/providers'
import { Tabs } from 'expo-router'
import React from 'react'
import { Platform, TouchableOpacity, View } from 'react-native'
import { Button } from 'react-native-paper'

export default function TabLayout() {
 const colorScheme = useColorScheme()
 const { user } = useAuthProvider()
 const { setSettingsModalVisible } = useUserProvider()

 return (
  <Tabs
   screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: () => (
     <View
      style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}
     />
    ),
    tabBarStyle: Platform.select({
     ios: {
      // Use a transparent background on iOS to show the blur effect
      position: 'absolute',
     },
    }),
   }}
  >
   <Tabs.Screen
    name="plinko"
    options={{
     title: '',
     headerShown: false,
     tabBarIcon: ({ color }) => (
      <IconSymbol
       size={35}
       name="gamecontroller.fill"
       color={color}
       style={{ marginTop: 15 }}
      />
     ),
    }}
   />
   <Tabs.Screen
    name="index"
    options={{
     title: '',
     headerShown: true,
     headerRight: ({ tintColor }) => (
      <Button mode="text" onPress={() => {}}>
       <IconSymbol
        size={35}
        name="bell"
        color={tintColor ?? 'black'}
        style={{ marginTop: 15 }}
       />
      </Button>
     ),
     headerStyle: {
      backgroundColor: DynamicBGColor(colorScheme),
     },
     tabBarIcon: ({ color }) => (
      <IconSymbol
       size={35}
       name="house.fill"
       color={color}
       style={{ marginTop: 15 }}
      />
     ),
    }}
   />
   <Tabs.Screen
    name="account"
    options={{
     title: '',
     headerShown: true,
     headerRight: ({ tintColor }) =>
      user && (
       <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => setSettingsModalVisible(true)}
       >
        <IconSymbol size={25} name="gear" color={tintColor ?? 'black'} />
       </TouchableOpacity>
      ),

     headerStyle: {
      backgroundColor: DynamicBGColor(colorScheme),
     },
     tabBarIcon: ({ color }) => (
      <IconSymbol
       size={30}
       name="person.circle"
       color={color}
       style={{ marginTop: 15 }}
      />
     ),
    }}
   />
  </Tabs>
 )
}
