import * as React from 'react';

import { StyleProp, ViewStyle } from 'react-native';

import { CashBack } from 'src/container/cashback/type';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Text = styled.Text``;

interface Props {
  no: number;
  item: CashBack;
  wrapperStyle?: StyleProp<ViewStyle>;
}
const CashBackListItem: React.FC<Props> = (props) =>
{
  return (
    <Container style={props.wrapperStyle}>
      <Text>{props.no}</Text>
      <Text>{props.item.bank}</Text>
      <Text>{props.item.accountNumber}</Text>
      <Text>{props.item.accountHolder}</Text>
      <Text>{props.item.amount}</Text>
    </Container>
  );
};

export default CashBackListItem;
