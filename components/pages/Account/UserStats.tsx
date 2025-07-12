import { Colors } from '@/constants/Colors'
import { useAuthProvider } from '@/providers'
import { getUserStats } from '@/supabase/api/update-user-stats'
import React, { useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'

const FONT_FAMILY = Platform.OS === 'ios' ? 'VT323' : 'VT323'

export const UserStats = () => {
 const { userData, user, setUserData } = useAuthProvider()
 const [isRefreshing, setIsRefreshing] = useState(false)

 const username = userData?.username
 const score = userData?.current_score
 const accountLevel = userData?.account_level
 const bonusBalls = userData?.bonus_balls
 const regularBalls = userData?.regular_balls
 const createdAt = userData?.created_at

 const refreshUserData = async () => {
  if (!user?.id || isRefreshing) return

  try {
   setIsRefreshing(true)
   const freshUserData = await getUserStats(user.id)
   if (freshUserData) {
    setUserData(freshUserData)
   }
  } catch (error) {
   console.error('Error refreshing user data:', error)
  } finally {
   setIsRefreshing(false)
  }
 }

 // Format creation date
 const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
   year: 'numeric',
   month: 'short',
   day: 'numeric',
  })
 }

 // Format account level
 const formatAccountLevel = (level: string | null | undefined) => {
  if (!level) return 'FREE'
  return level.toUpperCase()
 }

 const StatItem: React.FC<{
  label: string
  value: string | number
  color?: string
  isHighlight?: boolean
 }> = ({ label, value, color = '#0F0', isHighlight = false }) => (
  <View style={styles.statItem}>
   <Text
    style={[styles.statLabel, { color: isHighlight ? '#FFD700' : '#AAA' }]}
   >
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

 return (
  <View style={[styles.container, { backgroundColor: Colors.dark.surface }]}>
   {/* Header */}
   <View style={styles.header}>
    <Text style={styles.headerTitle}>USER PROFILE</Text>
    <Text style={styles.headerSubtitle}>System data retrieval complete...</Text>

    {/* Refresh Button */}
    <TouchableOpacity
     style={styles.refreshButton}
     onPress={refreshUserData}
     disabled={isRefreshing}
    >
     <Text style={[styles.refreshText, isRefreshing && styles.refreshingText]}>
      {isRefreshing ? '[ REFRESHING... ]' : '[ REFRESH DATA ]'}
     </Text>
    </TouchableOpacity>
   </View>

   {/* User Identity Section */}
   <View style={styles.section}>
    <Text style={styles.sectionTitle}>USER IDENTITY</Text>
    <View style={styles.sectionContent}>
     <StatItem
      label="USERNAME"
      value={username || 'UNKNOWN'}
      color="#0CF"
      isHighlight={true}
     />
     <StatItem
      label="ACCOUNT_LEVEL"
      value={formatAccountLevel(accountLevel)}
      color="#0F0"
     />
     <StatItem
      label="CREATED_AT"
      value={createdAt ? formatDate(createdAt) : 'N/A'}
      color="#0F0"
     />
    </View>
   </View>

   {/* Performance Metrics Section */}
   <View style={styles.section}>
    <Text style={styles.sectionTitle}>PERFORMANCE METRICS</Text>
    <View style={styles.sectionContent}>
     <StatItem
      label="CURRENT_SCORE"
      value={score?.toLocaleString() || '0'}
      color="#0F0"
      isHighlight={true}
     />
    </View>
   </View>

   {/* Resource Allocation Section */}
   <View style={styles.section}>
    <Text style={styles.sectionTitle}>RESOURCE ALLOCATION</Text>
    <View style={styles.sectionContent}>
     <StatItem label="REGULAR_PACKETS" value={regularBalls || 0} color="#0AF" />
     <StatItem label="BONUS_PACKETS" value={bonusBalls || 0} color="#FFD700" />
     <StatItem
      label="TOTAL_PACKETS"
      value={(regularBalls || 0) + (bonusBalls || 0)}
      color="#0F0"
     />
    </View>
   </View>

   {/* Footer */}
   <View style={styles.footer}>
    <Text style={styles.footerText}>
     Data integrity verified • System status: OPERATIONAL
    </Text>
   </View>
  </View>
 )
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  padding: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
 },
 header: {
  alignItems: 'center',
  marginBottom: 30,
  paddingBottom: 20,
  borderBottomWidth: 2,
  borderBottomColor: '#0F0',
 },
 headerTitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 32,
  color: '#0F0',
  textShadowColor: 'rgba(0, 255, 0, 0.7)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
  marginBottom: 8,
 },
 headerSubtitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 14,
  color: '#AAA',
 },
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
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'right',
 },
 highlightValue: {
  textShadowColor: 'rgba(255, 215, 0, 0.5)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 8,
 },
 footer: {
  marginTop: 20,
  paddingTop: 20,
  borderTopWidth: 1,
  borderTopColor: '#070',
  alignItems: 'center',
 },
 footerText: {
  fontFamily: FONT_FAMILY,
  fontSize: 12,
  color: '#666',
  textAlign: 'center',
 },
 refreshButton: {
  marginTop: 10,
  padding: 8,
  borderWidth: 1,
  borderColor: '#0F0',
  borderRadius: 4,
  backgroundColor: 'rgba(0, 255, 0, 0.1)',
 },
 refreshText: {
  fontFamily: FONT_FAMILY,
  fontSize: 12,
  color: '#0F0',
  textAlign: 'center',
 },
 refreshingText: {
  color: '#AAA',
 },
})
