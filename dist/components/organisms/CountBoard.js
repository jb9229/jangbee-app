import * as React from 'react';
import styled from 'styled-components/native';
const Container = styled.View `
  flex-direction: row;
  height: 100%;
  overflow: hidden;
`;
const CntBoardTO = styled.TouchableOpacity `
  flex: 1;
  border-width: 1;
  align-items: center;
`;
const TitleWrap = styled.View `
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1;
`;
const CounterWrap = styled.View `
  flex: 2;
  align-items: center;
  justify-content: center;
`;
const Title = styled.Text ``;
const CountText = styled.Text ``;
export default function countBoard(props) {
    console.log(props);
    return (<Container>
      {props.data.map((element, index) => (<CntBoardTO onPress={() => element.onClick(index)}>
          <TitleWrap>
            <Title>{element.title}</Title>
          </TitleWrap>
          <CounterWrap>
            <CountText>{element.count}</CountText>
          </CounterWrap>
        </CntBoardTO>))}
    </Container>);
}
//# sourceMappingURL=CountBoard.js.map