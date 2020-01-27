import * as React from 'react';

import styled from 'styled-components/native';

const Header = styled.View`
  width: 100%;
  align-items: flex-end;
`;

const TouchableHighlight = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 50;
  width: 70;
`;

const CloseIcon = styled.Image``;

interface Props {
  onClick: () => void;
}

const HeaderClose: React.FC<Props> = ({ onClick }) =>
{
  return (
    <Header>
      <TouchableHighlight onPress={onClick}>
        <CloseIcon source={require('../../../assets/icons/close/close.png')} />
      </TouchableHighlight>
    </Header>
  );
};

export default HeaderClose;
