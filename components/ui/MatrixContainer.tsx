import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'

const FONT_FAMILY = Platform.OS === 'ios' ? 'VT323' : 'VT323'

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
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderWidth: 1,
  borderColor: '#0F0',
  borderRadius: 8,
  padding: 15,
 },
 sectionTitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 18,
  color: '#0F0',
  marginBottom: 15,
  textShadowColor: 'rgba(0, 255, 0, 0.5)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
  borderBottomWidth: 1,
  borderBottomColor: '#070',
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
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  borderRadius: 4,
  borderLeftWidth: 3,
  borderLeftColor: '#0F0',
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
  textShadowColor: 'rgba(255, 215, 0, 0.5)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 8,
 },
})
