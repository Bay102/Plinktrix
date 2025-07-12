import { StyleSheet } from 'react-native'

import DigitalRain from '@/components/pages/Plinko/DigitalRain'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { createAccount } from '@/supabase/api/create-account'
import { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'

export default function AccountScreen() {
 const [email, setEmail] = useState('')
 const [username, setUsername] = useState('')
 const [password, setPassword] = useState('')

 const handleCreateAccount = async () => {
  try {
   const { error } = await createAccount(email, password)
   if (error) {
    console.error(error)
   }
  } catch (error) {
   console.error(error)
  }
 }

 return (
  <ParallaxScrollView
   headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
   headerImage={<DigitalRain />}
  >
   <TextInput
    label="Email"
    mode="outlined"
    value={email}
    onChangeText={setEmail}
   />
   <TextInput
    label="Username"
    mode="outlined"
    value={username}
    onChangeText={setUsername}
   />
   <TextInput
    label="Password"
    mode="outlined"
    value={password}
    onChangeText={setPassword}
   />
   <Button mode="contained" style={styles.button} onPress={handleCreateAccount}>
    Get Started
   </Button>
  </ParallaxScrollView>
 )
}

const styles = StyleSheet.create({
 headerImage: {
  color: '#808080',
  bottom: -90,
  left: -35,
  position: 'absolute',
 },
 button: {
  borderRadius: 2,
 },
})
