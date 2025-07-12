import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useAuthProvider, useUserProvider } from '@/providers'
import { Tabs } from 'expo-router'
import React from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-paper'

export default function TabLayout() {
 const colorScheme = useColorScheme()
 const { logOut, user } = useAuthProvider()
 const { settingsModalVisible, setSettingsModalVisible } = useUserProvider()

 return (
  <Tabs
   screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
     ios: {
      // Use a transparent background on iOS to show the blur effect
      position: 'absolute',
     },
     default: {},
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
      backgroundColor: Colors.dark.background,
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
       <TouchableOpacity onPress={() => logOut()}>
        <IconSymbol
         size={22}
         name="person.badge.minus"
         color={tintColor ?? 'black'}
        />
       </TouchableOpacity>
      ),
     headerLeft: ({ tintColor }) =>
      user && (
       <TouchableOpacity
        style={{}}
        onPress={() => setSettingsModalVisible(true)}
       >
        <IconSymbol size={22} name="gear.circle" color={tintColor ?? 'black'} />
       </TouchableOpacity>
      ),
     headerStyle: {
      backgroundColor: Colors.dark.background,
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
