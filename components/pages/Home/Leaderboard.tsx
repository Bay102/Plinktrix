import React, { useEffect, useState } from 'react'

import { StyleSheet, View } from 'react-native'

import { Text } from 'react-native-paper'

import { MatrixContainer } from '@/components/shared/MatrixContainer'
import { FONT_FAMILY } from '@/constants/Fonts'
import { getLeaderboard } from '@/supabase/api/leaderboard'

const Leaderboard = () => {
 const [leaderboard, setLeaderboard] = useState<any[]>([])

 useEffect(() => {
  const fetchLeaderboard = async () => {
   const leaderboard = await getLeaderboard()
   setLeaderboard(leaderboard)
  }
  fetchLeaderboard()
 }, [])

 return (
  <MatrixContainer title="Leaderboard">
   {leaderboard.map((user) => (
    <View key={user.id} style={styles.container}>
     <Text key={user.id} style={styles.text}>
      {user.username}
     </Text>
     <Text style={styles.text}>{user.bytes_downloaded}</Text>
    </View>
   ))}
  </MatrixContainer>
 )
}

export default Leaderboard

const styles = StyleSheet.create({
 container: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
 },
 text: {
  fontSize: 16,
  fontFamily: FONT_FAMILY,
 },
})
