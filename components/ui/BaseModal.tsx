import React from 'react'

import { StyleSheet, useColorScheme, View } from 'react-native'

import Modal from 'react-native-modal'
import { Button } from 'react-native-paper'

import { createTheme, MatrixColors } from '@/constants/Colors'

import { IconSymbol } from './IconSymbol'

export const BaseModal = ({
 isVisible = false,
 onClose,
 children,
}: {
 isVisible: boolean
 onClose: () => void
 children: React.ReactNode
}) => {
 const colorScheme = useColorScheme()
 const theme = createTheme(colorScheme)
 return (
  <Modal
   isVisible={isVisible}
   onBackdropPress={onClose}
   style={styles.modal}
   animationIn="fadeIn"
   animationOut="fadeOut"
   backdropColor="black"
   backdropOpacity={0.7}
  >
   <View style={styles.modalContent}>
    <View style={styles.modalHeader}>
     <Button mode="text" onPress={onClose}>
      <IconSymbol size={25} name="xmark.circle" color={theme.colors.error} />
     </Button>
    </View>
    {children}
   </View>
  </Modal>
 )
}

const styles = StyleSheet.create({
 modal: {
  margin: 0,
 },
 modalHeader: {
  padding: 0,
  alignItems: 'flex-end',
 },
 modalHeaderText: {
  textAlign: 'center',
  color: 'black',
 },
 modalContentHeader: {
  position: 'absolute',
  top: 0,
  padding: 20,
  borderRadius: 10,
  height: '10%',
  width: '100%',
 },
 modalContent: {
  backgroundColor: MatrixColors.matrixDarkBG,
  position: 'absolute',
  bottom: 0,
  padding: 20,
  borderRadius: 10,
  height: '60%',
  width: '100%',
 },
})
