import React from 'react'

import {
 Platform,
 StyleSheet,
 Text,
 TouchableOpacity,
 View,
} from 'react-native'

import Slider from '@react-native-community/slider'

import { FONT_FAMILY } from '@/constants/Fonts'
import { MatrixColors } from '@/constants/Theme'

// --- Type Definitions ---
interface PrizeCount {
 regular: number
 gold: number
}

type PrizeCounts = {
 [key: string]: PrizeCount
}

interface SliderControlProps {
 label: string
 value: number
 maxValue: number
 availableCount: number
 color: string
 onValueChange: (value: number) => void
 disabled: boolean
 minimumValue?: number
}

interface PlinkoControlsProps {
 isDropping: boolean
 regularBallCount: number
 setRegularBallCount: (count: number) => void
 goldBallCount: number
 setGoldBallCount: (count: number) => void
 handleDropBall: () => void
 ballsCount: number
 totalPrize: number
 prizeCounts: PrizeCounts
 isAnalyzing: boolean
 aiAnalysis: string
 maxRegularBalls: number
 maxGoldBalls: number
 hasInsufficientBalls: boolean
 hasTooManyBalls: boolean
 maxTotalBalls: number
 isLoadingStats: boolean
 isUpdatingStats: boolean
 userLoggedIn: boolean
 isDebugMode: boolean
 setIsDebugMode: (isDebugMode: boolean) => void
}

// --- Helper Components ---
const SliderControl: React.FC<SliderControlProps> = ({
 label,
 value,
 maxValue,
 availableCount,
 color,
 onValueChange,
 disabled,
 minimumValue = 0,
}) => (
 <View style={styles.sliderContainer}>
  <Text style={styles.labelText}>
   {label}: <Text style={{ color }}>{value}</Text>
   <Text style={styles.availableText}> Available: {availableCount}</Text>
  </Text>
  <Slider
   style={styles.slider}
   minimumValue={minimumValue}
   maximumValue={Math.max(minimumValue, maxValue)}
   step={1}
   value={value}
   onValueChange={onValueChange}
   disabled={disabled}
   minimumTrackTintColor={color}
   maximumTrackTintColor={MatrixColors.matrixDarkGreen}
   thumbTintColor={Platform.OS === 'ios' ? undefined : color}
  />
 </View>
)

const PlinkoControls: React.FC<PlinkoControlsProps> = ({
 isDropping,
 regularBallCount,
 setRegularBallCount,
 goldBallCount,
 setGoldBallCount,
 handleDropBall,
 ballsCount,
 maxRegularBalls,
 maxGoldBalls,
 hasInsufficientBalls,
 hasTooManyBalls,
 maxTotalBalls,
 isLoadingStats,
 isUpdatingStats,
 userLoggedIn,
 isDebugMode,
 setIsDebugMode,
}) => {
 // Early return if dropping
 if (isDropping) return <View style={{ height: 90 }} />

 // --- Helper Functions ---
 const getWarningMessage = (): string | null => {
  if (!userLoggedIn) return '⚠️ Login required to play'
  if (hasInsufficientBalls) return '⚠️ Insufficient data packets'
  if (hasTooManyBalls) return '⚠️ Maximum data packets allowed per drop'
  if (isLoadingStats) return 'Loading user data...'
  return null
 }

 const getButtonText = (): string => {
  if (isDropping) return `[${ballsCount}]`
  if (isUpdatingStats) return 'Updating Stats...'
  if (isLoadingStats) return 'Loading...'
  return '[ Drop ]'
 }

 const isControlsDisabled = (): boolean => {
  return isDropping || isLoadingStats || !userLoggedIn
 }

 const isButtonDisabled = (): boolean => {
  return (
   !userLoggedIn ||
   isDropping ||
   hasTooManyBalls ||
   hasInsufficientBalls ||
   isLoadingStats ||
   isUpdatingStats
  )
 }

 const calculateMaxSliderValues = () => {
  const remainingBalls = maxTotalBalls - (regularBallCount + goldBallCount)
  const maxRegularForSlider = userLoggedIn
   ? Math.min(maxRegularBalls, regularBallCount + remainingBalls)
   : Math.min(40, regularBallCount + remainingBalls)
  const maxGoldForSlider = userLoggedIn
   ? Math.min(maxGoldBalls, goldBallCount + remainingBalls)
   : Math.min(10, goldBallCount + remainingBalls)

  return { maxRegularForSlider, maxGoldForSlider }
 }

 const warningMessage = getWarningMessage()
 const { maxRegularForSlider, maxGoldForSlider } = calculateMaxSliderValues()
 const controlsDisabled = isControlsDisabled()

 return (
  <>
   <View style={styles.gameOverlay}>
    {warningMessage ? (
     <View style={styles.warningContainer}>
      <Text style={styles.warningText}>{warningMessage}</Text>
     </View>
    ) : (
     <View style={styles.overlayControls}>
      <View style={styles.sliders}>
       <SliderControl
        label="Data Packets"
        value={regularBallCount}
        maxValue={maxRegularForSlider}
        availableCount={maxRegularBalls}
        color={MatrixColors.matrixGreen}
        onValueChange={setRegularBallCount}
        disabled={controlsDisabled}
        minimumValue={0}
       />

       {maxGoldBalls > 0 && (
        <SliderControl
         label="Bonus Packets"
         value={goldBallCount}
         maxValue={maxGoldForSlider}
         availableCount={maxGoldBalls}
         color={MatrixColors.matrixGold}
         onValueChange={setGoldBallCount}
         disabled={controlsDisabled}
        />
       )}
      </View>

      <TouchableOpacity
       onPress={handleDropBall}
       disabled={isButtonDisabled()}
       style={[styles.button, isButtonDisabled() && styles.disabledButton]}
      >
       <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>
     </View>
    )}
   </View>

   {/* Debug Mode Toggle */}
   {__DEV__ && (
    <TouchableOpacity
     onPress={() => setIsDebugMode(!isDebugMode)}
     style={[styles.debugToggle, isDebugMode && styles.debugToggleActive]}
    >
     <Text
      style={[
       styles.debugToggleText,
       isDebugMode && styles.debugToggleTextActive,
      ]}
     >
      Anti: {isDebugMode ? 'ON' : 'OFF'}
     </Text>
    </TouchableOpacity>
   )}
  </>
 )
}

export default PlinkoControls

const styles = StyleSheet.create({
 gameOverlay: {
  width: '100%',
 },
 overlayControls: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  paddingVertical: 10,
  paddingHorizontal: 5,
 },
 sliders: {
  flexDirection: 'row',
  gap: 15,
  width: '35%',
 },
 sliderContainer: {},
 slider: {
  width: 120,
  height: 40,
  marginBottom: 10,
 },
 labelText: {
  fontFamily: FONT_FAMILY,
  color: MatrixColors.matrixGreen,
  fontSize: 20,
  marginBottom: 4,
  textShadowColor: MatrixColors.matrixGreenShadow,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
 },
 availableText: {
  color: MatrixColors.matrixGray,
  fontSize: 18,
 },
 button: {
  height: 50,
  width: 75,
  paddingVertical: 5,
  paddingHorizontal: 5,
  marginRight: 15,
  backgroundColor: MatrixColors.matrixGreen,
  borderWidth: 2,
  borderColor: MatrixColors.matrixGreen,
  shadowColor: MatrixColors.matrixGreen,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 10,
  elevation: 8,
  borderRadius: 4,
  justifyContent: 'center',
  alignSelf: 'center',
 },
 disabledButton: {
  backgroundColor: '#555',
  borderColor: '#777',
  shadowOpacity: 0,
  elevation: 0,
 },
 buttonText: {
  textAlign: 'center',
  color: '#000',
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  fontWeight: 'bold',
 },
 warningContainer: {
  marginBottom: 10,
  justifyContent: 'center',
  height: 120,
  backgroundColor: MatrixColors.matrixDarkBG,
 },
 warningText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: MatrixColors.matrixGold,
  textAlign: 'center',
 },
 debugToggle: {
  position: 'absolute',
  top: -40,
  left: 10,
  marginTop: 8,
  marginBottom: 8,
  padding: 6,
  backgroundColor: MatrixColors.matrixDarkBG,
  borderWidth: 1,
  borderColor: MatrixColors.matrixRed,
  borderRadius: 4,
  width: 100,
 },
 debugToggleActive: {
  backgroundColor: MatrixColors.matrixDarkBG,
  borderColor: MatrixColors.matrixRed,
 },
 debugToggleText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: MatrixColors.matrixRed,
  textAlign: 'center',
 },
 debugToggleTextActive: {
  color: MatrixColors.matrixRed,
  textShadowColor: MatrixColors.matrixRed,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
 },
})
