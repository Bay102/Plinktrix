import React from 'react'

import { SafeAreaView, StyleSheet, useColorScheme } from 'react-native'

import {
 formatAccountLevel,
 formatDate,
 MatrixContainer,
 StatItem,
} from '@/components/shared/MatrixContainer'
import { createTheme, MatrixColors } from '@/constants/Colors'
import { FONT_FAMILY } from '@/constants/Fonts'
import { useAuthProvider } from '@/providers'

export const UserStats = () => {
 const { userData } = useAuthProvider()

 const username = userData?.username
 const score = userData?.bytes_downloaded
 const accountLevel = userData?.account_level
 const bonusPackets = userData?.bonus_packets
 const regularPackets = userData?.regular_packets
 const packetsDropped = userData?.packets_dropped
 const createdAt = userData?.created_at

 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)

 return (
  <SafeAreaView style={[styles.container, {}]}>
   <MatrixContainer title="PLAYER INFO">
    <StatItem
     label="Username"
     value={username ?? 'N/A'}
     color={MatrixColors.matrixCyan}
     isHighlight={true}
    />
    <StatItem
     label="Account Level"
     value={formatAccountLevel(accountLevel)}
     color={MatrixColors.matrixGreen}
    />
    <StatItem
     label="Member Since"
     value={createdAt ? formatDate(createdAt) : 'N/A'}
     color={MatrixColors.matrixGreen}
    />
   </MatrixContainer>

   <MatrixContainer title="SCORE">
    <StatItem
     label="Packets Dropped"
     value={packetsDropped ? packetsDropped.toString() : '0'}
     color={MatrixColors.matrixGray}
    />
    <StatItem
     label="Score"
     value={score ? `${score} bytes` : '0 bytes'}
     color={MatrixColors.matrixGreen}
    />
   </MatrixContainer>

   <MatrixContainer title="PACKETS">
    <StatItem
     label="Packets"
     value={regularPackets ? regularPackets.toString() : '0'}
     color={MatrixColors.matrixBlue}
    />
    <StatItem
     label="Bonus Packets"
     value={bonusPackets ? bonusPackets.toString() : '0'}
     color={MatrixColors.matrixGold}
    />
   </MatrixContainer>
  </SafeAreaView>
 )
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
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
