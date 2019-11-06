import * as React from 'react';

import styled from 'styled-components/native';

const Container = styled.View``;
const TopWrap = styled.View``;
const CntBoardTO = styled.TouchableOpacity``;
const Title = styled.Text``;
const CountText = styled.Text``;

interface Props {
  data: [];
  onClick: (i: number) => void;
}
export default function countBoard(props: Props) {
  return (
    <Container>
      {props.data.forEach((element, index) => {
        <CntBoardTO onPress={() => props.onClick(index)}>
          <TopWrap>
            <Title>{element.title}</Title>
          </TopWrap>
          <CountText>{element.count}</CountText>
        </CntBoardTO>;
      })}
    </Container>
  );
}
