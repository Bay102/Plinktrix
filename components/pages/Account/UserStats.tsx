import MatrixButton from '@/components/ui/MatrixButton'
import {
 formatAccountLevel,
 formatDate,
 MatrixContainer,
 StatItem,
} from '@/components/ui/MatrixContainer'
import { DynamicBGColor, MatrixColors } from '@/constants/Colors'
import { useAuthProvider } from '@/providers'
import React from 'react'
import {
 Platform,
 ScrollView,
 StyleSheet,
 useColorScheme,
 View,
} from 'react-native'
import { Text } from 'react-native-paper'
import DigitalRain from '../Plinko/DigitalRain'

const FONT_FAMILY = Platform.OS === 'ios' ? 'VT323' : 'VT323'

export const UserStats = () => {
 const { userData } = useAuthProvider()

 const username = userData?.username
 const score = userData?.bytes_downloaded
 const accountLevel = userData?.account_level
 const bonusPackets = userData?.bonus_packets
 const regularPackets = userData?.regular_packets
 const createdAt = userData?.created_at

 const colorScheme = useColorScheme()

 return (
  <ScrollView
   style={[styles.container, { backgroundColor: DynamicBGColor(colorScheme) }]}
  >
   <DigitalRain />
   {/* Header */}
   <View style={styles.header}>
    <Text style={styles.headerTitle}>PLAYER DATA</Text>
    <Text style={styles.headerSubtitle}>System data retrieval complete...</Text>
   </View>
   {/* User Identity Section */}
   <MatrixContainer title="USER IDENTITY">
    <StatItem
     label="USERNAME"
     value={username || 'UNKNOWN'}
     color={MatrixColors.matrixCyan}
     isHighlight={true}
    />
    <StatItem
     label="ACCOUNT_LEVEL"
     value={formatAccountLevel(accountLevel)}
     color={MatrixColors.matrixGreen}
    />
    <StatItem
     label="CREATED_AT"
     value={createdAt ? formatDate(createdAt) : 'N/A'}
     color={MatrixColors.matrixGreen}
    />
   </MatrixContainer>
   {/* Performance Metrics Section */}
   <MatrixContainer title="PERFORMANCE METRICS">
    <StatItem
     label="AWAITING_UPLOAD"
     value={score?.toLocaleString() || '0'}
     color={MatrixColors.matrixGreen}
     isHighlight={true}
    />
    <MatrixButton title="[ Upload Hack ]" onPress={() => {}} />
   </MatrixContainer>
   {/* Resource Allocation Section */}
   <MatrixContainer title="RESOURCE ALLOCATION">
    <StatItem
     label="REGULAR_PACKETS"
     value={regularPackets || 0}
     color={MatrixColors.matrixBlue}
    />
    <StatItem
     label="BONUS_PACKETS"
     value={bonusPackets || 0}
     color={MatrixColors.matrixGold}
    />
    <StatItem
     label="TOTAL_PACKETS"
     value={(regularPackets || 0) + (bonusPackets || 0)}
     color={MatrixColors.matrixGreen}
    />
   </MatrixContainer>
   {/* Footer */}
   <View style={styles.footer}>
    <Text style={styles.footerText}>
     Data integrity verified • System status: OPERATIONAL
    </Text>
   </View>
  </ScrollView>
 )
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  padding: 20,
  backgroundColor: MatrixColors.matrixDarkBG,
 },
 header: {
  alignItems: 'center',
  marginBottom: 30,
  paddingBottom: 20,
  borderBottomWidth: 2,
  borderBottomColor: MatrixColors.matrixGreen,
 },
 headerTitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 32,
  color: MatrixColors.matrixGreen,
  textShadowColor: MatrixColors.matrixGreenShadow,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
  marginBottom: 8,
 },
 headerSubtitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 14,
  color: MatrixColors.matrixGray,
 },
 footer: {
  marginTop: 20,
  paddingTop: 20,
  borderTopWidth: 1,
  borderTopColor: MatrixColors.matrixDarkGreen,
  alignItems: 'center',
 },
 footerText: {
  fontFamily: FONT_FAMILY,
  fontSize: 12,
  color: MatrixColors.matrixDarkGray,
  textAlign: 'center',
 },
 refreshButton: {
  marginTop: 10,
  padding: 8,
  borderWidth: 1,
  borderColor: MatrixColors.matrixGreen,
  borderRadius: 4,
  backgroundColor: MatrixColors.matrixGreenBG,
 },
 refreshText: {
  fontFamily: FONT_FAMILY,
  fontSize: 12,
  color: MatrixColors.matrixGreen,
  textAlign: 'center',
 },
 refreshingText: {
  color: MatrixColors.matrixGray,
 },
})
