import { Platform, StyleSheet } from 'react-native'

const FONT_FAMILY = Platform.OS === 'ios' ? 'VT323' : 'VT323'

export const styles = StyleSheet.create({
 // Main Layout
 screen: {
  flex: 1,
  backgroundColor: '#000',
 },
 container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: 16,
 },
 header: {
  alignItems: 'center',
  marginBottom: 20,
 },
 title: {
  fontFamily: FONT_FAMILY,
  fontSize: 72,
  color: '#0F0',
  textShadowColor: 'rgba(0, 255, 0, 0.7)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
 },
 subtitle: {
  fontFamily: FONT_FAMILY,
  fontSize: 16,
  color: '#AAA',
  marginTop: 4,
 },
 // Game Board
 board: {
  position: 'relative',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderWidth: 2,
  borderColor: '#0F0',
  borderRadius: 8,
  padding: 4,
 },
 peg: {
  width: 8,
  height: 8,
  backgroundColor: '#0F0',
  borderRadius: 4,
  shadowColor: '#0F0',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 1,
  shadowRadius: 5,
  elevation: 5, // for Android
 },
 prizeContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'center',
 },
 prizeSlot: {
  flex: 1,
  height: 50,
  alignItems: 'center',
  justifyContent: 'center',
  borderTopWidth: 2,
  borderTopColor: '#0F0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
 },
 prizeSlotText: {
  fontFamily: FONT_FAMILY,
  color: '#0F0',
  fontSize: 14,
  fontWeight: 'bold',
 },
 // Ball Styles
 ball: {
  position: 'absolute',
  width: 20,
  height: 20,
  borderRadius: 10,
 },
 regularBall: {
  backgroundColor: '#0AF',
  borderColor: '#0CF',
  borderWidth: 2,
 },
 goldBall: {
  backgroundColor: '#FFD700',
  borderColor: '#FFF',
  borderWidth: 2,
 },
 // Controls
 controls: {
  width: '90%',
  maxWidth: 400,
  alignItems: 'center',
  marginTop: 20,
 },
 sliderContainer: {
  width: '100%',
  marginBottom: 20,
 },
 labelText: {
  fontFamily: FONT_FAMILY,
  color: '#0F0',
  fontSize: 18,
  marginBottom: 8,
  textShadowColor: 'rgba(0, 255, 0, 0.5)',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 5,
 },
 button: {
  paddingVertical: 16,
  paddingHorizontal: 32,
  backgroundColor: '#0F0',
  borderWidth: 2,
  borderColor: '#0F0',
  shadowColor: '#0F0',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 10,
  elevation: 8,
 },
 disabledButton: {
  backgroundColor: '#555',
  borderColor: '#777',
  shadowOpacity: 0,
  elevation: 0,
 },
 buttonText: {
  color: '#000',
  fontFamily: FONT_FAMILY,
  fontSize: 22,
  fontWeight: 'bold',
 },
 footer: {
  fontFamily: FONT_FAMILY,
  color: '#666',
  fontSize: 12,
  marginTop: 20,
 },
})
