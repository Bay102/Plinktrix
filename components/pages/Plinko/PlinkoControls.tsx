import React, { useMemo } from 'react'

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
 maxRegularBalls: number
 maxGoldBalls: number
 hasInsufficientBalls: boolean
 hasTooManyBalls: boolean
 hasNoBallsAvailable: boolean
 hasNoBallsSelected: boolean
 maxTotalBalls: number
 isLoadingStats: boolean
 isUpdatingStats: boolean
 userLoggedIn: boolean
 isDebugMode: boolean
 setIsDebugMode: (isDebugMode: boolean) => void
}

// --- Helper Components ---
const SliderControl: React.FC<SliderControlProps> = React.memo(
 ({
  label,
  value,
  maxValue,
  availableCount,
  color,
  onValueChange,
  disabled,
  minimumValue = 0,
 }) => {
  // Memoize the style object to prevent re-creation
  const valueStyle = useMemo(() => ({ color }), [color])
  const maximumValue = useMemo(
   () => Math.max(minimumValue, maxValue),
   [minimumValue, maxValue]
  )

  return (
   <View style={styles.sliderContainer}>
    <Text style={styles.labelText}>
     {label}: <Text style={valueStyle}>{value}</Text>
     <Text style={styles.availableText}> Available: {availableCount}</Text>
    </Text>
    <Slider
     style={styles.slider}
     minimumValue={minimumValue}
     maximumValue={maximumValue}
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
 }
)

SliderControl.displayName = 'SliderControl'

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
 hasNoBallsAvailable,
 hasNoBallsSelected,
 maxTotalBalls,
 isLoadingStats,
 isUpdatingStats,
 userLoggedIn,
 isDebugMode,
 setIsDebugMode,
}) => {
 // --- All Hooks Must Come First ---
 //  --- Memoized Helper Functions ---
 const warningMessage = useMemo((): string | null => {
  if (!userLoggedIn) return 'Login required'
  if (hasNoBallsAvailable) return 'Insufficient data packets'
  if (hasInsufficientBalls) return 'Insufficient data packets'
  if (hasTooManyBalls) return 'Maximum data packets allowed per drop'
  if (hasNoBallsSelected) return 'Select data packets'
  // if (isLoadingStats) return 'Loading user data...'
  return null
 }, [
  userLoggedIn,
  hasNoBallsAvailable,
  hasInsufficientBalls,
  hasTooManyBalls,
  hasNoBallsSelected,
 ])

 const buttonText = useMemo((): string => {
  if (isDropping) return `[${ballsCount}]`
  if (isUpdatingStats) return 'Updating Stats...'
  if (isLoadingStats) return 'Loading...'
  return '[ Drop ]'
 }, [isDropping, ballsCount, isUpdatingStats, isLoadingStats])

 const controlsDisabled = useMemo((): boolean => {
  return isDropping || isLoadingStats || !userLoggedIn || hasNoBallsAvailable
 }, [isDropping, isLoadingStats, userLoggedIn, hasNoBallsAvailable])

 const buttonDisabled = useMemo((): boolean => {
  return (
   !userLoggedIn ||
   isDropping ||
   hasTooManyBalls ||
   hasInsufficientBalls ||
   hasNoBallsAvailable ||
   hasNoBallsSelected ||
   isLoadingStats ||
   isUpdatingStats
  )
 }, [
  userLoggedIn,
  isDropping,
  hasTooManyBalls,
  hasInsufficientBalls,
  hasNoBallsAvailable,
  hasNoBallsSelected,
  isLoadingStats,
  isUpdatingStats,
 ])

 const sliderValues = useMemo(() => {
  const remainingBalls = maxTotalBalls - (regularBallCount + goldBallCount)
  const maxRegularForSlider = userLoggedIn
   ? Math.min(maxRegularBalls, regularBallCount + remainingBalls)
   : Math.min(40, regularBallCount + remainingBalls)
  const maxGoldForSlider = userLoggedIn
   ? Math.min(maxGoldBalls, goldBallCount + remainingBalls)
   : Math.min(10, goldBallCount + remainingBalls)

  return { maxRegularForSlider, maxGoldForSlider }
 }, [
  maxTotalBalls,
  regularBallCount,
  goldBallCount,
  userLoggedIn,
  maxRegularBalls,
  maxGoldBalls,
 ])

 const { maxRegularForSlider, maxGoldForSlider } = sliderValues

 // Early return after all hooks
 //  if (isDropping) return droppingView

 return (
  <>
   <View style={styles.gameOverlay}>
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

     {warningMessage ? (
      <View style={styles.warningContainer}>
       <Text style={styles.warningText}>⚠️</Text>
       <Text style={styles.warningText}>{warningMessage}</Text>
      </View>
     ) : (
      <TouchableOpacity
       onPress={handleDropBall}
       disabled={buttonDisabled}
       style={[styles.button, buttonDisabled && styles.disabledButton]}
      >
       <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
     )}
    </View>
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

// Custom comparison function to prevent unnecessary re-renders
PlinkoControls.displayName = 'PlinkoControls'

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
  paddingHorizontal: 10,
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
  shadowOpacity: 0.5,
  shadowRadius: 5,
  elevation: 5,
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
  alignSelf: 'center',
  backgroundColor: MatrixColors.matrixDarkBG,
  width: 125,
 },
 warningText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: MatrixColors.matrixGold,
  textAlign: 'center',
 },
 debugToggle: {
  position: 'absolute',
  top: -600,
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
