import { FlatList } from 'react-native';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import JBEmptyView from 'organisms/JBEmptyView';
import React from 'react';
import Styled from 'styled-components/native';
import WorkCommText from 'molecules/WorkCommTextUI';
import WorkCommWrap from 'molecules/WorkCommWrapUI';
import WorkItem from 'organisms/WorkItem';
import { useFirmWorkProvider } from 'src/container/firmwork/FirmWorkProvider';
import { useLoginProvider } from 'src/contexts/LoginProvider';

const CommWrap = Styled.View`
  flexDirection: row;
`;

interface Props {
  list: Array<object>;
}

const FirmWorkingList: React.FC<Props> = (props) =>
{
  const { user } = useLoginProvider();
  const { refreshing, refetchOpenWorkList, applyWork } = useFirmWorkProvider();

  if (!props.list)
  {
    return <JBActIndicator title="정보를 불러오는 중.." size={35} />;
  }

  if (props.list.length === 0)
  {
    return (
      <JBEmptyView
        title="현재 일감 리스트가 비어 있습니다,"
        subTitle="다시 조회해 보세요"
        refresh={refetchOpenWorkList}
      />
    );
  }

  return (
    <FlatList
      data={props.list}
      renderItem={({ item }): React.ReactElement =>
        (
          <WorkItem
            item={item}
            renderCommand={(): React.ReactElement => renderCommand(item, user, applyWork)}
            hideAddress
            cardColor="white"
          />
        )}
      keyExtractor={(item, index) => index.toString()}
      onRefresh={refetchOpenWorkList}
      refreshing={refreshing}
    />
  );
};

const renderCommand = (item, user, applyWork, acceptWork): React.ReactElement =>
{
  if (user && item.firmRegister && item.accountId === user.uid)
  {
    return (
      <WorkCommWrap>
        <WorkCommText text="내가올린 일감" />
      </WorkCommWrap>
    );
  }

  return (
    <WorkCommWrap>
      {item.workState === 'OPEN' && !item.applied && !item.firmRegister && (
        <JBButton
          title="지원하기"
          onPress={(): void => applyWork(item.id)}
          size="small"
        />
      )}
      {item.workState === '' &&
        !item.applied &&
        item.firmRegister &&
        !item.guarTimeExpire && (
        <JBButton
          title="차주일감 지원하기(선착순 바로매칭)"
          onPress={(): void => applyFirmWork(item)}
          size="small"
        />
      )}
      {item.workState === 'OPEN' &&
        !item.applied &&
        item.firmRegister &&
        item.guarTimeExpire && (
        <WorkCommText text="차주일감 매칭시간 만료됨" />
      )}
      {item.workState === 'OPEN' && item.applied && (
        <WorkCommText text="지원중.." />
      )}
      {item.workState === 'SELECTED' && (
        <CommWrap>
          <JBButton
            title="포기하기"
            onPress={() => abandonWork(item.id)}
            size="small"
            Secondary
          />
          <JBButton
            title="수락하기"
            onPress={() => acceptWork(item.id)}
            size="small"
            Primary
          />
        </CommWrap>
      )}
    </WorkCommWrap>
  );
};

export default FirmWorkingList;
