import { BaseModal } from '@/components/ui/BaseModal'
import { UserPage } from './User'

export const UserSettingsModal = (isVisible: boolean, onClose: () => void) => {
 return (
  <BaseModal isVisible={isVisible} onClose={onClose}>
   <UserPage />
  </BaseModal>
 )
}
