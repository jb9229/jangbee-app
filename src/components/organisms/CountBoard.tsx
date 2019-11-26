import * as React from 'react';

import colors from 'constants/Colors';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  height: 100%;
  overflow: hidden;
  background-color: ${colors.point2Batang};
  padding: 20px 10px;

`;
const CntBoardTO = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  ${(props: StyledProps) => props.index && `
    border-left-width: 3;
    border-style: dashed;
    border-color: ${colors.batangLight};
  `}
`;
const TitleWrap = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const CounterWrap = styled.View`
  flex: 2;
  align-items: center;
  justify-content: center;
`;
const Title = styled.Text`
  font-weight: bold;
  font-size: 18;
  color: ${colors.pointDark};
`;
const CountText = styled.Text`
  color: ${colors.batangDark};
  font-size: 28;
`;

interface StyledProps {
  index: number;
}
interface CntBoardProp {
  onClick: (i: number) => void;
  title: string;
  count: number;
}

interface Props {
  data: Array<CntBoardProp>;
}

export default function countBoard(props: Props) {
  if(!props.data) return <Container></Container>
  return (
    <Container>
      {props.data.map((element: CntBoardProp, index: number) => (
          <CntBoardTO onPress={() => element.onClick(index)} key={index} index={index}>
            <TitleWrap>
              <Title>{element.title}</Title>
            </TitleWrap>
            <CounterWrap>
              <CountText>{element.count}</CountText>
            </CounterWrap>
          </CntBoardTO>
        ))}
    </Container>
  );
}
