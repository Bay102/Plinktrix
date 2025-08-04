import styled from '@emotion/native'

import { Text } from '@/components/PaperBase/Text'

const WarningMessage = ({
 message,
 action,
}: {
 message: string
 action?: React.ReactNode
}) => {
 return (
  <Container>
   <WarningText>{message}</WarningText>
   {action && <ActionWrapper>{action}</ActionWrapper>}
  </Container>
 )
}

export default WarningMessage

//  border: 1px solid ${({ theme }) => theme.colors.matrixGold};
//  align-self: center;
//  justify-content: center;

const Container = styled.View`
 flex-direction: row;
 align-items: center;
 height: 100%;
 padding: 10px;
`

const WarningText = styled(Text)`
 font-size: 16px;
 font-weight: 600;
 color: ${({ theme }) => theme.colors.matrixGold};
 font-family: ${({ theme }) => theme.fonts.regular};
`

const ActionWrapper = styled.View`
 flex-direction: row;
 align-items: center;
 justify-content: center;
`
