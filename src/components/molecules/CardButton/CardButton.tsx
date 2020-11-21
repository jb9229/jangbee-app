import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

// Styled Components
const ButtonWrap = styled.View`
  flex-direction: column;
`;
const ButtonTouHi = styled.TouchableHighlight`
  border: 2px solid red;
  border-radius: 15;
  padding: 10px;
`;
const TitleWrap = styled.View`
  align-items: center;
`;
const ValueWrap = styled.View`
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
`;
const ActionWrap = styled.View`
  align-items: flex-end;
`;

const TitleText = styled.Text`
  font-family: ${fonts.title};
  font-size: 20px;
`;
const ValueText = styled.Text`
  font-family: ${fonts.batang};
`;
const ActionText = styled.Text`
  font-family: ${fonts.button};
`;

interface Props {
  title: string;
  value: string;
  action: string;
  onPress?: () => void;
}

function CardButton(props: Props) {
  return (
    <ButtonTouHi onPress={props.onPress}>
      <ButtonWrap>
        <TitleWrap>
          <TitleText>{props.title}</TitleText>
        </TitleWrap>
        <ValueWrap>
          <ValueText>{props.value}개</ValueText>
        </ValueWrap>
        <ActionWrap>
          <ActionText>{props.action} ></ActionText>
        </ActionWrap>
      </ButtonWrap>
    </ButtonTouHi>
  );
}

CardButton.defaultProps = {
  isLoading: false,
  isDisabled: false,
  indicatorColor: 'white',
  activeOpacity: 0.5
};

export default CardButton;
