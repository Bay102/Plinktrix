import React from 'react'

import { Platform, Text, TouchableOpacity, View } from 'react-native'

import { Tabs } from 'expo-router'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/shared/IconSymbol'
import { createTheme } from '@/constants/Theme'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useAuthProvider, useUserProvider } from '@/providers'

export default function TabLayout() {
 const colorScheme = useColorScheme()
 const { user } = useAuthProvider()
 const { setSettingsModalVisible } = useUserProvider()
 const theme = createTheme(colorScheme)

 return (
  <Tabs
   screenOptions={{
    tabBarActiveTintColor: theme.colors.matrixGreen,
    animation: 'shift',
    headerShown: false,
    tabBarIconStyle: {
     marginTop: 10,
    },
    tabBarButton: HapticTab,
    tabBarStyle: Platform.select({
     ios: {
      // Use a transparent background on iOS to show the blur effect
      position: 'absolute',
     },
    }),
   }}
  >
   <Tabs.Screen
    name="index"
    options={{
     title: '',
     headerShown: false,
     headerShadowVisible: false,
     headerBackgroundContainerStyle: {
      backgroundColor: 'transparent',
     },
     headerBackground: () => (
      <View
       style={{
        flex: 1,
        borderBottomColor: theme.colors.primary,
        borderBottomWidth: 1,
       }}
      />
     ),
     headerTitle: () => (
      <TouchableOpacity
       onPress={() => setSettingsModalVisible(true)}
       style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
       }}
      >
       <Text style={{ color: '#000', fontSize: 16 }}>
        {user?.email?.split('@')[0] || 'Guest'}
       </Text>
      </TouchableOpacity>
     ),
     headerStyle: {
      backgroundColor: theme.colors.background,
     },
     tabBarIcon: ({ color }) => (
      <IconSymbol size={28} name="house.fill" color={color} />
     ),
    }}
   />
   <Tabs.Screen
    name="plinko"
    options={{
     title: '',
     headerShown: false,
     headerShadowVisible: false,
     freezeOnBlur: true,
     headerBackgroundContainerStyle: {
      backgroundColor: 'transparent',
     },
     headerBackground: () => (
      <View
       style={{
        flex: 1,
        borderBottomColor: theme.colors.primary,
        borderBottomWidth: 1,
       }}
      />
     ),
     headerTitle: () => (
      <TouchableOpacity
       onPress={() => setSettingsModalVisible(true)}
       style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
       }}
      >
       <Text style={{ color: '#000', fontSize: 16 }}>
        {user?.email?.split('@')[0] || 'Guest'}
       </Text>
      </TouchableOpacity>
     ),
     headerStyle: {
      backgroundColor: theme.colors.background,
     },
     tabBarIcon: ({ color }) => (
      <IconSymbol size={28} name="gamecontroller.fill" color={color} />
     ),
    }}
   />
   <Tabs.Screen
    name="account"
    options={{
     title: '',
     headerShown: true,
     freezeOnBlur: true,
     headerRight: () => {
      return (
       user && (
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
         <IconSymbol
          size={22}
          style={{ marginRight: 5 }}
          name="gearshape.fill"
          color={theme.colors.icon}
         />
        </TouchableOpacity>
       )
      )
     },
     tabBarIcon: ({ color }) => (
      <IconSymbol size={28} name="person.fill" color={color} />
     ),
    }}
   />
  </Tabs>
 )
}
