import * as React from 'react';

import { CashBack, CashBackStatus } from 'src/container/cashback/type';
import { StyleProp, ViewStyle } from 'react-native';

import { numberWithCommas } from 'src/utils/NumberUtils';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-top: 10;
  padding-bottom: 5;
  border-bottom-width: 1;
  border-bottom-color: ${(props): string => props.theme.ColorBorderList};
`;
const NoText = styled.Text`
  flex: 1;
`;
const BankText = styled.Text`
  flex: 2;
`;
const AccountNumText = styled.Text`
  flex: 4;
`;
const AccountHolderText = styled.Text`
  flex: 3;
`;
const StatusText = styled.Text`
  flex: 2;
`;
const AmountText = styled.Text`
  flex: 3;
  text-align: center;
`;

interface Props {
  no: number;
  item: CashBack;
  wrapperStyle?: StyleProp<ViewStyle>;
}
const CashBackListItem: React.FC<Props> = (props) =>
{
  return (
    <Container style={props.wrapperStyle}>
      <NoText>{props.no}</NoText>
      <BankText>{props.item.bank.replace('은행', '')}</BankText>
      <AccountNumText>{props.item.accountNumber}</AccountNumText>
      <AccountHolderText>{props.item.accountHolder}</AccountHolderText>
      <StatusText>{props.item.status === CashBackStatus.ENROLL ? '신청됨' : '지불됨'}</StatusText>
      <AmountText>{`${numberWithCommas(props.item.amount)}원`}</AmountText>
    </Container>
  );
};

export default CashBackListItem;
