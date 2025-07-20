import React from 'react'

import {
 Platform,
 StyleSheet,
 Text,
 TouchableOpacity,
 View,
} from 'react-native'

import Slider from '@react-native-community/slider'

import { MatrixColors } from '@/constants/Colors'
import { FONT_FAMILY } from '@/constants/Fonts'

// import { Text } from 'react-native-paper'

// --- Type Definitions ---
interface PrizeCount {
 regular: number
 gold: number
}

type PrizeCounts = {
 [key: string]: PrizeCount
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

const PlinkoControls: React.FC<PlinkoControlsProps> = ({
 isDropping,
 regularBallCount,
 setRegularBallCount,
 goldBallCount,
 setGoldBallCount,
 handleDropBall,
 ballsCount,
 totalPrize,
 prizeCounts,
 isAnalyzing,
 aiAnalysis,
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
 //  if (isDropping) return null

 // Calculate dynamic maximum values for sliders based on 100-ball limit
 const remainingBalls = maxTotalBalls - (regularBallCount + goldBallCount)
 const maxRegularForSlider = userLoggedIn
  ? Math.min(maxRegularBalls, regularBallCount + remainingBalls)
  : Math.min(40, regularBallCount + remainingBalls)
 const maxGoldForSlider = userLoggedIn
  ? Math.min(maxGoldBalls, goldBallCount + remainingBalls)
  : Math.min(10, goldBallCount + remainingBalls)

 return (
  <>
   <View style={styles.gameOverlay}>
    <View style={styles.overlayControls}>
     <View style={styles.sliders}>
      <View style={styles.sliderContainer}>
       <Text style={styles.labelText}>
        Data Packets:{' '}
        <Text style={{ color: MatrixColors.matrixGreen }}>
         {regularBallCount}
        </Text>
        {userLoggedIn && (
         <Text style={{ color: MatrixColors.matrixGray, fontSize: 14 }}>
          {' '}
          (Available: {maxRegularBalls})
         </Text>
        )}
       </Text>
       <Slider
        style={{ width: 120, height: 40, marginBottom: 10 }}
        minimumValue={1}
        maximumValue={Math.max(1, maxRegularForSlider)}
        step={1}
        value={regularBallCount}
        onValueChange={setRegularBallCount}
        disabled={isDropping || isLoadingStats || !userLoggedIn}
        minimumTrackTintColor={MatrixColors.matrixGreen}
        maximumTrackTintColor={MatrixColors.matrixDarkGreen}
        thumbTintColor={
         Platform.OS === 'ios' ? undefined : MatrixColors.matrixGreen
        }
       />
      </View>
      {maxGoldBalls !== 0 && (
       <View style={styles.sliderContainer}>
        <Text style={styles.labelText}>
         Bonus Packets:{' '}
         <Text style={{ color: MatrixColors.matrixGold }}>{goldBallCount}</Text>
         {userLoggedIn && (
          <Text style={{ color: '#AAA', fontSize: 14 }}>
           {' '}
           (Available: {maxGoldBalls})
          </Text>
         )}
        </Text>
        <Slider
         style={{ width: 120, height: 40, marginBottom: 10 }}
         minimumValue={0}
         maximumValue={Math.max(0, maxGoldForSlider)}
         step={1}
         value={goldBallCount}
         onValueChange={setGoldBallCount}
         disabled={isDropping || isLoadingStats || !userLoggedIn}
         minimumTrackTintColor={MatrixColors.matrixGold}
         maximumTrackTintColor={MatrixColors.matrixDarkGreen}
         thumbTintColor={
          Platform.OS === 'ios' ? undefined : MatrixColors.matrixGold
         }
        />
       </View>
      )}
      <TouchableOpacity
       onPress={handleDropBall}
       disabled={
        !userLoggedIn ||
        isDropping ||
        hasTooManyBalls ||
        (userLoggedIn &&
         (hasInsufficientBalls || isLoadingStats || isUpdatingStats))
       }
       style={[
        styles.button,
        !userLoggedIn && styles.disabledButton,
        (isDropping ||
         hasTooManyBalls ||
         (userLoggedIn &&
          (hasInsufficientBalls || isLoadingStats || isUpdatingStats))) &&
         styles.disabledButton,
       ]}
      >
       <Text style={styles.buttonText}>
        {isDropping
         ? `[${ballsCount}]`
         : isUpdatingStats
         ? 'Updating Stats...'
         : isLoadingStats
         ? 'Loading...'
         : `[ Drop ]`}
       </Text>
      </TouchableOpacity>
     </View>
     {/* Total balls counter */}
     {/* <View style={styles.totalBallsContainer}>
     <Text style={styles.totalBallsText}>
      Total Balls:{' '}
      <Text style={{ color: '#FFF' }}>{regularBallCount + goldBallCount}</Text>
      <Text style={{ color: '#AAA' }}> / {maxTotalBalls}</Text>
     </Text>
    </View> */}
     {!userLoggedIn && (
      <View style={styles.warningContainer}>
       <Text style={styles.warningText}>⚠️ Login required to play</Text>
      </View>
     )}
     {userLoggedIn && hasInsufficientBalls && (
      <View style={styles.warningContainer}>
       <Text style={styles.warningText}>⚠️ Insufficient data packets</Text>
      </View>
     )}
     {hasTooManyBalls && (
      <View style={styles.warningContainer}>
       <Text style={styles.warningText}>
        ⚠️ Maximum {maxTotalBalls} data packets allowed per drop
       </Text>
      </View>
     )}
     {userLoggedIn && isLoadingStats && (
      <View style={styles.warningContainer}>
       <Text style={styles.warningText}>Loading user data...</Text>
      </View>
     )}
    </View>
    {/* Debug Mode Toggle */}
   </View>
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
  backgroundColor: MatrixColors.matrixDarkBG,
  width: '100%',
 },
 overlayControls: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 5,
  backgroundColor: MatrixColors.matrixDarkBG,
 },
 sliders: {
  flexDirection: 'row',
  gap: 15,
  width: '35%',
 },
 sliderContainer: {
  // width: '40%',
 },
 labelText: {
  fontFamily: FONT_FAMILY,
  color: MatrixColors.matrixGreen,
  fontSize: 18,
  marginBottom: 4,
  textShadowColor: MatrixColors.matrixGreenShadow,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
 },
 button: {
  height: 50,
  width: 75,
  paddingVertical: 5,
  paddingHorizontal: 5,
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
  marginTop: 8,
  marginBottom: 8,
  padding: 8,
  backgroundColor: MatrixColors.matrixDarkBG,
  borderWidth: 1,
  borderColor: MatrixColors.matrixGold,
  borderRadius: 4,
  width: '100%',
 },
 warningText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: MatrixColors.matrixGold,
  textAlign: 'center',
 },
 totalBallsContainer: {
  marginTop: 8,
  marginBottom: 8,
  padding: 6,
  backgroundColor: MatrixColors.matrixDarkBG,
  borderWidth: 1,
  borderColor: MatrixColors.matrixGreen,
  borderRadius: 4,
  // width: '100%',
 },
 totalBallsText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: MatrixColors.matrixGreen,
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
