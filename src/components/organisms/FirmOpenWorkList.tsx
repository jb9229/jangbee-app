import { FlatList } from 'react-native';
import JBActIndicator from 'molecules/JBActIndicator';
import JBButton from 'molecules/JBButton';
import JBEmptyView from 'organisms/JBEmptyView';
import React from 'react';
import WorkCommText from 'molecules/WorkCommTextUI';
import WorkCommWrap from 'molecules/WorkCommWrapUI';
import WorkItem from 'organisms/WorkItem';
import styled from 'styled-components/native';
import { useFirmWorkProvider } from 'src/container/firmwork/FirmWorkProvider';
import { useLoginContext } from 'src/contexts/LoginContext';

const Container = styled.View`
  flex: 1;
`;
const CommWrap = styled.View`
  flex-direction: row;
`;
const OpenWorkList = styled(FlatList)`
`;

const FirmWorkingList: React.FC = () =>
{
  const { user } = useLoginContext();
  const { refreshing, openWorkList, refetchOpenWorkList, applyWork, applyFirmWork, acceptWork, abandonWork } = useFirmWorkProvider();

  if (!openWorkList)
  {
    return <JBActIndicator title="정보를 불러오는 중.." size={35} />;
  }

  if (openWorkList.length === 0)
  {
    return (
      <Container>
        <JBEmptyView
          title="현재 일감 리스트가 비어 있습니다,"
          subTitle="다시 조회해 보세요"
          refresh={refetchOpenWorkList}
        />
      </Container>
    );
  }

  return (
    <OpenWorkList
      data={openWorkList}
      renderItem={({ item }): React.ReactElement =>
        (
          <WorkItem
            item={item}
            renderCommand={(): React.ReactElement => renderCommand(item, user, applyWork, applyFirmWork, acceptWork, abandonWork)}
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

const renderCommand = (item, user, applyWork, applyFirmWork, acceptWork, abandonWork): React.ReactElement =>
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
      {item.workState === 'OPEN' &&
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
        <WorkCommText text="매칭중.." />
      )}
      {item.workState === 'SELECTED' && (
        <CommWrap>
          <JBButton
            title="포기하기"
            onPress={(): void => abandonWork(item.id)}
            size="small"
            Secondary
          />
          <JBButton
            title="수락하기"
            onPress={(): void => acceptWork(item)}
            size="small"
            Primary
          />
        </CommWrap>
      )}
    </WorkCommWrap>
  );
};

export default FirmWorkingList;
