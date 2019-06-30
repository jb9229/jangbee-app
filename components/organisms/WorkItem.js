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

export default class WorkItem extends React.PureComponent {
  render() {
    const {
      item, renderCommand, phoneNumber, hideAddress, cardColor
    } = this.props;

    return (
      <Card Finished={item.workState === 'CLOSED' && item.firmEstimated} bgColor={cardColor}>
        <TagWrap>
          {item.modelYearLimit ? <JBTag name={`${item.modelYearLimit}년식이상`} /> : null}
          {item.licenseLimit ? <JBTag name={`${item.licenseLimit}필요`} /> : null}
          {item.nondestLimit ? <JBTag name={`비파괴검사 ${item.nondestLimit}개월이하`} /> : null}
          {item.careerLimit ? <JBTag name={`${item.careerLimit}년경력이상`} /> : null}
        </TagWrap>
        <JBTextItem title="장비" value={item.equipment} small titleSize={70} row />
        {phoneNumber && (
          <JBTextItem
            title="전화번호"
            value={formatTelnumber(item.phoneNumber)}
            small
            titleSize={70}
            row
          />
        )}
        <JBTextItem
          title="기간"
          value={`${item.startDate} ~ ${item.endDate}(${convertWorkStr(item.period)})`}
          small
          titleSize={70}
          row
        />
        {hideAddress ? (
          <JBTextItem title="현장주소" value={`${item.sidoAddr} ${item.sigunguAddr}`} small />
        ) : (
          <JBTextItem
            title="현장주소"
            value={item.address}
            secondeValue={item.addressDetail}
            small
          />
        )}
        <JBTextItem title="요청내용" value={item.detailRequest} small />
        {renderCommand()}
      </Card>
    );
  }
}
