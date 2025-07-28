import React from 'react'

import styled from '@emotion/native'

import { useEmotionTheme, useMatrixTheme } from '@/providers'

// Styled components using the theme
const Container = styled.View`
 background-color: ${({ theme }) => theme.colors.background};
 padding: ${({ theme }) => theme.spacing.md}px;
 border-radius: ${({ theme }) => theme.borderRadius.md}px;
 margin: ${({ theme }) => theme.spacing.sm}px;
`

const MatrixText = styled.Text`
 color: ${({ theme }) => theme.colors.matrixGreen};
 font-family: ${({ theme }) => theme.fonts.regular};
 font-size: 18px;
 text-shadow: 0 0 5px ${({ theme }) => theme.colors.matrixGreenShadow};
 text-align: center;
 margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`

const StyledButton = styled.Pressable<{ variant?: 'primary' | 'secondary' }>`
 background-color: ${({ theme, variant }) =>
  variant === 'secondary' ? theme.colors.surface : theme.colors.matrixGreen};
 padding: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.md}px`};
 border-radius: ${({ theme }) => theme.borderRadius.sm}px;
 border: 1px solid ${({ theme }) => theme.colors.matrixGreen};
 margin: ${({ theme }) => theme.spacing.xs}px 0;
`

const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' }>`
 color: ${({ theme, variant }) =>
  variant === 'secondary' ? theme.colors.matrixGreen : theme.colors.black};
 font-family: ${({ theme }) => theme.fonts.regular};
 text-align: center;
 font-size: 16px;
`

export const EmotionExample: React.FC = () => {
 // Example of using different theme hooks
 const emotionTheme = useEmotionTheme()
 const matrixTheme = useMatrixTheme()

 return (
  <Container>
   <MatrixText>Matrix Styled Components</MatrixText>

   <StyledButton variant="primary">
    <ButtonText variant="primary">Primary Button</ButtonText>
   </StyledButton>

   <StyledButton variant="secondary">
    <ButtonText variant="secondary">Secondary Button</ButtonText>
   </StyledButton>

   {/* Example of using theme directly */}
   <MatrixText
    style={{
     color: matrixTheme.isDark
      ? emotionTheme.colors.matrixCyan
      : emotionTheme.colors.matrixBlue,
     fontSize: 14,
    }}
   >
    Theme aware text: {matrixTheme.isDark ? 'Dark Mode' : 'Light Mode'}
   </MatrixText>
  </Container>
 )
}
