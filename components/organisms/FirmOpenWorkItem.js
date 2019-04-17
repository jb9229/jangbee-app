import React from 'react';
import Styled from 'styled-components/native';
import JBTextItem from '../molecules/JBTextItem';
import convertWorkStr from '../../constants/WorkPeriodConverter';
import JBButton from '../molecules/JBButton';

const Container = Styled.View`
  flex: 1;
`;
const CommWrap = Styled.View`
  flexDirection: row;
`;
const ApplyingText = Styled.Text``;

export default class FirmOpenWorkItem extends React.PureComponent {
  render() {
    const { item, applyWork, acceptWork } = this.props;

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
        {item.workState === 'OPEN' && !item.applied && (
          <JBButton title="지원하기" onPress={() => applyWork(item.id)} small />
        )}
        {item.workState === 'OPEN' && item.applied && <ApplyingText>지원중..</ApplyingText>}
        {item.workState === 'SELECTED' && (
          <CommWrap>
            <JBButton title="포기하기" small />
            <JBButton title="수락하기" onPress={acceptWork} small />
          </CommWrap>
        )}
      </Container>
    );
  }
}
