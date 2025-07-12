import DigitalRain from '@/components/pages/Plinko/DigitalRain' // Assuming this component exists
import Slider from '@react-native-community/slider'
import { useFonts } from 'expo-font'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
 Animated,
 Dimensions,
 Platform,
 SafeAreaView,
 StatusBar,
 StyleSheet,
 Text,
 TouchableOpacity,
 View,
} from 'react-native'

// --- Type Definitions ---
interface Position {
 x: number
 y: number
}

interface BallType extends Position {
 id: number
 vx: number
 vy: number
 isGold: boolean
}

interface PegType extends Position {}

interface PrizeCount {
 regular: number
 gold: number
}

type PrizeCounts = {
 [key: string]: PrizeCount
}

type AnimationType = 'win' | 'lose' | 'gold' | null

type AnimatingSlots = {
 [key: number]: AnimationType
}

// --- Helper Component Props ---
interface PrizeSlotProps {
 value: number
 animationType: AnimationType
}

interface BallProps {
 position: { x: number; y: number }
 isGold: boolean
}

// --- Helper Components ---
const Peg: React.FC = () => <View style={styles.peg} />

const PrizeSlot: React.FC<PrizeSlotProps> = ({ value, animationType }) => {
 const animatedValue = useRef(new Animated.Value(0)).current

 useEffect(() => {
  if (animationType) {
   animatedValue.setValue(1)
   Animated.timing(animatedValue, {
    toValue: 0,
    duration: 500,
    useNativeDriver: false, // backgroundColor cannot be animated with native driver
   }).start()
  }
 }, [animationType])

 const winColor = 'rgba(0, 255, 0, 0.5)'
 const loseColor = 'rgba(255, 0, 0, 0.5)'
 const goldColor = 'rgba(255, 215, 0, 0.5)'
 const baseColor = 'rgba(0, 0, 0, 0.5)'

 const animatedBackgroundColor = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [
   baseColor,
   (animationType &&
    { win: winColor, lose: loseColor, gold: goldColor }[animationType]) ||
    baseColor,
  ],
 })

 return (
  <Animated.View
   style={[styles.prizeSlot, { backgroundColor: animatedBackgroundColor }]}
  >
   <Text style={styles.prizeSlotText}>${value.toLocaleString()}</Text>
  </Animated.View>
 )
}

const Ball: React.FC<BallProps> = ({ position, isGold }) => {
 const ballStyle = isGold ? styles.goldBall : styles.regularBall
 return (
  <View
   style={[
    styles.ball,
    ballStyle,
    {
     transform: [
      { translateX: position.x - 12 },
      { translateY: position.y - 12 },
     ],
    },
   ]}
  />
 )
}

// --- Main App Component ---
const App: React.FC = () => {
 const [fontsLoaded] = useFonts({
  VT323: require('./assets/fonts/VT323-Regular.ttf'), // Make sure this path is correct
 })

 // --- State Management ---
 const [balls, setBalls] = useState<BallType[]>([])
 const [isDropping, setIsDropping] = useState<boolean>(false)
 const [prizeCounts, setPrizeCounts] = useState<PrizeCounts>({})
 const [totalPrize, setTotalPrize] = useState<number>(0)
 const [boardWidth] = useState<number>(Dimensions.get('window').width)
 const [regularBallCount, setRegularBallCount] = useState<number>(1)
 const [goldBallCount, setGoldBallCount] = useState<number>(0)
 const [aiAnalysis, setAiAnalysis] = useState<string>('')
 const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
 const [animatingSlots, setAnimatingSlots] = useState<AnimatingSlots>({})
 const [currentGravity, setCurrentGravity] = useState<number>(0.25)

 // --- Refs ---
 const animationFrameRef = useRef<number | null>(null)

 // --- Game Configuration & Constants ---
 const ROWS = 14
 const PEG_HORIZONTAL_SPACING = 50
 const PEG_VERTICAL_SPACING = 35
 const prizeValues = useMemo(() => [1, 5, 10, 0, 100, 0, 10, 5, 1], [])
 const LOW_GRAVITY = 0.25
 const HIGH_GRAVITY = 0.4
 const DAMPENING = 0.6
 const PEG_RADIUS = 4
 const BALL_RADIUS = 10

 // --- Peg Generation ---
 const pegs = useMemo<PegType[][]>(() => {
  const pegLayout: PegType[][] = []
  for (let row = 0; row < ROWS; row++) {
   const numPegs = row + 2
   const rowPegs: PegType[] = []
   const rowWidth = (numPegs - 1) * PEG_HORIZONTAL_SPACING
   const startX = (boardWidth - rowWidth) / 2
   for (let col = 0; col < numPegs; col++) {
    rowPegs.push({
     x: startX + col * PEG_HORIZONTAL_SPACING,
     y: PEG_VERTICAL_SPACING * (row + 2),
    })
   }
   pegLayout.push(rowPegs)
  }
  return pegLayout
 }, [boardWidth])

 // --- Gemini API Call ---
 //  const getAiAnalysis = useCallback(
 //   async (counts: PrizeCounts, total: number) => {
 //    setIsAnalyzing(true)
 //    setAiAnalysis('')

 //    const prizeDistribution = Object.entries(counts)
 //     .map(([prize, { regular = 0, gold = 0 }]) => {
 //      let parts = []
 //      if (regular > 0) parts.push(`${regular}x regular for ${prize} credits`)
 //      if (gold > 0) parts.push(`${gold}x GOLD for ${prize} credits (doubled)`)
 //      return parts.join(', ')
 //     })
 //     .join('; ')

 //    const prompt = `You are the system AI for a cyberpunk game called PL1NK0. The user just completed a data drop. The total payout was ${total} credits. The prize distribution was: ${prizeDistribution}. Provide a short, pithy, and thematic analysis of this drop (1-2 sentences). Be creative and stick to the cyberpunk/Matrix theme. Examples: "A clean extraction. Minimal resistance encountered." or "Volatile data stream. High risk, high reward. Watch your back, operator." or "Firewall breached. You've extracted a significant data payload."`

 //    try {
 //     let chatHistory = []
 //     chatHistory.push({ role: 'user', parts: [{ text: prompt }] })
 //     const payload = { contents: chatHistory }
 //     const apiKey = '' // IMPORTANT: Use a secure way to manage API keys
 //     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

 //     const response = await fetch(apiUrl, {
 //      method: 'POST',
 //      headers: { 'Content-Type': 'application/json' },
 //      body: JSON.stringify(payload),
 //     })

 //     if (!response.ok) {
 //      throw new Error(`API request failed with status ${response.status}`)
 //     }

 //     const result = await response.json()

 //     if (
 //      result.candidates &&
 //      result.candidates.length > 0 &&
 //      result.candidates[0].content &&
 //      result.candidates[0].content.parts &&
 //      result.candidates[0].content.parts.length > 0
 //     ) {
 //      const text = result.candidates[0].content.parts[0].text
 //      setAiAnalysis(text)
 //     } else {
 //      throw new Error('Invalid response structure from API.')
 //     }
 //    } catch (error) {
 //     console.error('Gemini API error:', error)
 //     setAiAnalysis('// System Error: Analysis protocol failed. Recalibrating...')
 //    } finally {
 //     setIsAnalyzing(false)
 //    }
 //   },
 //   []
 //  )

 // --- Main Physics & Animation Loop ---
 const gameLoop = useCallback(() => {
  setBalls((prevBalls) => {
   let newBalls = prevBalls.map((ball) => ({ ...ball }))

   newBalls.forEach((ball) => {
    ball.vy += currentGravity
    ball.vx *= 0.99

    ball.x += ball.vx
    ball.y += ball.vy

    const secondRowY = PEG_VERTICAL_SPACING * 3

    if (ball.y < secondRowY) {
     const funnelWidth = PEG_HORIZONTAL_SPACING * 2 + BALL_RADIUS
     const boardCenter = boardWidth / 2
     const funnelLeft = boardCenter - funnelWidth / 2
     const funnelRight = boardCenter + funnelWidth / 2

     if (ball.x < funnelLeft) {
      ball.x = funnelLeft
      ball.vx *= -DAMPENING
     } else if (ball.x > funnelRight) {
      ball.x = funnelRight
      ball.vx *= -DAMPENING
     }
    } else {
     if (ball.x < BALL_RADIUS || ball.x > boardWidth - BALL_RADIUS) {
      ball.vx *= -DAMPENING
      ball.x = ball.x < BALL_RADIUS ? BALL_RADIUS : boardWidth - BALL_RADIUS
     }
    }

    for (const row of pegs) {
     for (const peg of row) {
      const dx = ball.x - peg.x
      const dy = ball.y - peg.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < BALL_RADIUS + PEG_RADIUS) {
       const angle = Math.atan2(dy, dx)
       const overlap = BALL_RADIUS + PEG_RADIUS - distance

       ball.x += Math.cos(angle) * overlap
       ball.y += Math.sin(angle) * overlap

       const normalX = dx / distance
       const normalY = dy / distance
       const dotProduct = ball.vx * normalX + ball.vy * normalY

       ball.vx -= 2 * dotProduct * normalX * DAMPENING
       ball.vy -= 2 * dotProduct * normalY * DAMPENING

       if (dy < 0 && Math.abs(ball.vy) < 0.5) {
        ball.vx += (Math.random() - 0.5) * 1.5
        ball.vy += 0.2
       }
      }
     }
    }
   })

   for (let i = 0; i < newBalls.length; i++) {
    for (let j = i + 1; j < newBalls.length; j++) {
     const ball1 = newBalls[i]
     const ball2 = newBalls[j]
     const dx = ball2.x - ball1.x
     const dy = ball2.y - ball1.y
     const distance = Math.sqrt(dx * dx + dy * dy)

     if (distance < BALL_RADIUS * 2) {
      const angle = Math.atan2(dy, dx)
      const overlap = (BALL_RADIUS * 2 - distance) / 2
      ball1.x -= Math.cos(angle) * overlap
      ball1.y -= Math.sin(angle) * overlap
      ball2.x += Math.cos(angle) * overlap
      ball2.y += Math.sin(angle) * overlap
      const normalX = dx / distance
      const normalY = dy / distance
      const v1n = ball1.vx * normalX + ball1.vy * normalY
      const v2n = ball2.vx * normalX + ball2.vy * normalY
      const v1t = -ball1.vx * normalY + ball1.vy * normalX
      const v2t = -ball2.vx * normalY + ball2.vy * normalX
      const v1n_final = v2n
      const v2n_final = v1n
      ball1.vx = (v1n_final * normalX - v1t * normalY) * DAMPENING
      ball1.vy = (v1n_final * normalY + v1t * normalX) * DAMPENING
      ball2.vx = (v2n_final * normalX - v2t * normalY) * DAMPENING
      ball2.vy = (v2n_final * normalY + v2t * normalX) * DAMPENING
     }
    }
   }

   const boardHeight = (ROWS + 4) * PEG_VERTICAL_SPACING
   const landedBalls = newBalls.filter((ball) => ball.y > boardHeight)
   const activeBalls = newBalls.filter((ball) => ball.y <= boardHeight)

   if (landedBalls.length > 0) {
    const newCounts: PrizeCounts = {}
    let newPrize = 0
    landedBalls.forEach((ball) => {
     const slotIndex = Math.floor((ball.x / boardWidth) * prizeValues.length)
     const prize =
      prizeValues[Math.max(0, Math.min(slotIndex, prizeValues.length - 1))]

     const finalPrize = ball.isGold && prize !== 0 ? prize * 2 : prize
     newPrize += finalPrize

     let animationType: AnimationType = 'win'
     if (prize === 0) {
      animationType = 'lose'
     } else if (ball.isGold) {
      animationType = 'gold'
     }

     setAnimatingSlots((prev) => ({ ...prev, [slotIndex]: animationType }))
     setTimeout(() => {
      setAnimatingSlots((prev) => ({ ...prev, [slotIndex]: null }))
     }, 500)

     const prizeKey = String(prize)
     if (!newCounts[prizeKey]) {
      newCounts[prizeKey] = { regular: 0, gold: 0 }
     }
     if (ball.isGold) {
      newCounts[prizeKey].gold++
     } else {
      newCounts[prizeKey].regular++
     }
    })

    setTimeout(() => {
     setTotalPrize((prev) => prev + newPrize)
     setPrizeCounts((prev) => {
      const updatedCounts = { ...prev }
      for (const prize in newCounts) {
       if (!updatedCounts[prize]) {
        updatedCounts[prize] = { regular: 0, gold: 0 }
       }
       updatedCounts[prize].regular += newCounts[prize].regular
       updatedCounts[prize].gold += newCounts[prize].gold
      }
      return updatedCounts
     })
    }, 0)
   }

   if (activeBalls.length === 0 && prevBalls.length > 0) {
    setIsDropping(false)
    // setTimeout(() => getAiAnalysis(prizeCounts, totalPrize), 100)
   }

   return activeBalls
  })

  animationFrameRef.current = requestAnimationFrame(gameLoop)
 }, [
  pegs,
  boardWidth,
  prizeValues,
  prizeCounts,
  totalPrize,
  currentGravity,
  // getAiAnalysis,
 ])

 useEffect(() => {
  if (isDropping) {
   animationFrameRef.current = requestAnimationFrame(gameLoop)
  } else {
   if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current)
   }
  }
  return () => {
   if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current)
   }
  }
 }, [isDropping, gameLoop])

 const handleDropBall = () => {
  if (isDropping) return

  const totalBalls = regularBallCount + goldBallCount
  setCurrentGravity(totalBalls <= 5 ? LOW_GRAVITY : HIGH_GRAVITY)

  setBalls([])
  setPrizeCounts({})
  setTotalPrize(0)
  setAiAnalysis('')
  setIsDropping(true)

  const ballsToDrop: { isGold: boolean }[] = []
  for (let i = 0; i < goldBallCount; i++) {
   ballsToDrop.push({ isGold: true })
  }
  for (let i = 0; i < regularBallCount; i++) {
   ballsToDrop.push({ isGold: false })
  }

  for (let i = ballsToDrop.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1))
   ;[ballsToDrop[i], ballsToDrop[j]] = [ballsToDrop[j], ballsToDrop[i]]
  }

  ballsToDrop.forEach((ballType, i) => {
   setTimeout(() => {
    const startOffset = (Math.random() - 0.5) * 10
    const newBall: BallType = {
     id: Date.now() + i,
     x: boardWidth / 2 + startOffset,
     y: 20 - i * (BALL_RADIUS * 2.5),
     vx: (Math.random() - 0.5) * 2,
     vy: 0,
     isGold: ballType.isGold,
    }
    setBalls((prev) => [...prev, newBall])
   }, i * 50)
  })
 }

 if (!fontsLoaded) {
  return (
   <View style={styles.container}>
    <Text style={styles.loadingText}>Loading Assets...</Text>
   </View>
  )
 }

 // --- Render ---
 return (
  <SafeAreaView style={styles.screen}>
   <StatusBar barStyle="light-content" />
   <DigitalRain />
   <View style={styles.container}>
    <View style={styles.header}>
     <Text style={styles.title}>PL1NK0</Text>
     <Text style={styles.subtitle}>
      Risk calculation subroutine initiated...
     </Text>
    </View>

    <View
     style={[
      styles.board,
      { width: boardWidth, height: (ROWS + 5) * PEG_VERTICAL_SPACING },
     ]}
    >
     {pegs.flat().map((peg, i) => (
      <View
       key={i}
       style={{
        position: 'absolute',
        top: peg.y,
        left: peg.x,
        transform: [{ translateX: -PEG_RADIUS }],
       }}
      >
       <Peg />
      </View>
     ))}
     {balls.map((ball) => (
      <Ball
       key={ball.id}
       position={{ x: ball.x, y: ball.y }}
       isGold={ball.isGold}
      />
     ))}
     <View style={styles.prizeContainer}>
      {prizeValues.map((value, i) => (
       <PrizeSlot key={i} value={value} animationType={animatingSlots[i]} />
      ))}
     </View>
    </View>

    <View style={styles.controls}>
     <View style={styles.sliderContainer}>
      <Text style={styles.labelText}>
       Regular Data Packets:{' '}
       <Text style={{ color: '#FFF' }}>{regularBallCount}</Text>
      </Text>
      <Slider
       style={{ width: '100%', height: 40 }}
       minimumValue={1}
       maximumValue={40}
       step={1}
       value={regularBallCount}
       onValueChange={setRegularBallCount}
       disabled={isDropping}
       minimumTrackTintColor="#0F0"
       maximumTrackTintColor="#050"
       thumbTintColor={Platform.OS === 'ios' ? undefined : '#0F0'}
      />
     </View>

     <View style={styles.sliderContainer}>
      <Text style={styles.labelText}>
       Gold Data Packets:{' '}
       <Text style={{ color: '#FFD700' }}>{goldBallCount}</Text>
      </Text>
      <Slider
       style={{ width: '100%', height: 40 }}
       minimumValue={0}
       maximumValue={10}
       step={1}
       value={goldBallCount}
       onValueChange={setGoldBallCount}
       disabled={isDropping}
       minimumTrackTintColor="#FFD700"
       maximumTrackTintColor="#554200"
       thumbTintColor={Platform.OS === 'ios' ? undefined : '#FFD700'}
      />
     </View>

     <TouchableOpacity
      onPress={handleDropBall}
      disabled={isDropping}
      style={[styles.button, isDropping && styles.disabledButton]}
     >
      <Text style={styles.buttonText}>
       {isDropping
        ? `Executing... [${balls.length}]`
        : `[ Initiate Drop ${regularBallCount + goldBallCount} ]`}
      </Text>
     </TouchableOpacity>

     {(totalPrize > 0 || Object.keys(prizeCounts).length > 0) &&
      !isDropping && (
       <View style={styles.resultsContainer}>
        <Text style={styles.payoutText}>
         Payout: ${totalPrize.toLocaleString()}
        </Text>

        <View style={styles.analysisSection}>
         <Text style={styles.analysisTitle}>
          {' '}
          &quot;// Drop Analysis //&quot;
         </Text>
         {Object.entries(prizeCounts)
          .sort(([valA], [valB]) => Number(valB) - Number(valA))
          .map(([value, { regular, gold }]) => (
           <React.Fragment key={value}>
            {regular > 0 && (
             <View style={styles.resultRow}>
              <Text style={styles.resultText}>
               Prize:{' '}
               <Text style={{ color: '#FFF' }}>
                ${Number(value).toLocaleString()}
               </Text>
              </Text>
              <Text style={styles.resultText}>x {regular}</Text>
             </View>
            )}
            {gold > 0 && (
             <View style={styles.resultRow}>
              <Text style={styles.resultText}>
               Prize:{' '}
               <Text style={{ color: '#FFD700' }}>
                ${Number(value).toLocaleString()} (x2)
               </Text>
              </Text>
              <Text style={styles.resultText}>x {gold}</Text>
             </View>
            )}
           </React.Fragment>
          ))}
        </View>

        <View style={styles.analysisSection}>
         <Text style={styles.analysisTitle}>✨ // System Commentary //</Text>
         {isAnalyzing && (
          <Text style={styles.aiText}> Analyzing data stream...</Text>
         )}
         {aiAnalysis && (
          <Text style={[styles.aiText, { fontStyle: 'italic' }]}>
           &quot;{aiAnalysis}&quot;
          </Text>
         )}
        </View>
       </View>
      )}
    </View>
    <Text style={styles.footer}> Plinko_v2.5.sys - &copy; 2025</Text>
   </View>
  </SafeAreaView>
 )
}

// --- Styles ---
const FONT_FAMILY = Platform.OS === 'ios' ? 'VT323' : 'VT323'

const styles = StyleSheet.create({
 screen: { flex: 1, backgroundColor: '#000' },
 container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 16,
 },
 loadingText: { fontFamily: FONT_FAMILY, color: '#0F0', fontSize: 24 },
 header: { alignItems: 'center', marginTop: 10 },
 title: {
  fontFamily: FONT_FAMILY,
  fontSize: 64,
  color: '#0F0',
  textShadowColor: 'rgba(0, 255, 0, 0.7)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
 },
 subtitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: '#AAA',
  marginTop: 4,
 },
 board: {
  position: 'relative',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderWidth: 2,
  borderColor: '#0F0',
  borderRadius: 8,
 },
 peg: {
  width: 8,
  height: 8,
  backgroundColor: '#0F0',
  borderRadius: 4,
  shadowColor: '#0F0',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 1,
  shadowRadius: 5,
  elevation: 5,
 },
 prizeContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'center',
 },
 prizeSlot: {
  flex: 1,
  height: 35,
  alignItems: 'center',
  justifyContent: 'center',
  borderTopWidth: 2,
  borderTopColor: '#0F0',
 },
 prizeSlotText: {
  fontFamily: FONT_FAMILY,
  color: '#0F0',
  fontSize: 14,
  fontWeight: 'bold',
 },
 ball: { position: 'absolute', width: 20, height: 20, borderRadius: 10 },
 regularBall: { backgroundColor: '#0AF', borderColor: '#0CF', borderWidth: 2 },
 goldBall: { backgroundColor: '#FFD700', borderColor: '#FFF', borderWidth: 2 },
 controls: { width: '90%', maxWidth: 400, alignItems: 'center', marginTop: 10 },
 sliderContainer: { width: '100%', marginBottom: 10 },
 labelText: {
  fontFamily: FONT_FAMILY,
  color: '#0F0',
  fontSize: 18,
  marginBottom: 4,
  textShadowColor: 'rgba(0, 255, 0, 0.5)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
 },
 button: {
  paddingVertical: 12,
  paddingHorizontal: 24,
  backgroundColor: '#0F0',
  borderWidth: 2,
  borderColor: '#0F0',
  shadowColor: '#0F0',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 10,
  elevation: 8,
  borderRadius: 4,
  marginTop: 10,
 },
 disabledButton: {
  backgroundColor: '#555',
  borderColor: '#777',
  shadowOpacity: 0,
  elevation: 0,
 },
 buttonText: {
  color: '#000',
  fontFamily: FONT_FAMILY,
  fontSize: 20,
  fontWeight: 'bold',
 },
 resultsContainer: {
  marginTop: 16,
  padding: 12,
  backgroundColor: 'rgba(0,0,0,0.8)',
  borderWidth: 1,
  borderColor: '#0F0',
  borderRadius: 8,
  width: '100%',
 },
 payoutText: {
  fontFamily: FONT_FAMILY,
  fontSize: 24,
  color: '#FFF',
  textAlign: 'center',
  textShadowColor: 'rgba(0, 255, 0, 0.7)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 8,
 },
 analysisSection: {
  marginTop: 8,
  paddingTop: 8,
  borderTopWidth: 1,
  borderTopColor: '#070',
 },
 analysisTitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: '#0F0',
  marginBottom: 4,
  textShadowColor: 'rgba(0, 255, 0, 0.5)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
 },
 resultRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 4,
 },
 resultText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: '#CCC',
 },
 aiText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: '#FFF',
 },
 footer: {
  fontFamily: FONT_FAMILY,
  color: '#666',
  fontSize: 12,
  marginBottom: 5,
 },
})

export default App
