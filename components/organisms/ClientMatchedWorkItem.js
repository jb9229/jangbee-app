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
const WorkingText = Styled.Text``;

export default class ClientMatchedWorkItem extends React.PureComponent {
  render() {
    const { item, estimateFirm, openMatchedFirmInfo } = this.props;

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
          {item.workState === 'MATCHED' && (
            <JBButton
              title="매칭된 업체정보 보기"
              onPress={() => openMatchedFirmInfo(item.matchedAccId)}
              size="small"
              underline
            />
          )}
          {item.workState === 'WORKING' && <WorkingText>시작됨</WorkingText>}
          {item.workState === 'CLOSED' && !item.firmEstimated && (
            <CommWrap>
              <JBButton title="업체평가하기" onPress={() => estimateFirm(item.id)} size="small" />
            </CommWrap>
          )}
          {item.workState === 'CLOSED' && item.firmEstimated && <WorkingText>일 종료</WorkingText>}
        </StateWrap>
      </Container>
    );
  }
}
