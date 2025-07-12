import { StyleSheet } from 'react-native'

import DigitalRain from '@/components/pages/Plinko/DigitalRain'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { Button, TextInput } from 'react-native-paper'

export default function TabTwoScreen() {
 return (
  <ParallaxScrollView
   headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
   headerImage={<DigitalRain />}
  >
   <TextInput label="Email" mode="outlined" />
   <TextInput label="Username" mode="outlined" />
   <TextInput label="Password" mode="outlined" />
   <Button mode="contained" style={styles.button} onPress={() => {}}>
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
