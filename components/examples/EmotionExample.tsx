import React from 'react'

import styled from '@emotion/native'

import { useEmotionTheme, useMatrixTheme } from '@/providers'

// Styled components using the theme
const Container = styled.View`
 background-color: ${({ theme }) => theme.colors.background};
 padding: ${({ theme }) => theme.dp(theme.spacing.md)};
 border-radius: ${({ theme }) => theme.dp(theme.borderRadius.md)};
 margin: ${({ theme }) => theme.dp(theme.spacing.sm)};
`

const MatrixText = styled.Text`
 color: ${({ theme }) => theme.colors.matrixGreen};
 font-family: ${({ theme }) => theme.fonts.regular};
 font-size: ${({ theme }) => theme.dp(theme.fontSizes.lg)};
 text-shadow: 0 0 5px ${({ theme }) => theme.colors.matrixGreenShadow};
 text-align: center;
 margin-bottom: ${({ theme }) => theme.dp(theme.spacing.sm)};
`

const StyledButton = styled.Pressable<{ variant?: 'primary' | 'secondary' }>`
 background-color: ${({ theme, variant }) =>
  variant === 'secondary' ? theme.colors.surface : theme.colors.matrixGreen};
 padding: ${({ theme }) =>
  `${theme.dp(theme.spacing.sm)} ${theme.dp(theme.spacing.md)}`};
 border-radius: ${({ theme }) => theme.dp(theme.borderRadius.sm)};
 border: ${({ theme }) => theme.dp(theme.borderWidth.sm)} solid
  ${({ theme }) => theme.colors.matrixGreen};
 margin: ${({ theme }) => theme.dp(theme.spacing.xs)} 0;
`

const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' }>`
 color: ${({ theme, variant }) =>
  variant === 'secondary' ? theme.colors.matrixGreen : theme.colors.black};
 font-family: ${({ theme }) => theme.fonts.regular};
 text-align: center;
 font-size: ${({ theme }) => theme.dp(theme.fontSizes.md)};
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

   {/* Example of using theme directly with numeric values for React Native styles */}
   <MatrixText
    style={{
     color: matrixTheme.isDark
      ? emotionTheme.colors.matrixCyan
      : emotionTheme.colors.matrixBlue,
     fontSize: emotionTheme.fontSizes.sm,
    }}
   >
    Theme aware text: {matrixTheme.isDark ? 'Dark Mode' : 'Light Mode'}
   </MatrixText>
  </Container>
 )
}
