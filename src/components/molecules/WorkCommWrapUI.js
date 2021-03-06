import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.View`
  flex: 1;
  align-items: flex-end;
  ${props => props.row
    && `
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `}
  margin: 3px 10px;
  padding: 3px 0px;
`;

export default class WorkCommWrapUI extends React.PureComponent {
  render() {
    const { row } = this.props;
    return (
      <Container ref={c => (this._root = c)} {...this.props} row={row}>
        {this.props.children}
      </Container>
    );
  }
}
