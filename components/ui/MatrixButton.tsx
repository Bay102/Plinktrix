import React from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native'
const FONT_FAMILY = Platform.OS === 'ios' ? 'VT323' : 'VT323'

const MatrixButton = ({
 title,
 onPress,
 loading,
}: {
 title: string
 onPress: () => void
 loading?: boolean
}) => {
 return (
  <TouchableOpacity style={styles.refreshButton} onPress={onPress}>
   <Text style={[styles.refreshText]}>
    {loading ? '[ LOADING... ]' : title}
   </Text>
  </TouchableOpacity>
 )
}

export default MatrixButton

const styles = StyleSheet.create({
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
  fontSize: 18,
  color: '#0F0',
  textAlign: 'center',
 },
 refreshingText: {
  color: '#AAA',
 },
})
