import React from 'react';
import Styled from 'styled-components/native';
import JBTextItem from '../molecules/JBTextItem';
import convertWorkStr from '../../constants/WorkPeriodConverter';

const Container = Styled.View`
  flex: 1;
`;

const StateWrap = Styled.View`
  flex: 1;
  align-items: flex-end;
  margin: 3px 10px;
`;

const WorkingText = Styled.Text``;

export default class FirmMatchedWorkItem extends React.PureComponent {
  render() {
    const { item } = this.props;
    return (
      <Container>
        <JBTextItem title="장비" value={item.equipment} small row />
        <JBTextItem
          title="시작일(기간)"
          value={`${item.startDate}(${convertWorkStr(item.period)})`}
          small
          row
        />
        <JBTextItem title="현장주소" value={`${item.address}`} small />
        <JBTextItem title="요청내용" value={`${item.detailRequest}`} small />
        <StateWrap>{item.workState === 'WORKING' && <WorkingText>시작됨</WorkingText>}</StateWrap>
      </Container>
    );
  }
}
