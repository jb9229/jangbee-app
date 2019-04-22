import React from 'react';
import Styled from 'styled-components/native';
import colors from '../../constants/Colors';

const Container = Styled.View`
  flex: 1;
  align-items: flex-end;
  margin: 3px 10px;
  padding: 3px 0px;
  border-top-width: 1;
  border-color: ${colors.point2}
`;

export default class WorkCommWrapUI extends React.PureComponent {
  render() {
    return (
      <Container ref={c => (this._root = c)} {...this.props}>
        {this.props.children}
      </Container>
    );
  }
}
