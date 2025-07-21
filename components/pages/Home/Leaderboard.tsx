import React from 'react'

import { StyleSheet, View } from 'react-native'

import { observer } from 'mobx-react-lite'
import { Text } from 'react-native-paper'

import { MatrixContainer } from '@/components/shared/MatrixContainer'
import { MatrixColors } from '@/constants/Colors'
import { FONT_FAMILY } from '@/constants/Fonts'
import { useAppStore } from '@/providers/StoreProvider'

const Leaderboard = observer(() => {
 const { leaderboard } = useAppStore()

 return (
  <MatrixContainer title="Leaderboard">
   {/* Table Header */}
   <View style={styles.headerRow}>
    <Text style={[styles.text, styles.headerText, styles.usernameColumn]}>
     Username
    </Text>
    <Text style={[styles.text, styles.headerText, styles.dataColumn]}>
     Score
    </Text>
    <Text style={[styles.text, styles.headerText, styles.dataColumn]}>
     Dropped
    </Text>
   </View>

   {/* Table Data */}
   {leaderboard.map((user, index) => (
    <View
     key={user.id}
     style={[styles.dataRow, index % 2 === 0 && styles.evenRow]}
    >
     <Text style={[styles.text, styles.usernameColumn]}>{user.username}</Text>
     <Text style={[styles.text, styles.dataColumn]}>
      {user.bytes_downloaded.toLocaleString()}
     </Text>
     <Text style={[styles.text, styles.dataColumn]}>
      {user.packets_dropped.toLocaleString()}
     </Text>
    </View>
   ))}
  </MatrixContainer>
 )
})

export default Leaderboard

const styles = StyleSheet.create({
 headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: MatrixColors.matrixGreen,
  marginBottom: 8,
 },
 dataRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 8,
  paddingHorizontal: 8,
  borderBottomWidth: 0.5,
  borderBottomColor: MatrixColors.matrixGreen,
 },
 evenRow: {
  backgroundColor: MatrixColors.matrixDarkBG,
 },
 text: {
  fontSize: 20,
  fontFamily: FONT_FAMILY,
  color: MatrixColors.white,
 },
 headerText: {
  fontWeight: 'bold',
  color: MatrixColors.matrixGreen,
 },
 usernameColumn: {
  flex: 2,
  textAlign: 'left',
 },
 dataColumn: {
  flex: 1,
  textAlign: 'center',
 },
})
