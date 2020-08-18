import * as React from 'react';

import styled from 'styled-components/native';

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  background-color: white;
  shadow-color: black;
  shadow-radius: 2;
  shadow-offset: 0px 8px;
  elevation: 4;
`;

const TouchableHighlight = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 50;
  width: 70;
`;

const CloseIcon = styled.Image``;
const TitleWrap = styled.View`
   position: absolute;
   flex-direction: row;
   justify-content: center;
   width: 100%;
`;
const Title = styled.Text`
  font-family: ${(props) => props.theme.FontTitle};
  font-size: 24;
`;

interface Props {
  title?: string;
  onClick: () => void;
}

const HeaderClose: React.FC<Props> = (props) =>
{
  return (
    <Header>
      {!!props.title && (<TitleWrap><Title>{props.title}</Title></TitleWrap>)}
      <TouchableHighlight onPress={props.onClick}>
        <CloseIcon source={require('../../../assets/icons/close/close.png')} />
      </TouchableHighlight>
    </Header>
  );
};

export default HeaderClose;
