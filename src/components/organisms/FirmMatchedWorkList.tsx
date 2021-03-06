import * as React from 'react';

import { FlatList } from 'react-native';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import JBEmptyView from 'organisms/JBEmptyView';
import WorkCommText from 'molecules/WorkCommTextUI';
import WorkCommWrap from 'molecules/WorkCommWrapUI';
import WorkItem from 'organisms/WorkItem';
import { callSearchFirm } from 'common/CallLink';
import { useFirmWorkProvider } from 'src/container/firmwork/FirmWorkProvider';
import { useLoginContext } from 'src/contexts/LoginContext';

const FirmMatchedWorkList = (): React.ReactElement => {
  const { userProfile } = useLoginContext();
  /**
   * 리스트 아이템 렌더링 함수
   */
  const renderItem = ({ item }): React.ReactElement => (
    <WorkItem
      item={item}
      renderCommand={(): React.ReactElement => renderCommand(item)}
      phoneNumber={item.phoneNumber}
    />
  );

  const renderCommand = (item): React.ReactElement => {
    return (
      <WorkCommWrap>
        {(item.workState === 'MATCHED' || item.workState === 'WORKING') && (
          <JBButton
            title={
              item.workState === 'WORKING'
                ? '전화걸기(배차 시작됨)'
                : '전화걸기'
            }
            onPress={(): void =>
              callSearchFirm(
                item.accountId,
                item.phoneNumber,
                userProfile.uid,
                userProfile.phoneNumber
              )
            }
            size="small"
          />
        )}
        {item.workState === 'CLOSED' && !item.firmEstimated && (
          <WorkCommText text="종료됨(평가 대기중..)" />
        )}
        {item.workState === 'CLOSED' && item.firmEstimated && (
          <WorkCommText text="종료됨" />
        )}
      </WorkCommWrap>
    );
  };

  const {
    matchedWorkList,
    refetchMatchedWorkList,
    matchedRefreshing,
  } = useFirmWorkProvider();
  // const { isListEmpty, list, handleRefresh, refreshing } = this.props;

  if (!matchedWorkList) {
    return <JBActIndicator title="정보를 불러오는 중.." size={35} />;
  }

  if (matchedWorkList.length === 0) {
    return (
      <JBEmptyView
        title="매칭된 일감 리스트가 비어 있습니다,"
        subTitle="다시 조회해 보세요"
        refresh={refetchMatchedWorkList}
      />
    );
  }

  return (
    <FlatList
      data={matchedWorkList}
      renderItem={(item): React.ReactElement => renderItem(item)}
      keyExtractor={(item, index): string => index.toString()}
      onRefresh={refetchMatchedWorkList}
      refreshing={matchedRefreshing}
    />
  );
};

export default FirmMatchedWorkList;
