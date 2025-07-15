import { MatrixColors } from '@/constants/Colors'
import { FONT_FAMILY } from '@/constants/Fonts'
import Slider from '@react-native-community/slider'
import React from 'react'
import {
 Platform,
 StyleSheet,
 Text,
 TouchableOpacity,
 View,
} from 'react-native'
// import { Text } from 'react-native-paper'

// --- Type Definitions ---
interface PrizeCount {
 regular: number
 gold: number
}

type PrizeCounts = {
 [key: string]: PrizeCount
}

interface OverlayProps {
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

const Overlay: React.FC<OverlayProps> = ({
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
 if (isDropping) return null

 // Calculate dynamic maximum values for sliders based on 100-ball limit
 const remainingBalls = maxTotalBalls - (regularBallCount + goldBallCount)
 const maxRegularForSlider = userLoggedIn
  ? Math.min(maxRegularBalls, regularBallCount + remainingBalls)
  : Math.min(40, regularBallCount + remainingBalls)
 const maxGoldForSlider = userLoggedIn
  ? Math.min(maxGoldBalls, goldBallCount + remainingBalls)
  : Math.min(10, goldBallCount + remainingBalls)

 return (
  <View style={styles.gameOverlay}>
   <View style={styles.overlayControls}>
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
      style={{ width: '100%', height: 40 }}
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
       style={{ width: '100%', height: 40 }}
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

    {/* Total balls counter */}
    <View style={styles.totalBallsContainer}>
     <Text style={styles.totalBallsText}>
      Total Balls:{' '}
      <Text style={{ color: '#FFF' }}>{regularBallCount + goldBallCount}</Text>
      <Text style={{ color: '#AAA' }}> / {maxTotalBalls}</Text>
     </Text>
    </View>

    {!userLoggedIn && (
     <View style={styles.warningContainer}>
      <Text style={styles.warningText}>⚠️ Login required to save progress</Text>
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

    <TouchableOpacity
     onPress={handleDropBall}
     disabled={
      isDropping ||
      hasTooManyBalls ||
      (userLoggedIn &&
       (hasInsufficientBalls || isLoadingStats || isUpdatingStats))
     }
     style={[
      styles.button,
      (isDropping ||
       hasTooManyBalls ||
       (userLoggedIn &&
        (hasInsufficientBalls || isLoadingStats || isUpdatingStats))) &&
       styles.disabledButton,
     ]}
    >
     <Text style={styles.buttonText}>
      {isDropping
       ? `Executing... [${ballsCount}]`
       : isUpdatingStats
       ? 'Updating Stats...'
       : isLoadingStats
       ? 'Loading...'
       : `[ Initiate Hack ]`}
     </Text>
    </TouchableOpacity>

    {/* Results Section */}
    {(totalPrize > 0 || Object.keys(prizeCounts).length > 0) && (
     <View style={styles.resultsContainer}>
      <Text style={styles.payoutText}>
       Bytes: {totalPrize.toLocaleString()}
      </Text>

      <View style={styles.analysisSection}>
       <Text style={styles.analysisTitle}>Data Stream:</Text>
       {Object.entries(prizeCounts)
        .sort(([valA], [valB]) => Number(valB) - Number(valA))
        .map(([value, { regular, gold }]) => (
         <React.Fragment key={value}>
          {regular > 0 && (
           <View style={styles.resultRow}>
            <Text style={styles.resultText}>
             <Text style={{ color: '#FFF' }}>
              {Number(value).toLocaleString()}
             </Text>
            </Text>
            <Text style={styles.resultText}>x {regular}</Text>
           </View>
          )}
          {gold > 0 && (
           <View style={styles.resultRow}>
            <Text style={styles.resultText}>
             <Text style={{ color: '#FFD700' }}>
              {Number(value).toLocaleString()} (x2)
             </Text>
            </Text>
            <Text style={styles.resultText}>x {gold}</Text>
           </View>
          )}
         </React.Fragment>
        ))}
      </View>

      <View style={styles.analysisSection}>
       <Text style={styles.analysisTitle}>✨ System Commentary:</Text>
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
       DEBUG: {isDebugMode ? 'ON' : 'OFF'}
      </Text>
     </TouchableOpacity>
    )}
   </View>
  </View>
 )
}

export default Overlay

const styles = StyleSheet.create({
 gameOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: MatrixColors.matrixDarkBG,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
 },
 overlayControls: {
  width: '90%',
  maxWidth: 350,
  alignItems: 'center',
  padding: 20,
  backgroundColor: MatrixColors.matrixDarkBG,
  borderWidth: 2,
  borderColor: MatrixColors.matrixGreen,
  borderRadius: 8,
 },
 sliderContainer: { width: '100%', marginBottom: 10 },
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
  paddingVertical: 12,
  paddingHorizontal: 24,
  backgroundColor: MatrixColors.matrixGreen,
  borderWidth: 2,
  borderColor: MatrixColors.matrixGreen,
  shadowColor: MatrixColors.matrixGreen,
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
  backgroundColor: MatrixColors.matrixDarkBG,
  borderWidth: 1,
  borderColor: MatrixColors.matrixGreen,
  borderRadius: 8,
  width: '100%',
 },
 payoutText: {
  fontFamily: FONT_FAMILY,
  fontSize: 24,
  color: '#FFF',
  textAlign: 'center',
  textShadowColor: MatrixColors.matrixGreenShadow,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 8,
 },
 analysisSection: {
  marginTop: 8,
  paddingTop: 8,
  borderTopWidth: 1,
  borderTopColor: MatrixColors.matrixDarkGreen,
 },
 analysisTitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: MatrixColors.matrixGreen,
  marginBottom: 4,
  textShadowColor: MatrixColors.matrixGreenShadow,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
 },
 resultRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 4,
  fontSize: 18,
 },
 resultText: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: '#CCC',
 },
 aiText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: '#FFF',
 },
 warningContainer: {
  marginTop: 8,
  marginBottom: 8,
  padding: 8,
  backgroundColor: MatrixColors.matrixDarkBG,
  borderWidth: 1,
  borderColor: '#FFA500',
  borderRadius: 4,
  width: '100%',
 },
 warningText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: '#FFA500',
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
  width: '100%',
 },
 totalBallsText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: MatrixColors.matrixGreen,
  textAlign: 'center',
 },
 debugToggle: {
  marginTop: 8,
  marginBottom: 8,
  padding: 8,
  backgroundColor: MatrixColors.matrixDarkBG,
  borderWidth: 1,
  borderColor: MatrixColors.matrixRed,
  borderRadius: 4,
  width: '100%',
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
