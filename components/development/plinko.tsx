import { MatrixColors } from '@/constants/Colors'
import { FONT_FAMILY } from '@/constants/Fonts'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

interface DebugOverlayProps {
 boardWidth: number
 boardHeight: number
 gameConstants: any
}

// --- Debug Overlay Component ---
export const DebugOverlay = React.memo<DebugOverlayProps>(
 ({ boardWidth, boardHeight, gameConstants }) => {
  const centerX = boardWidth / 2
  const antiCenterZoneWidth = 20 // 10 pixels on each side of center
  const activeZoneStartY =
   gameConstants.PEG_VERTICAL_SPACING * (gameConstants.ROWS + 1)

  return (
   <View style={styles.debugOverlay}>
    {/* Center line */}
    <View
     style={[
      styles.debugCenterLine,
      {
       left: centerX - 1,
       height: boardHeight,
      },
     ]}
    />

    {/* Anti-center bias zone */}
    <View
     style={[
      styles.debugAntiCenterZone,
      {
       left: centerX - antiCenterZoneWidth / 2,
       width: antiCenterZoneWidth,
       top: activeZoneStartY,
       height: boardHeight - activeZoneStartY,
      },
     ]}
    />

    {/* Center point marker */}
    <View
     style={[
      styles.debugCenterPoint,
      {
       left: centerX - 4,
       top: activeZoneStartY - 4,
      },
     ]}
    />

    {/* Zone label */}
    <Text
     style={[
      styles.debugLabel,
      {
       left: centerX + 30,
       top: activeZoneStartY + 20,
      },
     ]}
    >
     Anti-Center Zone (Post-Pegs)
    </Text>
   </View>
  )
 }
)

const styles = StyleSheet.create({
 debugOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10,
  pointerEvents: 'none',
 },
 debugCenterLine: {
  position: 'absolute',
  backgroundColor: MatrixColors.matrixGreen,
  width: 2,
 },
 debugAntiCenterZone: {
  position: 'absolute',
  backgroundColor: '#B00020',
  opacity: 0.3,
 },
 debugCenterPoint: {
  position: 'absolute',
  backgroundColor: MatrixColors.matrixGreen,
  width: 8,
  height: 8,
  borderRadius: 4,
 },
 debugLabel: {
  position: 'absolute',
  fontFamily: FONT_FAMILY,
  backgroundColor: MatrixColors.matrixGreen,
  color: MatrixColors.matrixDarkBG,
  fontSize: 12,
  paddingHorizontal: 5,
  paddingVertical: 2,
  borderRadius: 3,
 },
})

DebugOverlay.displayName = 'DebugOverlay'
