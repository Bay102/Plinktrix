import React from 'react'

import styled from '@emotion/native'

const MatrixButton = ({
 title,
 onPress,
 loading,
 width,
}: {
 title: string
 onPress: () => void
 loading?: boolean
 width?: number
}) => {
 return (
  <Button onPress={onPress} width={width}>
   <ButtonText>{loading ? '[ LOADING... ]' : title}</ButtonText>
  </Button>
 )
}

export default MatrixButton

const Button = styled.TouchableOpacity<{ width?: number }>`
 background-color: ${({ theme }) => theme.colors.matrixGreen};
 width: ${({ width, theme }) => (width ? theme.dp(width) : 'auto')};
 margin-top: ${({ theme }) => theme.dp(theme.spacing.sm)};
 padding: ${({ theme }) => theme.dp(theme.spacing.sm)};
 border-width: ${({ theme }) => theme.dp(theme.borderWidth.sm)};
 border-color: ${({ theme }) => theme.colors.matrixGreen};
 border-radius: ${({ theme }) => theme.dp(theme.borderRadius.sm)};
 align-self: center;
`

const ButtonText = styled.Text`
 font-family: ${({ theme }) => theme.fonts.regular};
 font-size: ${({ theme }) => theme.dp(theme.fontSizes.lg)};
 text-align: center;
`
