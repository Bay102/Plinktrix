import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

import { MatrixColors } from '@/constants/Colors'
import { FONT_FAMILY } from '@/constants/Fonts'

export const formatDate = (dateString: string) => {
 const date = new Date(dateString)
 return date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
 })
}

// Format account level
export const formatAccountLevel = (level: string | null | undefined) => {
 if (!level) return 'FREE'
 return level.toUpperCase()
}

export const StatItem: React.FC<{
 label: string
 value: string | number
 color?: string
 isHighlight?: boolean
}> = ({ label, value, color = '#0F0', isHighlight = false }) => (
 <View style={styles.statItem}>
  <Text style={[styles.statLabel, { color: isHighlight ? '#FFD700' : '#AAA' }]}>
   {label}
  </Text>
  <Text
   style={[
    styles.statValue,
    { color: isHighlight ? '#FFD700' : color },
    isHighlight && styles.highlightValue,
   ]}
  >
   {value}
  </Text>
 </View>
)

export const MatrixContainer = ({
 title,
 children,
}: {
 title: string
 children: React.ReactNode
}) => {
 return (
  <View style={styles.section}>
   <Text style={styles.sectionTitle}>{title}</Text>
   <View style={styles.sectionContent}>{children}</View>
  </View>
 )
}

const styles = StyleSheet.create({
 section: {
  marginBottom: 25,
  backgroundColor: MatrixColors.matrixDarkBG,
  borderWidth: 1,
  borderColor: MatrixColors.matrixGreen,
  borderRadius: 8,
  padding: 15,
 },
 sectionTitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: MatrixColors.matrixGreen,
  marginBottom: 15,
  textShadowColor: MatrixColors.matrixGreenShadow,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
  borderBottomWidth: 1,
  borderBottomColor: MatrixColors.matrixGreen,
  paddingBottom: 8,
 },
 sectionContent: {
  gap: 12,
 },
 statItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 8,
  paddingHorizontal: 12,
  backgroundColor: MatrixColors.matrixDarkBG,
  borderRadius: 4,
  borderLeftWidth: 3,
  borderLeftColor: MatrixColors.matrixGreen,
 },
 statLabel: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: '#AAA',
  flex: 1,
 },
 statValue: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'right',
 },
 highlightValue: {
  textShadowColor: MatrixColors.matrixGold,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 8,
 },
})
