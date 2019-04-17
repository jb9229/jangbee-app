import React from 'react';
import Styled from 'styled-components/native';
import JBTextItem from '../molecules/JBTextItem';
import convertWorkStr from '../../constants/WorkPeriodConverter';
import JBButton from '../molecules/JBButton';

const Container = Styled.View``;
const CommWrap = Styled.View`
  flexDirection: row;
`;
export default function FirmWorkingListItem({ item }) {
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
      {item.workState === 'OPEN' && <JBButton title="지원하기" small />}
      {item.workState === 'SELECTED' && (
        <CommWrap>
          <JBButton title="포기하기" small />
          <JBButton title="수락하기" small />
        </CommWrap>
      )}
    </Container>
  );
}
