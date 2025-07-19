import { StyleSheet, View } from 'react-native'

import { BaseModal } from '@/components/shared/BaseModal'
import MatrixButton from '@/components/shared/MatrixButton'
import { useAuthProvider, useUserProvider } from '@/providers'

export const UserSettingsModal = ({
 isVisible = false,
 onClose,
}: {
 isVisible?: boolean
 onClose: () => void
}) => {
 const { logOut, refreshUserData, isRefreshing } = useAuthProvider()
 const { setSettingsModalVisible } = useUserProvider()

 return (
  <BaseModal isVisible={isVisible} onClose={onClose}>
   {/* <DigitalRain /> */}
   <View style={styles.container}>
    <MatrixButton
     title=" [ REFRESH DATA ]"
     onPress={refreshUserData}
     loading={isRefreshing}
    />
    <MatrixButton
     title=" [ LOGOUT ]"
     onPress={() => {
      logOut()
      setSettingsModalVisible(false)
     }}
    />
   </View>
  </BaseModal>
 )
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: 20,
 },
})
