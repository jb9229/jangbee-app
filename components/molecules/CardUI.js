import React from 'react';
import Styled from 'styled-components/native';
import colors from '../../constants/Colors';

const Container = Styled.View`
  flex: 1;
  background-color: ${colors.cardBatang};
`;

const Card = Styled.View`
  flex: 1;
  justify-content: space-between;
  background-color: white;
  padding: 5px;
  border-radius: 15;
  margin: 10px;
  
  ${props => props.Finished
    && `
    background-color: ${colors.batang};
  `}
`;

export default class CardUI extends React.PureComponent {
  render() {
    const { Finished } = this.props;

    return (
      <Container ref={c => (this._root = c)} {...this.props}>
        <Card Finished={Finished}>{this.props.children}</Card>
      </Container>
    );
  }
}
