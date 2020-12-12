import { FlatList } from 'react-native';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import JBEmptyView from 'organisms/JBEmptyView';
import React from 'react';
import WorkCommText from 'molecules/WorkCommTextUI';
import WorkCommWrap from 'molecules/WorkCommWrapUI';
import WorkItem from 'organisms/WorkItem';
import moment from 'moment';

export default class ClientOpenWorkList extends React.PureComponent
{
  /**
   * 리스트 아이템 렌더링 함수
   */
  renderItem = ({ item }) => (
    <WorkItem
      item={item}
      renderCommand={() => this.renderCommand(item)}
      phoneNumber={item.phoneNumber}
    />
  );

  renderCommand = item =>
  {
    const { selectFirm, cancelSelFirm, editWork } = this.props;

    let afterThreeHour = '2시간';
    if (item.workState === 'SELECTED' && !item.overAcceptTime)
    {
      afterThreeHour = moment(item.selectNoticeTime)
        .add(2, 'hours')
        .format('MM/DD HH:mm');
    }

    return (
      <WorkCommWrap row>
        <JBButton
          title="편집"
          onPress={() => editWork(item)}
          size="small"
          underline
          Primary
        />

        {item.workState === 'OPEN' &&
          item.guarTimeExpire &&
          item.applicantCount === 0 && (
          <WorkCommText text="차주일감 시간만료됨" />
        )}
        {item.workState === 'OPEN' &&
          !item.guarTimeExpire &&
          item.applicantCount === 0 && <WorkCommText text="지원자 모집중..." />}
        {item.workState === 'OPEN' &&
          !item.guarTimeExpire &&
          item.applicantCount > 0 && (
          <JBButton
            title={`지원자 선택하기(${item.applicantCount}명)`}
            onPress={() => selectFirm(item.id)}
            size="small"
          />
        )}

        {item.workState === 'SELECTED' && item.overAcceptTime && (
          <JBButton
            title="지원자선택 취소하기"
            onPress={() => cancelSelFirm(item.id)}
            size="small"
          />
        )}
        {item.workState === 'SELECTED' && !item.overAcceptTime && (
          <WorkCommText text={`업체확인 대기중..(${afterThreeHour}까지)`} />
        )}
      </WorkCommWrap>
    );
  };

  render ()
  {
    const {
      isListEmpty,
      list,
      handleRefresh,
      refreshing,
      registerWork
    } = this.props;

    if (isListEmpty === undefined)
    {
      return <JBActIndicator title="정보를 불러오는 중.." size={35} />;
    }

    if (isListEmpty)
    {
      return (
        <JBEmptyView
          title="일감을 올리면, 배차 가능한 업체로부터"
          subTitle="전화를 받을 수 있습니다."
          actionName="새로고침"
          refresh={handleRefresh}
        />
      );
    }
    return (
      <FlatList
        data={list}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    );
  }
}
