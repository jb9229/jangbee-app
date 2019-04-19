import React from 'react';
import Styled from 'styled-components/native';
import JBTextItem from '../molecules/JBTextItem';
import convertWorkStr from '../../constants/WorkPeriodConverter';
import JBButton from '../molecules/JBButton';

const Container = Styled.View`
  flex: 1;
`;
const WorkingText = Styled.Text``;

export default class ClientOpenWorkItem extends React.PureComponent {
  render() {
    const { item, selectFirm } = this.props;

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
        {item.workState === 'OPEN' && item.applicantCount === 0 && (
          <WorkingText>지원자 모집중...</WorkingText>
        )}
        {item.workState === 'OPEN' && item.applicantCount > 0 && (
          <JBButton
            title={`지원자 선택하기(${item.applicantCount}명)`}
            onPress={() => selectFirm(item.id)}
            small
          />
        )}
        {item.workState === 'SELECTED' && (
          <WorkingText>업체확인 대기중..(확인 후 전화가 옵니다)</WorkingText>
        )}
      </Container>
    );
  }
}
