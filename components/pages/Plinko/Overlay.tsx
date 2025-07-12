import Slider from '@react-native-community/slider'
import React from 'react'
import {
 Platform,
 StyleSheet,
 Text,
 TouchableOpacity,
 View,
} from 'react-native'

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
 isLoadingStats: boolean
 isUpdatingStats: boolean
 userLoggedIn: boolean
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
 isLoadingStats,
 isUpdatingStats,
 userLoggedIn,
}) => {
 // Don't render overlay when dropping
 if (isDropping) return null

 return (
  <View style={styles.gameOverlay}>
   <View style={styles.overlayControls}>
    <View style={styles.sliderContainer}>
     <Text style={styles.labelText}>
      Regular Data Packets:{' '}
      <Text style={{ color: '#FFF' }}>{regularBallCount}</Text>
      {userLoggedIn && (
       <Text style={{ color: '#AAA', fontSize: 14 }}>
        {' '}
        (Available: {maxRegularBalls})
       </Text>
      )}
     </Text>
     <Slider
      style={{ width: '100%', height: 40 }}
      minimumValue={1}
      maximumValue={userLoggedIn ? Math.max(1, maxRegularBalls) : 40}
      step={1}
      value={regularBallCount}
      onValueChange={setRegularBallCount}
      disabled={isDropping || isLoadingStats || !userLoggedIn}
      minimumTrackTintColor="#0F0"
      maximumTrackTintColor="#050"
      thumbTintColor={Platform.OS === 'ios' ? undefined : '#0F0'}
     />
    </View>

    <View style={styles.sliderContainer}>
     <Text style={styles.labelText}>
      Gold Data Packets:{' '}
      <Text style={{ color: '#FFD700' }}>{goldBallCount}</Text>
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
      maximumValue={userLoggedIn ? maxGoldBalls : 10}
      step={1}
      value={goldBallCount}
      onValueChange={setGoldBallCount}
      disabled={isDropping || isLoadingStats || !userLoggedIn}
      minimumTrackTintColor="#FFD700"
      maximumTrackTintColor="#554200"
      thumbTintColor={Platform.OS === 'ios' ? undefined : '#FFD700'}
     />
    </View>

    {!userLoggedIn && (
     <View style={styles.warningContainer}>
      <Text style={styles.warningText}>⚠️ Login required to save progress</Text>
     </View>
    )}

    {userLoggedIn && hasInsufficientBalls && (
     <View style={styles.warningContainer}>
      <Text style={styles.warningText}>⚠️ Insufficient balls available</Text>
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
      (userLoggedIn &&
       (hasInsufficientBalls || isLoadingStats || isUpdatingStats))
     }
     style={[
      styles.button,
      (isDropping ||
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
       : `[ Initiate Drop ${regularBallCount + goldBallCount} ]`}
     </Text>
    </TouchableOpacity>

    {/* Results Section */}
    {(totalPrize > 0 || Object.keys(prizeCounts).length > 0) && (
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
  </View>
 )
}

export default Overlay

// --- Styles ---
const FONT_FAMILY = Platform.OS === 'ios' ? 'VT323' : 'VT323'

const styles = StyleSheet.create({
 gameOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
 },
 overlayControls: {
  width: '90%',
  maxWidth: 350,
  alignItems: 'center',
  padding: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  borderWidth: 2,
  borderColor: '#0F0',
  borderRadius: 8,
 },
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
 warningContainer: {
  marginTop: 8,
  marginBottom: 8,
  padding: 8,
  backgroundColor: 'rgba(255, 165, 0, 0.1)',
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
})
