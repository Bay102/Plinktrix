import { DebugOverlay } from '@/components/development/plinko'
import DigitalRain from '@/components/pages/Plinko/DigitalRain' // Assuming this component exists
import Overlay from '@/components/pages/Plinko/Overlay'
import { MatrixColors } from '@/constants/Colors'
import { useAuthProvider } from '@/providers'
import {
 GameResultData,
 getUserStats,
 updateUserStats,
} from '@/supabase/api/update-user-stats'
import { UserData } from '@/supabase/types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
 Animated,
 Dimensions,
 Platform,
 ScrollView,
 StatusBar,
 StyleSheet,
 View,
} from 'react-native'
import { Text } from 'react-native-paper'

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

// --- New State Management Types ---
interface GameState {
 isDropping: boolean
 totalPrize: number
 currentGravity: number
 isAnalyzing: boolean
 aiAnalysis: string
 gameEndedWithPrize: number | null
}

interface BallCounts {
 regular: number
 gold: number
}

interface LoadingState {
 isLoadingStats: boolean
 isUpdatingStats: boolean
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

interface PegGridProps {
 pegs: PegType[][]
}

interface BallLayerProps {
 balls: BallType[]
}

interface PrizeSlotLayerProps {
 prizeValues: number[]
 animatingSlots: AnimatingSlots
}

// --- Memoized Helper Components ---
const Peg = React.memo(() => <View style={styles.peg} />)
Peg.displayName = 'Peg'

const PrizeSlot = React.memo<PrizeSlotProps>(({ value, animationType }) => {
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
 }, [animationType, animatedValue])

 const animationColors = useMemo(
  () => ({
   win: 'rgba(0, 255, 0, 0.5)',
   lose: 'rgba(255, 0, 0, 0.5)',
   gold: 'rgba(255, 215, 0, 0.5)',
   base: 'rgba(0, 0, 0, 0.5)',
  }),
  []
 )

 const animatedBackgroundColor = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: [
   animationColors.base,
   (animationType && animationColors[animationType]) || animationColors.base,
  ],
 })

 return (
  <Animated.View
   style={[styles.prizeSlot, { backgroundColor: animatedBackgroundColor }]}
  >
   <Text style={styles.prizeSlotText}>{value.toLocaleString()}</Text>
  </Animated.View>
 )
})
PrizeSlot.displayName = 'PrizeSlot'

const Ball = React.memo<BallProps>(({ position, isGold }) => {
 const ballStyle = isGold ? styles.goldBall : styles.regularBall
 const transform = useMemo(
  () => [{ translateX: position.x - 12 }, { translateY: position.y - 12 }],
  [position.x, position.y]
 )

 return <View style={[styles.ball, ballStyle, { transform }]} />
})
Ball.displayName = 'Ball'

const PegGrid = React.memo<PegGridProps>(({ pegs }) => {
 const PEG_RADIUS = 4
 return (
  <>
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
  </>
 )
})
PegGrid.displayName = 'PegGrid'

const BallLayer = React.memo<BallLayerProps>(({ balls }) => (
 <>
  {balls.map((ball) => (
   <Ball
    key={ball.id}
    position={{ x: ball.x, y: ball.y }}
    isGold={ball.isGold}
   />
  ))}
 </>
))
BallLayer.displayName = 'BallLayer'

const PrizeSlotLayer = React.memo<PrizeSlotLayerProps>(
 ({ prizeValues, animatingSlots }) => (
  <View style={styles.prizeContainer}>
   {prizeValues.map((value, i) => (
    <PrizeSlot key={i} value={value} animationType={animatingSlots[i]} />
   ))}
  </View>
 )
)
PrizeSlotLayer.displayName = 'PrizeSlotLayer'

// --- Main Plinko Component ---
const Plinko: React.FC = () => {
 // --- Providers ---
 const { user, setUserData } = useAuthProvider()

 // --- Consolidated State Management ---
 const [balls, setBalls] = useState<BallType[]>([])
 const [gameState, setGameState] = useState<GameState>({
  isDropping: false,
  totalPrize: 0,
  currentGravity: 0.11,
  isAnalyzing: false,
  aiAnalysis: '',
  gameEndedWithPrize: null,
 })
 const [ballCounts, setBallCounts] = useState<BallCounts>({
  regular: 1,
  gold: 0,
 })
 const [loadingState, setLoadingState] = useState<LoadingState>({
  isLoadingStats: false,
  isUpdatingStats: false,
 })
 const [prizeCounts, setPrizeCounts] = useState<PrizeCounts>({})
 const [boardWidth] = useState<number>(Dimensions.get('window').width)
 const [animatingSlots, setAnimatingSlots] = useState<AnimatingSlots>({})
 const [userStats, setUserStats] = useState<UserData | null>(null)
 const [isDebugMode, setIsDebugMode] = useState<boolean>(false)

 // --- Refs ---
 const animationFrameRef = useRef<number | null>(null)
 const timeoutRefs = useRef<Map<number, number>>(new Map())

 // --- Game Configuration & Constants ---
 const gameConstants = useMemo(
  () => ({
   ROWS: 11,
   PEG_HORIZONTAL_SPACING: 35,
   PEG_VERTICAL_SPACING: 40,
   LOW_GRAVITY: 0.05,
   HIGH_GRAVITY: 0.09,
   DAMPENING: 0.6,
   PEG_RADIUS: 4,
   BALL_RADIUS: 10,
   MAX_TOTAL_BALLS: 100,
  }),
  []
 )

 const prizeValues = useMemo(() => [1, 5, 10, 0, 100, 0, 10, 5, 1], [])

 // --- Memoized Calculations ---
 const boardDimensions = useMemo(
  () => ({
   width: boardWidth,
   height: (gameConstants.ROWS + 5) * gameConstants.PEG_VERTICAL_SPACING,
  }),
  [boardWidth, gameConstants.ROWS, gameConstants.PEG_VERTICAL_SPACING]
 )

 const maxRegularBalls = userStats?.regular_packets || 0
 const maxGoldBalls = userStats?.bonus_packets || 0

 const gameValidation = useMemo(() => {
  const hasInsufficientBalls =
   ballCounts.regular > maxRegularBalls || ballCounts.gold > maxGoldBalls
  const hasTooManyBalls =
   ballCounts.regular + ballCounts.gold > gameConstants.MAX_TOTAL_BALLS
  const canStartGame =
   !gameState.isDropping &&
   !hasInsufficientBalls &&
   !hasTooManyBalls &&
   (ballCounts.regular > 0 || ballCounts.gold > 0) &&
   !!user?.id

  return {
   hasInsufficientBalls,
   hasTooManyBalls,
   canStartGame,
  }
 }, [
  ballCounts,
  maxRegularBalls,
  maxGoldBalls,
  gameState.isDropping,
  user?.id,
  gameConstants.MAX_TOTAL_BALLS,
 ])

 // --- User Data Management ---
 const fetchUserStats = useCallback(async () => {
  if (!user?.id) return

  try {
   setLoadingState((prev) => ({ ...prev, isLoadingStats: true }))
   const stats = await getUserStats(user.id)
   setUserStats(stats)

   // Update auth provider with latest user data
   if (stats) {
    setUserData(stats)
   }
  } catch (error) {
   console.error('Error fetching user stats:', error)
  } finally {
   setLoadingState((prev) => ({ ...prev, isLoadingStats: false }))
  }
 }, [user?.id, setUserData])

 const updateUserStatsAfterGame = useCallback(
  async (scoreEarned: number) => {
   if (!user?.id || loadingState.isUpdatingStats) return

   try {
    setLoadingState((prev) => ({ ...prev, isUpdatingStats: true }))

    const gameResult: GameResultData = {
     ballsUsed: {
      regular: ballCounts.regular,
      gold: ballCounts.gold,
     },
     scoreEarned,
    }

    const updatedStats = await updateUserStats(user.id, gameResult)
    if (updatedStats) {
     setUserStats(updatedStats)
     setUserData(updatedStats)
    }
   } catch (error) {
    console.error('Error updating user stats:', error)
   } finally {
    setLoadingState((prev) => ({ ...prev, isUpdatingStats: false }))
   }
  },
  [user?.id, loadingState.isUpdatingStats, ballCounts, setUserData]
 )

 // Fetch user stats when user changes
 useEffect(() => {
  if (user?.id) {
   fetchUserStats()
  }
 }, [user?.id, fetchUserStats])

 // Update ball counts when user stats change
 useEffect(() => {
  if (userStats) {
   setBallCounts((prev) => ({
    regular:
     prev.regular > userStats.regular_packets
      ? Math.max(1, userStats.regular_packets)
      : prev.regular,
    gold:
     prev.gold > userStats.bonus_packets
      ? Math.min(prev.gold, userStats.bonus_packets)
      : prev.gold,
   }))
  }
 }, [userStats])

 // Handle game end and stats update
 useEffect(() => {
  if (gameState.gameEndedWithPrize !== null && user?.id) {
   updateUserStatsAfterGame(gameState.gameEndedWithPrize)
   setGameState((prev) => ({ ...prev, gameEndedWithPrize: null }))
  }
 }, [gameState.gameEndedWithPrize, user?.id, updateUserStatsAfterGame])

 // --- Peg Generation ---
 const pegs = useMemo<PegType[][]>(() => {
  const pegLayout: PegType[][] = []
  for (let row = 0; row < gameConstants.ROWS; row++) {
   const numPegs = row + 2
   const rowPegs: PegType[] = []
   const rowWidth = (numPegs - 1) * gameConstants.PEG_HORIZONTAL_SPACING
   const startX = (boardWidth - rowWidth) / 2
   for (let col = 0; col < numPegs; col++) {
    rowPegs.push({
     x: startX + col * gameConstants.PEG_HORIZONTAL_SPACING,
     y: gameConstants.PEG_VERTICAL_SPACING * (row + 2),
    })
   }
   pegLayout.push(rowPegs)
  }
  return pegLayout
 }, [boardWidth, gameConstants])

 // --- Optimized Animation Slot Management ---
 const updateAnimatingSlots = useCallback(
  (slotIndex: number, animationType: AnimationType) => {
   setAnimatingSlots((prev) => ({ ...prev, [slotIndex]: animationType }))

   // Clear existing timeout for this slot
   const existingTimeout = timeoutRefs.current.get(slotIndex)
   if (existingTimeout) {
    clearTimeout(existingTimeout)
   }

   // Set new timeout
   const newTimeout = setTimeout(() => {
    setAnimatingSlots((prev) => ({ ...prev, [slotIndex]: null }))
    timeoutRefs.current.delete(slotIndex)
   }, 500) as number

   timeoutRefs.current.set(slotIndex, newTimeout)
  },
  []
 )

 // --- Physics Helper Functions ---
 const updateBallPhysics = useCallback(
  (newBalls: BallType[]) => {
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
    ball.vy += gameState.currentGravity
    ball.vx *= 0.995 // Slightly less air resistance

    // Minimum velocity to prevent complete stops
    if (Math.abs(ball.vx) < 0.1 && Math.abs(ball.vy) < 0.1 && ball.y > 50) {
     ball.vx += (Math.random() - 0.5) * 0.5
     ball.vy += 0.2
    }

    // Anti-center bias - subtly push balls away from center to reduce center hits
    const distanceFromCenter = Math.abs(ball.x - boardWidth / 2)
    if (
     distanceFromCenter < 10 &&
     ball.y > gameConstants.PEG_VERTICAL_SPACING * 2
    ) {
     const pushDirection = ball.x > boardWidth / 2 ? 1 : -1
     ball.vx += pushDirection * 0.15
    }

    // Update position
    ball.x += ball.vx
    ball.y += ball.vy

    // Natural boundary constraints
    if (ball.x < gameConstants.BALL_RADIUS) {
     ball.x = gameConstants.BALL_RADIUS
     ball.vx = Math.abs(ball.vx) * gameConstants.DAMPENING
    } else if (ball.x > boardWidth - gameConstants.BALL_RADIUS) {
     ball.x = boardWidth - gameConstants.BALL_RADIUS
     ball.vx = -Math.abs(ball.vx) * gameConstants.DAMPENING
    }
   })
  },
  [gameState.currentGravity, boardWidth, gameConstants]
 )

 const handlePegCollisions = useCallback(
  (newBalls: BallType[]) => {
   newBalls.forEach((ball) => {
    // Peg collisions with improved physics
    for (const row of pegs) {
     for (const peg of row) {
      const dx = ball.x - peg.x
      const dy = ball.y - peg.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (
       distance < gameConstants.BALL_RADIUS + gameConstants.PEG_RADIUS &&
       distance > 0
      ) {
       const angle = Math.atan2(dy, dx)
       const overlap =
        gameConstants.BALL_RADIUS + gameConstants.PEG_RADIUS - distance + 1

       // Separate ball from peg
       ball.x += Math.cos(angle) * overlap
       ball.y += Math.sin(angle) * overlap

       // Collision response
       const normalX = dx / distance
       const normalY = dy / distance
       const dotProduct = ball.vx * normalX + ball.vy * normalY

       ball.vx -= 2 * dotProduct * normalX * gameConstants.DAMPENING
       ball.vy -= 2 * dotProduct * normalY * gameConstants.DAMPENING

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
  },
  [pegs, gameConstants]
 )

 const handleBallCollisions = useCallback(
  (newBalls: BallType[]) => {
   // Ball-to-ball collision handling - only after balls pass first peg row
   const firstPegRowY = gameConstants.PEG_VERTICAL_SPACING * 2 // Y position of first peg row
   for (let i = 0; i < newBalls.length; i++) {
    for (let j = i + 1; j < newBalls.length; j++) {
     const ball1 = newBalls[i]
     const ball2 = newBalls[j]

     // Only allow collisions if both balls have passed the first peg row
     if (ball1.y > firstPegRowY && ball2.y > firstPegRowY) {
      const dx = ball2.x - ball1.x
      const dy = ball2.y - ball1.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < gameConstants.BALL_RADIUS * 2 && distance > 0) {
       const angle = Math.atan2(dy, dx)
       const overlap = (gameConstants.BALL_RADIUS * 2 - distance) / 2 + 1

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
       ball1.vx = (v2n * normalX - v1t * normalY) * gameConstants.DAMPENING
       ball1.vy = (v2n * normalY + v1t * normalX) * gameConstants.DAMPENING
       ball2.vx = (v1n * normalX - v2t * normalY) * gameConstants.DAMPENING
       ball2.vy = (v1n * normalY + v2t * normalX) * gameConstants.DAMPENING

       // Add stronger random forces to prevent clustering and spread distribution
       ball1.vx += (Math.random() - 0.5) * 0.8
       ball1.vy += Math.random() * 0.4
       ball2.vx += (Math.random() - 0.5) * 0.8
       ball2.vy += Math.random() * 0.4
      }
     }
    }
   }
  },
  [gameConstants]
 )

 const processBallPositions = useCallback(
  (newBalls: BallType[]) => {
   const boardHeight =
    (gameConstants.ROWS + 5) * gameConstants.PEG_VERTICAL_SPACING
   return {
    landedBalls: newBalls.filter((ball) => ball.y > boardHeight),
    activeBalls: newBalls.filter((ball) => ball.y <= boardHeight),
   }
  },
  [gameConstants]
 )

 const handleLandedBalls = useCallback(
  (landedBalls: BallType[]) => {
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

    updateAnimatingSlots(slotIndex, animationType)

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

   // Batch state updates
   setTimeout(() => {
    setGameState((prev) => ({
     ...prev,
     totalPrize: prev.totalPrize + newPrize,
    }))
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
  },
  [boardWidth, prizeValues, updateAnimatingSlots]
 )

 const handleGameEnd = useCallback(() => {
  setGameState((prev) => ({
   ...prev,
   isDropping: false,
   gameEndedWithPrize: prev.totalPrize,
  }))
 }, [])

 // --- Optimized Main Physics & Animation Loop ---
 const gameLoop = useCallback(() => {
  setBalls((prevBalls) => {
   const newBalls = prevBalls.map((ball) => ({ ...ball }))

   // Apply physics in sequence
   updateBallPhysics(newBalls)
   handlePegCollisions(newBalls)
   handleBallCollisions(newBalls)

   const { landedBalls, activeBalls } = processBallPositions(newBalls)

   if (landedBalls.length > 0) {
    handleLandedBalls(landedBalls)
   }

   if (activeBalls.length === 0 && prevBalls.length > 0) {
    handleGameEnd()
   }

   return activeBalls
  })

  if (gameState.isDropping) {
   animationFrameRef.current = requestAnimationFrame(gameLoop)
  }
 }, [
  gameState.isDropping,
  updateBallPhysics,
  handlePegCollisions,
  handleBallCollisions,
  processBallPositions,
  handleLandedBalls,
  handleGameEnd,
 ])

 useEffect(() => {
  if (gameState.isDropping) {
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
 }, [gameState.isDropping, gameLoop])

 // Cleanup timeouts on unmount
 useEffect(() => {
  return () => {
   timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
   timeoutRefs.current.clear()
  }
 }, [])

 const handleDropBall = useCallback(() => {
  if (!gameValidation.canStartGame) return

  const totalBalls = ballCounts.regular + ballCounts.gold
  const newGravity =
   totalBalls <= 10 ? gameConstants.LOW_GRAVITY : gameConstants.HIGH_GRAVITY

  // Reset game state
  setBalls([])
  setPrizeCounts({})
  setGameState((prev) => ({
   ...prev,
   isDropping: true,
   totalPrize: 0,
   aiAnalysis: '',
   currentGravity: newGravity,
  }))

  const ballsToDrop: { isGold: boolean }[] = []
  for (let i = 0; i < ballCounts.gold; i++) {
   ballsToDrop.push({ isGold: true })
  }
  for (let i = 0; i < ballCounts.regular; i++) {
   ballsToDrop.push({ isGold: false })
  }

  // Shuffle balls
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

    const startY = gameConstants.PEG_VERTICAL_SPACING * 0.5 // All balls start from same height above first row

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
 }, [gameValidation.canStartGame, ballCounts, gameConstants, pegs])

 // Memoized ball count handlers
 const handleRegularBallCountChange = useCallback((count: number) => {
  setBallCounts((prev) => ({ ...prev, regular: count }))
 }, [])

 const handleGoldBallCountChange = useCallback((count: number) => {
  setBallCounts((prev) => ({ ...prev, gold: count }))
 }, [])

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
     <Text style={styles.title}>Plinktrix</Text>
     <Text style={styles.subtitle}>
      Risk calculation subroutine initiated...
     </Text>
    </View>

    <View style={[styles.board, boardDimensions]}>
     <PegGrid pegs={pegs} />
     <BallLayer balls={balls} />
     <PrizeSlotLayer
      prizeValues={prizeValues}
      animatingSlots={animatingSlots}
     />

     {/* Debug Overlay */}
     {isDebugMode && (
      <DebugOverlay
       boardWidth={boardWidth}
       boardHeight={boardDimensions.height}
       gameConstants={gameConstants}
      />
     )}

     <Overlay
      isDropping={gameState.isDropping}
      regularBallCount={ballCounts.regular}
      setRegularBallCount={handleRegularBallCountChange}
      goldBallCount={ballCounts.gold}
      setGoldBallCount={handleGoldBallCountChange}
      handleDropBall={handleDropBall}
      ballsCount={balls.length}
      totalPrize={gameState.totalPrize}
      prizeCounts={prizeCounts}
      isAnalyzing={gameState.isAnalyzing}
      aiAnalysis={gameState.aiAnalysis}
      maxRegularBalls={maxRegularBalls}
      maxGoldBalls={maxGoldBalls}
      hasInsufficientBalls={gameValidation.hasInsufficientBalls}
      hasTooManyBalls={gameValidation.hasTooManyBalls}
      maxTotalBalls={gameConstants.MAX_TOTAL_BALLS}
      isLoadingStats={loadingState.isLoadingStats}
      isUpdatingStats={loadingState.isUpdatingStats}
      userLoggedIn={!!user?.id}
      isDebugMode={isDebugMode}
      setIsDebugMode={setIsDebugMode}
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
 screen: { flex: 1 },
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
 loadingText: {
  fontFamily: FONT_FAMILY,
  color: MatrixColors.matrixGreen,
  fontSize: 24,
 },
 header: { alignItems: 'center', marginTop: 10 },
 title: {
  fontFamily: FONT_FAMILY,
  fontSize: 64,
  color: MatrixColors.matrixGreen,
  textShadowColor: MatrixColors.matrixGreenShadow,
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
  backgroundColor: MatrixColors.matrixDarkBG,
  borderWidth: 2,
  borderColor: MatrixColors.matrixGreen,
  borderRadius: 8,
 },
 peg: {
  width: 8,
  height: 8,
  backgroundColor: MatrixColors.matrixGreen,
  borderRadius: 4,
  shadowColor: MatrixColors.matrixGreen,
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
  borderTopColor: MatrixColors.matrixGreen,
 },
 prizeSlotText: {
  fontFamily: FONT_FAMILY,
  color: MatrixColors.matrixGreen,
  fontSize: 14,
  fontWeight: 'bold',
 },
 ball: { position: 'absolute', width: 20, height: 20, borderRadius: 10 },
 regularBall: {
  backgroundColor: MatrixColors.matrixBlue,
  borderColor: MatrixColors.matrixCyan,
  borderWidth: 2,
 },
 goldBall: {
  backgroundColor: MatrixColors.matrixGold,
  borderColor: MatrixColors.matrixGold,
  borderWidth: 2,
 },
 footer: {
  fontFamily: FONT_FAMILY,
  color: '#666',
  fontSize: 12,
  marginBottom: 5,
 },
})

export default Plinko
