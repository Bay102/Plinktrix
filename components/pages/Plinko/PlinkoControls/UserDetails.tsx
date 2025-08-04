import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/PaperBase/Text'
import { FONT_FAMILY } from '@/constants/Fonts'
import { MatrixColors } from '@/constants/Theme'

interface UserDetailsProps {
 maxRegularBalls: number
 maxGoldBalls: number
 currentScore: number
}

export default function UserDetails({
 maxRegularBalls,
 maxGoldBalls,
 currentScore,
}: UserDetailsProps) {
 return (
  <View style={styles.container}>
   <View style={styles.statItem}>
    <Text style={styles.statLabel}>Data Packets:</Text>
    <Text style={styles.statValue}>{maxRegularBalls}</Text>
   </View>

   <View style={styles.statItem}>
    <Text style={styles.statLabel}>Bonus Packets:</Text>
    <Text style={[styles.statValue, styles.goldText]}>{maxGoldBalls}</Text>
   </View>

   <View style={styles.statItem}>
    <Text style={styles.statLabel}>Current Score:</Text>
    <Text
     style={[
      styles.statValue,
      currentScore >= 0 ? styles.positiveScore : styles.negativeScore,
     ]}
    >
     {currentScore >= 0 ? '+' : ''}
     {currentScore.toFixed(1)}
    </Text>
   </View>
  </View>
 )
}

const styles = StyleSheet.create({
 container: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
 },
 statItem: {
  alignItems: 'center',
  flex: 1,
 },
 statLabel: {
  fontSize: 18,
  fontFamily: FONT_FAMILY,
  color: MatrixColors.white,
  marginBottom: 2,
 },
 statValue: {
  fontSize: 22,
  fontFamily: FONT_FAMILY,
  color: MatrixColors.matrixGreen,
  fontWeight: 'bold',
 },
 goldText: {
  color: MatrixColors.matrixGold,
 },
 positiveScore: {
  color: MatrixColors.matrixGreen,
 },
 negativeScore: {
  color: MatrixColors.matrixRed,
 },
})
