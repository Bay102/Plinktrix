import ParallaxScrollView from '@/components/ParallaxScrollView'
import DigitalRain from '@/components/pages/Plinko/DigitalRain'
import { MatrixContainer } from '@/components/ui/MatrixContainer'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const index = () => {
 return (
  <ParallaxScrollView
   headerBackgroundColor={{ light: '#D0D0D0', dark: '#000' }}
   headerImage={<DigitalRain />}
  >
   <MatrixContainer title="WELCOME">
    <Text>Welcome to the Matrix</Text>
   </MatrixContainer>
  </ParallaxScrollView>
 )
}

export default index

const styles = StyleSheet.create({})
