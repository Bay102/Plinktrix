import DigitalRain from '@/components/pages/Plinko/DigitalRain' // Assuming this component exists
import Overlay from '@/components/pages/Plinko/Overlay'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
 Animated,
 Dimensions,
 Platform,
 ScrollView,
 StatusBar,
 StyleSheet,
 Text,
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
 stuckCounter: number
 lastX: number
 lastY: number
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

// --- Main Plinko Component ---
const App: React.FC = () => {
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
 const [currentGravity, setCurrentGravity] = useState<number>(0.11)

 // --- Refs ---
 const animationFrameRef = useRef<number | null>(null)

 // --- Game Configuration & Constants ---
 const ROWS = 11
 const PEG_HORIZONTAL_SPACING = 35
 const PEG_VERTICAL_SPACING = 40
 const prizeValues = useMemo(() => [1, 5, 10, 0, 100, 0, 10, 5, 1], [])
 const LOW_GRAVITY = 0.05
 const HIGH_GRAVITY = 0.09
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
    // Stuck detection - check if ball hasn't moved much
    const movement = Math.sqrt(
     Math.pow(ball.x - ball.lastX, 2) + Math.pow(ball.y - ball.lastY, 2)
    )

    if (movement < 0.5) {
     ball.stuckCounter++
     // If stuck for too long, give it a random kick
     if (ball.stuckCounter > 30) {
      ball.vx += (Math.random() - 0.5) * 4
      ball.vy += Math.random() * 2 + 1
      ball.stuckCounter = 0
     }
    } else {
     ball.stuckCounter = 0
    }

    // Update last position
    ball.lastX = ball.x
    ball.lastY = ball.y

    // Apply gravity and air resistance
    ball.vy += currentGravity
    ball.vx *= 0.995 // Slightly less air resistance

    // Minimum velocity to prevent complete stops
    if (Math.abs(ball.vx) < 0.1 && Math.abs(ball.vy) < 0.1 && ball.y > 50) {
     ball.vx += (Math.random() - 0.5) * 0.5
     ball.vy += 0.2
    }

    // Anti-center bias - subtly push balls away from center to reduce center hits
    const distanceFromCenter = Math.abs(ball.x - boardWidth / 2)
    if (distanceFromCenter < 30 && ball.y > PEG_VERTICAL_SPACING * 2) {
     const pushDirection = ball.x > boardWidth / 2 ? 1 : -1
     ball.vx += pushDirection * 0.15
    }

    // Update position
    ball.x += ball.vx
    ball.y += ball.vy

    // Natural boundary constraints
    if (ball.x < BALL_RADIUS) {
     ball.x = BALL_RADIUS
     ball.vx = Math.abs(ball.vx) * DAMPENING
    } else if (ball.x > boardWidth - BALL_RADIUS) {
     ball.x = boardWidth - BALL_RADIUS
     ball.vx = -Math.abs(ball.vx) * DAMPENING
    }

    // Peg collisions with improved physics
    for (const row of pegs) {
     for (const peg of row) {
      const dx = ball.x - peg.x
      const dy = ball.y - peg.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < BALL_RADIUS + PEG_RADIUS && distance > 0) {
       const angle = Math.atan2(dy, dx)
       const overlap = BALL_RADIUS + PEG_RADIUS - distance + 1

       // Separate ball from peg
       ball.x += Math.cos(angle) * overlap
       ball.y += Math.sin(angle) * overlap

       // Collision response
       const normalX = dx / distance
       const normalY = dy / distance
       const dotProduct = ball.vx * normalX + ball.vy * normalY

       ball.vx -= 2 * dotProduct * normalX * DAMPENING
       ball.vy -= 2 * dotProduct * normalY * DAMPENING

       // Add increased randomness to spread distribution away from center
       ball.vx += (Math.random() - 0.5) * 2.5
       ball.vy += Math.random() * 0.5

       // Ensure minimum downward velocity
       if (ball.vy < 0.5) {
        ball.vy = 0.5
       }
      }
     }
    }
   })

   // Ball-to-ball collision handling - only after balls pass first peg row
   const firstPegRowY = PEG_VERTICAL_SPACING * 2 // Y position of first peg row
   for (let i = 0; i < newBalls.length; i++) {
    for (let j = i + 1; j < newBalls.length; j++) {
     const ball1 = newBalls[i]
     const ball2 = newBalls[j]

     // Only allow collisions if both balls have passed the first peg row
     if (ball1.y > firstPegRowY && ball2.y > firstPegRowY) {
      const dx = ball2.x - ball1.x
      const dy = ball2.y - ball1.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < BALL_RADIUS * 2 && distance > 0) {
       const angle = Math.atan2(dy, dx)
       const overlap = (BALL_RADIUS * 2 - distance) / 2 + 1

       // Separate balls more aggressively
       ball1.x -= Math.cos(angle) * overlap
       ball1.y -= Math.sin(angle) * overlap
       ball2.x += Math.cos(angle) * overlap
       ball2.y += Math.sin(angle) * overlap

       // Collision response with conservation of momentum
       const normalX = dx / distance
       const normalY = dy / distance
       const v1n = ball1.vx * normalX + ball1.vy * normalY
       const v2n = ball2.vx * normalX + ball2.vy * normalY
       const v1t = -ball1.vx * normalY + ball1.vy * normalX
       const v2t = -ball2.vx * normalY + ball2.vy * normalX

       // Exchange normal velocities
       ball1.vx = (v2n * normalX - v1t * normalY) * DAMPENING
       ball1.vy = (v2n * normalY + v1t * normalX) * DAMPENING
       ball2.vx = (v1n * normalX - v2t * normalY) * DAMPENING
       ball2.vy = (v1n * normalY + v2t * normalX) * DAMPENING

       // Add stronger random forces to prevent clustering and spread distribution
       ball1.vx += (Math.random() - 0.5) * 0.8
       ball1.vy += Math.random() * 0.4
       ball2.vx += (Math.random() - 0.5) * 0.8
       ball2.vy += Math.random() * 0.4
      }
     }
    }
   }

   const boardHeight = (ROWS + 5) * PEG_VERTICAL_SPACING
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
  setCurrentGravity(totalBalls <= 10 ? LOW_GRAVITY : HIGH_GRAVITY)

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
    // Force balls to start perfectly centered in the gap between first two pegs
    const firstRowPegs = pegs[0] // First row has 2 pegs
    const leftPeg = firstRowPegs[0]
    const rightPeg = firstRowPegs[1]
    const gapCenter = (leftPeg.x + rightPeg.x) / 2

    const startY = PEG_VERTICAL_SPACING * 0.5 // All balls start from same height above first row

    const newBall: BallType = {
     id: Date.now() + i,
     x: gapCenter, // Perfectly centered, no offset
     y: startY,
     vx: (Math.random() - 0.5) * 0.1, // Tiny random variation to break collision bias
     vy: 0,
     isGold: ballType.isGold,
     stuckCounter: 0,
     lastX: gapCenter,
     lastY: startY,
    }
    setBalls((prev) => [...prev, newBall])
   }, i * 150)
  })
 }

 // --- Render ---
 return (
  <ScrollView
   style={styles.screen}
   contentContainerStyle={styles.scrollContent}
  >
   <StatusBar barStyle="light-content" />
   <DigitalRain />
   <View style={styles.container}>
    <View style={styles.header}>
     <Text style={styles.title}>Balls Daily</Text>
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

     <Overlay
      isDropping={isDropping}
      regularBallCount={regularBallCount}
      setRegularBallCount={setRegularBallCount}
      goldBallCount={goldBallCount}
      setGoldBallCount={setGoldBallCount}
      handleDropBall={handleDropBall}
      ballsCount={balls.length}
      totalPrize={totalPrize}
      prizeCounts={prizeCounts}
      isAnalyzing={isAnalyzing}
      aiAnalysis={aiAnalysis}
     />
    </View>
    <Text style={styles.footer}> Plinko_v2.5.sys - &copy; 2025</Text>
   </View>
  </ScrollView>
 )
}

// --- Styles ---
const FONT_FAMILY = Platform.OS === 'ios' ? 'VT323' : 'VT323'

const styles = StyleSheet.create({
 screen: { flex: 1, backgroundColor: '#000' },
 scrollContent: {
  flexGrow: 1,
  paddingTop: 40,
  paddingBottom: 100, // Add bottom padding to account for tab bar
 },
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

 footer: {
  fontFamily: FONT_FAMILY,
  color: '#666',
  fontSize: 12,
  marginBottom: 5,
 },
})

export default App
