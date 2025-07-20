import React, { useEffect } from 'react'

import { StyleSheet, Text, View } from 'react-native'

import { MatrixColors } from '@/constants/Colors'
import { FONT_FAMILY } from '@/constants/Fonts'

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
 useEffect(() => {
  const timer = setTimeout(() => {
   onClose()
  }, 4000) // Close after 5 seconds

  return () => clearTimeout(timer) // Cleanup timer on unmount
 }, [onClose])

 return (
  <View style={styles.resultsContainer}>
   <Text style={styles.payoutText}>Bytes: {totalPrize.toLocaleString()}</Text>

   <View style={styles.analysisSection}>
    <Text style={styles.analysisTitle}>Data Stream:</Text>
    {Object.entries(prizeCounts)
     .sort(([valA], [valB]) => Number(valB) - Number(valA))
     .map(([value, { regular, gold }]) => (
      <React.Fragment key={value}>
       {regular > 0 && (
        <View style={styles.resultRow}>
         <Text style={styles.resultText}>
          <Text style={styles.resultText}>
           {Number(value).toLocaleString()}
          </Text>
         </Text>
         <Text style={styles.resultText}>x {regular}</Text>
        </View>
       )}
       {gold > 0 && (
        <View style={styles.resultRow}>
         <Text style={styles.resultText}>
          <Text style={{ color: MatrixColors.matrixGold }}>
           {Number(value).toLocaleString()} (x2)
          </Text>
         </Text>
         <Text style={styles.resultText}>x {gold}</Text>
        </View>
       )}
      </React.Fragment>
     ))}
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
 )
}

export default Results

const styles = StyleSheet.create({
 resultsContainer: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [{ translateX: -150 }, { translateY: -150 }], // Half of width and height for perfect centering
  width: 300,
  height: 300,
  padding: 12,
  backgroundColor: MatrixColors.black,
  borderWidth: 2,
  borderColor: MatrixColors.matrixGreen,
  borderRadius: 8,
  // shadowColor: MatrixColors.matrixGreen,
  // shadowOffset: { width: 0, height: 0 },
  // shadowOpacity: 0.8,
  shadowRadius: 15,
  elevation: 10,
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
})
