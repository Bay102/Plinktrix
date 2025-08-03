import React from 'react'

import styled from '@emotion/native'

const MatrixButton = ({
 title,
 onPress,
 loading,
}: {
 title: string
 onPress: () => void
 loading?: boolean
}) => {
 return (
  <Button onPress={onPress}>
   <ButtonText>{loading ? '[ LOADING... ]' : title}</ButtonText>
  </Button>
 )
}

export default MatrixButton

const Button = styled.TouchableOpacity`
 background-color: ${({ theme }) => theme.colors.matrixGreen};
 margin-top: ${({ theme }) => theme.spacing.sm};
 padding: ${({ theme }) => theme.spacing.sm};
 border-width: ${({ theme }) => theme.borderWidth.sm};
 border-color: ${({ theme }) => theme.colors.matrixGreen};
 border-radius: ${({ theme }) => theme.borderRadius.sm};
 align-self: center;
`

const ButtonText = styled.Text`
 font-family: ${({ theme }) => theme.fonts.regular};
 font-size: ${({ theme }) => theme.fontSizes.lg};
 text-align: center;
`
