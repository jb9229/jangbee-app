import * as React from 'react';

import styled from 'styled-components/native';

const Header = styled.View`
  justify-content: center;
  align-items: flex-end;
  height: 50;
`;

const TouchableHighlight = styled.TouchableHighlight``;

const CloseIcon = styled.Image``;

interface Props {
  onClick: () => void;
}

const HeaderClose: React.FC<Props> = ({ onClick }) => {
  return (
    <Header>
      <TouchableHighlight onPress={onClick}>
        <CloseIcon source={require('assets/icons/close/close.png')} />
      </TouchableHighlight>
    </Header>
  );
};

export default HeaderClose;
