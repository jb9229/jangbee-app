import React from 'react';
import styled from 'styled-components';
import JBTextItem from '../molecules/JBTextItem';
import convertWorkStr from '../../constants/WorkPeriodConverter';
import Card from '../molecules/CardUI';
import JBTag from '../molecules/JBTag';
import { formatTelnumber } from '../../utils/StringUtils';

const TagWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default class ClientMatchedWorkItem extends React.PureComponent {
  render() {
    const { item, renderCommand, phoneNumber } = this.props;

    return (
      <Card Finished={item.workState === 'CLOSED' && item.firmEstimated}>
        <TagWrap>
          {item.modelYearLimit && <JBTag name={`${item.modelYearLimit}년식이상`} />}
          {item.licenseLimit && <JBTag name={`${item.licenseLimit}필요`} />}
          {item.nondestLimit && <JBTag name={`비파괴검사 ${item.nondestLimit}개월이하`} />}
          {item.careerLimit && <JBTag name={`${item.careerLimit}년경력이상`} />}
        </TagWrap>
        <JBTextItem title="장비" value={item.equipment} small row />
        {phoneNumber && (
          <JBTextItem title="전화번호" value={formatTelnumber(item.phoneNumber)} small row />
        )}
        <JBTextItem
          title="기간"
          value={`${item.startDate} ~ ${item.endDate}(${convertWorkStr(item.period)})`}
          small
          row
        />
        <JBTextItem title="현장주소" value={item.address} secondeValue={item.addressDetail} small />
        <JBTextItem title="요청내용" value={item.detailRequest} small />
        {renderCommand()}
      </Card>
    );
  }
}
