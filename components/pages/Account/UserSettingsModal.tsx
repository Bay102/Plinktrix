import { BaseModal } from '@/components/ui/BaseModal'
import { useAuthProvider } from '@/providers'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'

export const UserSettingsModal = ({
 isVisible,
 onClose,
}: {
 isVisible: boolean
 onClose: () => void
}) => {
 const { logOut } = useAuthProvider()
 return (
  <BaseModal isVisible={isVisible} onClose={onClose}>
   {/* <DigitalRain /> */}
   <View style={styles.container}>
    <Button
     mode="contained"
     onPress={() => {
      logOut()
     }}
    >
     Logout
    </Button>
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
