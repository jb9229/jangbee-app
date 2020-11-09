import { DefaultStyledProps } from 'src/theme';
import { RText } from '../StyledText';
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  position: absolute;
  bottom: 30px;
  right: 10px;
`;

const ButtonTO = styled.TouchableOpacity<DefaultStyledProps>`
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.ColorPrimary};
  border-radius: 150px;

  shadow-offset: 0px 5px;
  shadow-color: rgba(0, 0, 0, 0.8);
  shadow-opacity: 0.3;
  elevation: 4;
`;

const ButtonText = styled(RText)`
  font-size: 26px;
  color: white;
  font-weight: bold;
`;

interface Props {
  onClick: () => void;
  text: string;
}

const FloatButton: React.FC<Props> = ({ text, onClick }) =>
{
  return (
    <Container>
      <ButtonTO onPress={onClick}>
        <ButtonText>{text}</ButtonText>
      </ButtonTO>
    </Container>
  );
};

export default FloatButton;
