import { ActivityIndicator } from 'react-native';
import React from 'react';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Message = styled.Text`
  font-size: 15;
  font-family: ${fonts.batang};
  margin-bottom: 20;
  color: ${colors.pointDark};
`;

interface Props {
  loadingMSG?: string;
  size?: number;
}

export default function Indicator(props: Props): React.ReactElement {
  return (
    <Container>
      <Message>{props.loadingMSG || '정보를 불러오는 중..'}</Message>
      <ActivityIndicator size={props.size || 28} color={colors.indicator} />
    </Container>
  );
}
