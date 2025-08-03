import React from 'react'

import styled from '@emotion/native'

export const formatDate = (dateString: string) => {
 const date = new Date(dateString)
 return date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
 })
}

// Format account level
export const formatAccountLevel = (level: string | null | undefined) => {
 if (!level) return 'FREE'
 return level.toUpperCase()
}

export const StatItem: React.FC<{
 label: string
 value: string | number
 color?: string
 isHighlight?: boolean
}> = ({ label, value, color = '#0F0', isHighlight = false }) => (
 <StyledStatItem>
  <StyledStatLabel isHighlight={isHighlight}>{label}</StyledStatLabel>
  <StyledStatValue isHighlight={isHighlight} valueColor={color}>
   {value}
  </StyledStatValue>
 </StyledStatItem>
)

export const MatrixContainer = ({
 title,
 children,
}: {
 title: string
 children: React.ReactNode
}) => {
 return (
  <StyledSection>
   <StyledSectionTitle>{title}</StyledSectionTitle>
   <StyledSectionContent>{children}</StyledSectionContent>
  </StyledSection>
 )
}

// Styled Components
const StyledSection = styled.View`
 margin-bottom: ${({ theme }) => theme.dp(25)};
 background-color: ${({ theme }) => theme.colors.matrixDarkBG};
 border-width: ${({ theme }) => theme.dp(1)};
 border-color: ${({ theme }) => theme.colors.matrixGreen};
 border-radius: ${({ theme }) => theme.dp(8)};
 padding: ${({ theme }) => theme.dp(15)};
`

const StyledSectionTitle = styled.Text`
 font-family: ${({ theme }) => theme.fonts.regular};
 font-size: ${({ theme }) => theme.dp(18)};
 color: ${({ theme }) => theme.colors.matrixGreen};
 margin-bottom: ${({ theme }) => theme.dp(15)};
 text-shadow-color: ${({ theme }) => theme.colors.matrixGreenShadow};
 text-shadow-offset: 0px 0px;
 text-shadow-radius: ${({ theme }) => theme.dp(5)};
 border-bottom-width: ${({ theme }) => theme.dp(1)};
 border-bottom-color: ${({ theme }) => theme.colors.matrixGreen};
 padding-bottom: ${({ theme }) => theme.dp(8)};
`

const StyledSectionContent = styled.View`
 gap: ${({ theme }) => theme.dp(12)};
`

const StyledStatItem = styled.View`
 flex-direction: row;
 justify-content: space-between;
 align-items: center;
 padding-vertical: ${({ theme }) => theme.dp(8)};
 padding-horizontal: ${({ theme }) => theme.dp(12)};
 background-color: ${({ theme }) => theme.colors.matrixDarkBG};
 border-radius: ${({ theme }) => theme.dp(4)};
 border-left-width: ${({ theme }) => theme.dp(3)};
 border-left-color: ${({ theme }) => theme.colors.matrixGreen};
`

const StyledStatLabel = styled.Text<{ isHighlight?: boolean }>`
 font-family: ${({ theme }) => theme.fonts.regular};
 font-size: ${({ theme }) => theme.dp(20)};
 color: ${({ isHighlight }) => (isHighlight ? '#FFD700' : '#AAA')};
 flex: 1;
`

const StyledStatValue = styled.Text<{
 isHighlight?: boolean
 valueColor?: string
}>`
 font-family: ${({ theme }) => theme.fonts.regular};
 font-size: ${({ theme }) => theme.dp(20)};
 font-weight: bold;
 text-align: right;
 color: ${({ isHighlight, valueColor }) =>
  isHighlight ? '#FFD700' : valueColor || '#0F0'};
 ${({ isHighlight, theme }) =>
  isHighlight
   ? `
   text-shadow-color: ${theme.colors.matrixGold};
   text-shadow-offset: 0px 0px;
   text-shadow-radius: ${theme.dp(8)};
  `
   : ''}
`
