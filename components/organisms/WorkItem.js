import React from 'react';
import JBTextItem from '../molecules/JBTextItem';
import convertWorkStr from '../../constants/WorkPeriodConverter';
import Card from '../molecules/CardUI';

export default class ClientMatchedWorkItem extends React.PureComponent {
  render() {
    const { item, renderCommand } = this.props;

    return (
      <Card Finished={item.workState === 'CLOSED' && item.firmEstimated}>
        <JBTextItem title="장비" value={item.equipment} small row />
        <JBTextItem
          title="시작일(기간)"
          value={`${item.startDate}(${convertWorkStr(item.period)})`}
          small
          row
        />
        <JBTextItem title="현장주소" value={`${item.address}`} small />
        <JBTextItem title="요청내용" value={`${item.detailRequest}`} small />
        {renderCommand()}
      </Card>
    );
  }
}
