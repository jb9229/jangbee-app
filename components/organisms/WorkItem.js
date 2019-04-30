import React from 'react';
import JBTextItem from '../molecules/JBTextItem';
import convertWorkStr from '../../constants/WorkPeriodConverter';
import Card from '../molecules/CardUI';
import { formatTelnumber } from '../../utils/StringUtils';

export default class ClientMatchedWorkItem extends React.PureComponent {
  render() {
    const { item, renderCommand, phoneNumber } = this.props;

    return (
      <Card Finished={item.workState === 'CLOSED' && item.firmEstimated}>
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
