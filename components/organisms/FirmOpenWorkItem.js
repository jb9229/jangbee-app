import React from 'react';
import Styled from 'styled-components/native';
import JBTextItem from '../molecules/JBTextItem';
import convertWorkStr from '../../constants/WorkPeriodConverter';
import JBButton from '../molecules/JBButton';

const Container = Styled.View`
  flex: 1;
`;

const StateWrap = Styled.View`
  flex: 1;
  align-items: flex-end;
  margin: 3px 10px;
`;

const CommWrap = Styled.View`
  flexDirection: row;
`;
const ApplyingText = Styled.Text``;

export default class FirmOpenWorkItem extends React.PureComponent {
  render() {
    const {
      item, applyWork, acceptWork, abandonWork,
    } = this.props;

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
        <StateWrap>
          {item.workState === 'OPEN' && !item.applied && (
            <JBButton title="지원하기" onPress={() => applyWork(item.id)} size="small" />
          )}
          {item.workState === 'OPEN' && item.applied && <ApplyingText>지원중..</ApplyingText>}
          {item.workState === 'SELECTED' && (
            <CommWrap>
              <JBButton title="포기하기" onPress={() => abandonWork(item.id)} size="small" />
              <JBButton title="수락하기" onPress={() => acceptWork(item.id)} size="small" />
            </CommWrap>
          )}
        </StateWrap>
      </Container>
    );
  }
}
