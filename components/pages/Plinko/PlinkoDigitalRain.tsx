import React, { useEffect, useRef, useState } from 'react'

import { Animated, Dimensions, StyleSheet, View } from 'react-native'

import { Text } from 'react-native-paper'

import { MatrixColors } from '@/constants/Colors'

const { width, height } = Dimensions.get('window')
const BALL_SIZE = 24
const COLUMNS = Math.floor(width / BALL_SIZE)
const CHARACTERS =
 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボпоヴッн'

interface RaindropProps {
 index: number
}

const Raindrop: React.FC<RaindropProps> = ({ index }) => {
 const fallAnim = useRef(new Animated.Value(0)).current
 const [randomChar, setRandomChar] = useState(
  CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
 )
 const [isGold, setIsGold] = useState(Math.random() > 0.7) // Initial state

 useEffect(() => {
  const animate = () => {
   fallAnim.setValue(0)
   // Randomize character and gold status for each new drop
   setIsGold(Math.random() > 0.7) // 30% chance for gold balls
   setRandomChar(
    CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
   )

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
  outputRange: [-BALL_SIZE, height],
 })

 const ballStyle = isGold ? styles.goldBall : styles.regularBall

 return (
  <Animated.View
   style={[
    styles.ball,
    ballStyle,
    {
     left: index * BALL_SIZE + (BALL_SIZE - 20) / 2, // Center the ball in the column
     transform: [{ translateY }],
    },
   ]}
  >
   <Text style={styles.ballText}>{randomChar}</Text>
  </Animated.View>
 )
}

const PlinkoDigitalRain: React.FC = () => {
 return (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
   {Array.from({ length: COLUMNS }).map((_, i) => (
    <Raindrop key={i} index={i} />
   ))}
  </View>
 )
}

const styles = StyleSheet.create({
 ball: {
  position: 'absolute',
  width: 20,
  height: 20,
  borderRadius: 10,
  top: -5,
  alignItems: 'center',
  justifyContent: 'center',
 },
 ballText: {
  color: MatrixColors.matrixDarkBG,
  fontSize: 10,
  fontWeight: 'bold',
  fontFamily: 'VT323',
  textAlign: 'center',
 },
 regularBall: {
  backgroundColor: MatrixColors.matrixGreen,
  borderColor: MatrixColors.matrixGreen,
  borderWidth: 1.5,
  shadowColor: MatrixColors.matrixBlueShadow,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 1,
  shadowRadius: 3,
  elevation: 5,
 },
 goldBall: {
  backgroundColor: MatrixColors.matrixGold,
  borderColor: MatrixColors.matrixGold,
  borderWidth: 1.5,
  shadowColor: MatrixColors.matrixGoldShadow,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 1,
  shadowRadius: 5,
  elevation: 5,
 },
})

export default React.memo(PlinkoDigitalRain)
