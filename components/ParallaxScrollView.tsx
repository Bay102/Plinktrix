import { RefreshControlProps, StyleSheet } from 'react-native'

import styled from '@emotion/native'

import type { PropsWithChildren, ReactElement } from 'react'
import Animated, {
 interpolate,
 useAnimatedRef,
 useAnimatedStyle,
 useScrollViewOffset,
} from 'react-native-reanimated'

import { useBottomTabOverflow } from '@/components/shared/TabBarBackground'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme'

type Props = PropsWithChildren<{
 headerImage: ReactElement
 headerBackgroundColor: { dark: string; light: string }
 refreshControl?: ReactElement<RefreshControlProps>
 headerHeight?: number
}>

export default function ParallaxScrollView({
 children,
 headerImage,
 headerBackgroundColor,
 refreshControl,
 headerHeight = 225,
}: Props) {
 const colorScheme = useColorScheme() ?? 'light'
 const scrollRef = useAnimatedRef<Animated.ScrollView>()
 const scrollOffset = useScrollViewOffset(scrollRef)
 const bottom = useBottomTabOverflow()
 const headerAnimatedStyle = useAnimatedStyle(() => {
  return {
   transform: [
    {
     translateY: interpolate(
      scrollOffset.value,
      [-headerHeight, 0, headerHeight],
      [-headerHeight / 2, 0, headerHeight * 0.75]
     ),
    },
    {
     scale: interpolate(
      scrollOffset.value,
      [-headerHeight, 0, headerHeight],
      [2, 1, 1]
     ),
    },
   ],
  }
 })

 return (
  <ThemedView style={styles.container}>
   <Animated.ScrollView
    ref={scrollRef}
    scrollEventThrottle={16}
    scrollIndicatorInsets={{ bottom }}
    contentContainerStyle={{ paddingBottom: bottom }}
    refreshControl={refreshControl}
   >
    <Header
     height={headerHeight}
     style={[
      { backgroundColor: headerBackgroundColor[colorScheme] },
      headerAnimatedStyle,
     ]}
    >
     {headerImage}
    </Header>
    <ThemedView style={styles.content}>{children}</ThemedView>
   </Animated.ScrollView>
  </ThemedView>
 )
}

const Header = styled(Animated.View)<{ height: number }>`
 height: ${({ height, theme }) => (height ? theme.dp(height) : 250)};
`

const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
 content: {
  flex: 1,
  padding: 32,
  gap: 16,
  overflow: 'hidden',
 },
})
