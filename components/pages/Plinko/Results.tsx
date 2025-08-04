import React, { useEffect, useRef } from 'react'

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { FONT_FAMILY } from '@/constants/Fonts'
import { MatrixColors } from '@/constants/Theme'

import { PrizeCounts } from './types'

const Results = ({
 totalPrize,
 prizeCounts,
 onClose,
}: {
 totalPrize: number
 prizeCounts: PrizeCounts
 onClose: () => void
}) => {
 const timerRef = useRef<number | null>(null)

 useEffect(() => {
  timerRef.current = setTimeout(() => {
   onClose()
  }, 10000)

  return () => {
   if (timerRef.current) {
    clearTimeout(timerRef.current)
   }
  }
 }, [onClose])

 const handleManualClose = () => {
  if (timerRef.current) {
   clearTimeout(timerRef.current)
   timerRef.current = null
  }
  onClose()
 }

 return (
  <>
   {/* Backdrop */}
   <View style={styles.backdrop} />

   {/* Modal Content */}
   <View style={styles.resultsContainer}>
    {/* Close Button */}
    <TouchableOpacity style={styles.closeButton} onPress={handleManualClose}>
     <Text style={styles.closeButtonText}>✕</Text>
    </TouchableOpacity>

    <Text
     style={[
      styles.payoutText,
      totalPrize < 0 ? styles.lossText : styles.winText,
     ]}
    >
     {totalPrize >= 0 ? '+' : ''}
     {totalPrize.toFixed(1)} Bytes
    </Text>
    {totalPrize < 0 && (
     <Text style={styles.lossSubtext}>SYSTEM BREACH DETECTED</Text>
    )}

    <View style={styles.analysisSection}>
     <Text style={styles.analysisTitle}>Score Breakdown:</Text>
     {Object.entries(prizeCounts)
      .sort(([valA], [valB]) => Number(valB) - Number(valA))
      .map(([multiplierStr, { regular, gold }]) => {
       const multiplier = Number(multiplierStr)
       const isLoss = multiplier === 0.4
       const totalBalls = regular + gold

       if (totalBalls === 0) return null

       // Calculate total points for this multiplier
       const regularPoints = regular * 1 * multiplier
       const goldPoints = gold * 5 * multiplier
       const totalPoints = regularPoints + goldPoints

       return (
        <View
         key={multiplierStr}
         style={[styles.resultRow, isLoss && styles.lossRow]}
        >
         <View style={styles.ballInfoContainer}>
          <Text style={[styles.multiplierText, isLoss && styles.lossText]}>
           x{multiplier} {isLoss ? '⚠️ LOSS' : 'Multiplier'}
          </Text>
          <Text style={styles.ballCountText}>
           {regular > 0 && `${regular} Regular`}
           {regular > 0 && gold > 0 && ' + '}
           {gold > 0 && (
            <Text style={{ color: MatrixColors.matrixGold }}>{gold} Bonus</Text>
           )}
          </Text>
         </View>
         <Text
          style={[styles.pointsText, isLoss ? styles.lossText : styles.winText]}
         >
          {isLoss ? '-' : '+'}
          {Math.abs(totalPoints).toFixed(1)}
         </Text>
        </View>
       )
      })}
    </View>

    {/* <View style={styles.analysisSection}>
        <Text style={styles.analysisTitle}>✨ System Commentary:</Text>
        {isAnalyzing && (
         <Text style={styles.aiText}> Analyzing data stream...</Text>
        )}
        {aiAnalysis && (
         <Text style={[styles.aiText, { fontStyle: 'italic' }]}>
          &quot;{aiAnalysis}&quot;
         </Text>
        )}
       </View> */}
   </View>
  </>
 )
}

export default Results

const styles = StyleSheet.create({
 backdrop: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.90)',
  zIndex: 999,
 },
 resultsContainer: {
  position: 'absolute',
  bottom: 60,
  left: 0,
  right: 0,
  alignSelf: 'center',
  width: '98%',
  padding: 12,
  backgroundColor: MatrixColors.black,
  borderWidth: 2,
  borderColor: MatrixColors.matrixGreen,
  borderRadius: 8,
  zIndex: 1000, // Ensure modal is above backdrop
  // shadowColor: MatrixColors.matrixGreen,
  // shadowOffset: { width: 0, height: 0 },
  // shadowOpacity: 0.8,
 },
 payoutText: {
  fontFamily: FONT_FAMILY,
  fontSize: 24,
  color: '#FFF',
  textAlign: 'center',
  fontWeight: 'bold',
 },
 lossSubtext: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: MatrixColors.matrixRed,
  textAlign: 'center',
  marginTop: 2,
  fontStyle: 'italic',
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
  alignItems: 'center',
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginVertical: 2,
  backgroundColor: 'rgba(0, 20, 0, 0.3)',
  borderRadius: 4,
 },
 lossRow: {
  backgroundColor: 'rgba(40, 0, 0, 0.4)',
  borderWidth: 1,
  borderColor: 'rgba(255, 0, 0, 0.3)',
 },
 ballInfoContainer: {
  flex: 1,
 },
 multiplierText: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: '#FFF',
  fontWeight: 'bold',
 },
 ballCountText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: '#AAA',
  marginTop: 2,
 },
 ballTypeText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: '#CCC',
  flex: 1,
 },
 calculationText: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: '#888',
  flex: 1,
  textAlign: 'center',
 },
 pointsText: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  fontWeight: 'bold',
  flex: 1,
  textAlign: 'right',
 },
 winText: {
  color: MatrixColors.matrixGreen,
  textShadowColor: MatrixColors.matrixGreenShadow,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 3,
 },
 lossText: {
  color: MatrixColors.matrixRed,
  textShadowColor: MatrixColors.matrixRed,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 3,
 },
 resultText: {
  fontFamily: FONT_FAMILY,
  fontSize: 20,
  color: '#CCC',
 },
 aiText: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: '#FFF',
 },
 closeButton: {
  position: 'absolute',
  top: 8,
  right: 8,
  width: 40,
  height: 22,
  borderRadius: 2,
  borderWidth: 1,
  borderColor: MatrixColors.matrixRed,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1001,
 },
 closeButtonText: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: MatrixColors.matrixRed,
  fontWeight: 'bold',
  textAlign: 'center',
 },
})
