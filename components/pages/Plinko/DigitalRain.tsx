// DigitalRain.tsx

import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'

const { width, height } = Dimensions.get('window')
const FONT_SIZE = 16
const COLUMNS = Math.floor(width / FONT_SIZE)
const CHARACTERS =
 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボпоヴッн'

interface RaindropProps {
 index: number
}

const Raindrop: React.FC<RaindropProps> = ({ index }) => {
 const fallAnim = useRef(new Animated.Value(0)).current
 const randomChar = useRef(
  CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
 ).current

 useEffect(() => {
  const animate = () => {
   fallAnim.setValue(0)
   Animated.timing(fallAnim, {
    toValue: 1,
    duration: Math.random() * 5000 + 3000,
    delay: Math.random() * 10000,
    useNativeDriver: true,
   }).start(() => animate())
  }
  animate()
 }, [fallAnim])

 const translateY = fallAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [-FONT_SIZE, height],
 })

 return (
  <Animated.Text
   style={[
    styles.char,
    {
     left: index * FONT_SIZE,
     transform: [{ translateY }],
    },
   ]}
  >
   {randomChar}
  </Animated.Text>
 )
}

const DigitalRain: React.FC = () => {
 return (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
   {Array.from({ length: COLUMNS }).map((_, i) => (
    <Raindrop key={i} index={i} />
   ))}
  </View>
 )
}

const styles = StyleSheet.create({
 char: {
  fontFamily: 'VT323',
  color: '#0F0',
  fontSize: FONT_SIZE,
  position: 'absolute',
  top: 0,
  textShadowColor: 'rgba(0, 255, 0, 0.7)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
 },
})

export default React.memo(DigitalRain)
