import React from 'react'
import { StyleSheet, View } from 'react-native'
import Modal from 'react-native-modal'
import { Button } from 'react-native-paper'
import { IconSymbol } from './IconSymbol'

export const BaseModal = ({
 isVisible,
 onClose,
 children,
}: {
 isVisible: boolean
 onClose: () => void
 children: React.ReactNode
}) => {
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
      <IconSymbol size={35} name="xmark" color="black" />
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
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  // zIndex: 1,
 },
 modalHeaderText: {
  textAlign: 'center',
  color: 'black',
 },
 modalContentHeader: {
  backgroundColor: 'white',
  position: 'absolute',
  top: 0,
  padding: 20,
  borderRadius: 10,
  height: '10%',
  width: '100%',
 },
 modalContent: {
  backgroundColor: 'white',
  position: 'absolute',
  bottom: 0,
  padding: 20,
  borderRadius: 10,
  height: '60%',
  width: '100%',
  zIndex: 0,
 },
})
