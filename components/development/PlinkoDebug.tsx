import React from 'react'

import { StyleSheet, View } from 'react-native'

import { Text } from 'react-native-paper'

import { FONT_FAMILY } from '@/constants/Fonts'
import { MatrixColors } from '@/constants/Theme'

interface DebugOverlayProps {
 boardWidth: number
 boardHeight: number
 gameConstants: any
 prizeValues?: number[]
}

// --- Debug Overlay Component ---
export const DebugOverlay = React.memo<DebugOverlayProps>(
 ({ boardWidth, boardHeight, gameConstants, prizeValues = [] }) => {
  const centerX = boardWidth / 2
  const antiCenterZoneWidth = 30 // 10 pixels on each side of center
  const activeZoneStartY =
   gameConstants.PEG_VERTICAL_SPACING * gameConstants.ROWS + 5

  // Calculate slot boundaries (same logic as scoring)
  // Prize container spans full board width with internal padding matching ball coordinate system
  const slotWidth = boardWidth / prizeValues.length

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

    {/* Slot boundaries */}
    {prizeValues.map((value, index) => {
     const slotStartX = index * slotWidth
     const slotEndX = (index + 1) * slotWidth

     return (
      <React.Fragment key={`slot-${index}`}>
       {/* Slot boundary line */}
       <View
        style={[
         styles.debugSlotBoundary,
         {
          left: slotStartX,
          top: boardHeight - 40,
          height: 40,
         },
        ]}
       />
       {/* Slot label */}
       <Text
        style={[
         styles.debugSlotLabel,
         {
          left: slotStartX + slotWidth / 2 - 10,
          top: boardHeight - 35,
         },
        ]}
       >
        {value}
       </Text>
      </React.Fragment>
     )
    })}

    {/* Final boundary line */}
    {prizeValues.length > 0 && (
     <View
      style={[
       styles.debugSlotBoundary,
       {
        left: prizeValues.length * slotWidth,
        top: boardHeight - 40,
        height: 40,
       },
      ]}
     />
    )}
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
  // zIndex: 10,
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
 debugSlotBoundary: {
  position: 'absolute',
  backgroundColor: MatrixColors.matrixCyan,
  width: 1,
  opacity: 0.8,
 },
 debugSlotLabel: {
  position: 'absolute',
  fontFamily: FONT_FAMILY,
  backgroundColor: MatrixColors.matrixCyan,
  color: MatrixColors.matrixDarkBG,
  fontSize: 10,
  paddingHorizontal: 3,
  paddingVertical: 1,
  borderRadius: 2,
  textAlign: 'center',
  width: 20,
 },
})

DebugOverlay.displayName = 'DebugOverlay'
