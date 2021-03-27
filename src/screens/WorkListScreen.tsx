import * as React from 'react';
import * as api from 'src/api/api';

import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import ClientEstimateFirmModal from 'templates/ClientEstimateFirmModal';
import ClientMatchedWorkList from 'organisms/ClientMatchedWorkList';
import ClientOpenWorkList from 'organisms/ClientOpenWorkList';
import { DefaultNavigationProps } from 'src/types';
import FirmDetailModal from 'src/components/templates/FirmDetailModal';
import JBButton from 'molecules/JBButton';
import WorkUpdateModal from 'templates/WorkUpdateModal';
import colors from 'constants/Colors';
import fonts from 'constants/Fonts';
import { noticeUserError } from 'src/container/request';
import styled from 'styled-components/native';
import { useLoginContext } from 'src/contexts/LoginContext';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.batangLight,
  },
  tabBarIndicator: {
    backgroundColor: colors.point2,
  },
  tabBar: {
    backgroundColor: colors.batangDark,
  },
  tabBarLabel: {
    fontFamily: fonts.titleMiddle,
    fontWeight: 'bold',
    color: colors.point,
  },
});

const CommandWrap = styled.View``;

interface Props {
  navigation: DefaultNavigationProps;
}
const ClientWorkListScreen: React.FC<Props> = props => {
  const { userProfile } = useLoginContext();
  const [isVisibleEstimateModal, setVisibleEstimateModal] = React.useState(
    false
  );
  const [isVisibleEditWorkModal, setVisibleEditWorkModal] = React.useState(
    false
  );
  const [isVisibleDetailModal, setVisibleDetailModal] = React.useState(false);
  const [isOpenWorkListEmpty, setOpenWorkListEmpty] = React.useState(false);
  const [isMatchedWorkListEmpty, setMatchedWorkListEmpty] = React.useState(
    false
  );
  const [openWorkListRefreshing, setOpenWorkListRefreshing] = React.useState(
    false
  );
  const [
    matchedWorkListRefreshing,
    setMatchedWorkListRefreshing,
  ] = React.useState(false);
  const [openWorkList, setOpenWorkList] = React.useState(false);
  const [matchedWorkList, setMatchedWorkList] = React.useState(false);
  const [estiWorkId, setEstiWorkId] = React.useState<string>();
  const [editWork, setEditWork] = React.useState();
  const [matchedfirmAccId, setMatchedfirmAccId] = React.useState();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: '모집중인 일감' },
    { key: 'second', title: '모집된 일감' },
  ]);

  React.useEffect(() => {
    setOpenWorkListData();
    setOpenWorkListData();
    setMatchedWorkListData();
  }, [props.navigation.state]);

  /**
   * Tab View 변경함수
   */
  const changeTabView = index => {
    if (index === 1 && matchedWorkList === undefined) {
      setMatchedWorkListData();
    }

    setIndex(index);
  };

  /**
   * 2시간 지난후 지원자선택 취소 확인함수
   */
  const confirmCancelSelFirm = workId => {
    Alert.alert(
      '지원자 선택 취소',
      '해당 업체가 응답이 없습니다, 새로운 지원자를 선택해 주제요',
      [
        { text: '취소', onPress: () => {} },
        { text: '지원자 선택 취소', onPress: () => calcelSelFirm(workId) },
      ]
    );
  };

  /**
   * 2시간 지난후 지원자선택 취소 함수
   */
  const calcelSelFirm = workId => {
    api
      .cancelSelFirm(workId)
      .then(resBody => {
        if (resBody) {
          setOpenWorkListData();
          return;
        }

        noticeUserError(
          '지원자 선택취소 문제발생',
          '지원자 선택 취소를 다시 시도해 주세요'
        );
        setOpenWorkListData();
      })
      .catch(error => noticeUserError(error.name, error.message, user));
  };

  /**
   * 업체평가 요청 함수
   */
  const estimateFirm = () => {};

  /**
   * 리스트 데이터 설정함수
   */
  const setOpenWorkListData = () => {
    api
      .getClientOpenWorkList(userProfile.uid)
      .then(resBody => {
        if (resBody && resBody.length > 0) {
          setOpenWorkList(resBody);
          setOpenWorkListEmpty(false);
          setOpenWorkListRefreshing(false);

          return;
        }

        setOpenWorkListEmpty(true);
        setOpenWorkListRefreshing(false);
      })
      .catch(error => noticeUserError(error.name, error.message, user));
  };

  /**
   * 매칭된 일감리스트 설정함수
   */
  const setMatchedWorkListData = () => {
    api
      .getClientMatchedWorkList(userProfile.uid)
      .then(resBody => {
        if (resBody && resBody.length > 0) {
          setMatchedWorkList(resBody);
          setMatchedWorkListEmpty(false);
          setMatchedWorkListRefreshing(false);

          return;
        }

        setMatchedWorkListEmpty(true);
        setMatchedWorkListRefreshing(false);
      })
      .catch(error => noticeUserError(error.name, error.message, user));
  };

  /**
   * 일감내용 수정 요청함수
   */
  const updateWork = updateData => {
    api
      .updateWork(updateData)
      .then(resBody => {
        if (resBody) {
          setOpenWorkListData();
          return;
        }

        noticeUserError(
          '일감수정 문제 발생',
          '일감 수정을 다시 시도해 주세요',
          user
        );
        setOpenWorkListData();
      })
      .catch(error => noticeUserError(error.name, error.message, user));
  };

  const renderOpenWorkList = (): React.ReactElement => (
    <ClientOpenWorkList
      list={openWorkList}
      handleRefresh={(): void => {
        setOpenWorkListRefreshing(true);
        setOpenWorkListData();
      }}
      refreshing={openWorkListRefreshing}
      isListEmpty={isOpenWorkListEmpty}
      selectFirm={(workId): void => {
        props.navigation.navigate('AppliFirmList', { workId });
      }}
      cancelSelFirm={confirmCancelSelFirm}
      registerWork={(): void => props.navigation.navigate('WorkRegister')}
      editWork={(work): void => {
        setEditWork(work);
        setVisibleEditWorkModal(true);
      }}
    />
  );

  const renderMatchedWorkList = (): React.ReactElement => (
    <ClientMatchedWorkList
      list={matchedWorkList}
      handleRefresh={(): void => {
        setMatchedWorkListRefreshing(true);
        setMatchedWorkListData();
      }}
      refreshing={matchedWorkListRefreshing}
      isListEmpty={isMatchedWorkListEmpty}
      estimateFirm={(workId): void => {
        setVisibleEstimateModal(true);
        setEstiWorkId(workId);
      }}
      openMatchedFirmInfo={(matchedAccId): void => {
        setMatchedfirmAccId(matchedAccId);
        setVisibleDetailModal(true);
      }}
    />
  );

  return (
    <View style={styles.Container}>
      <ClientEstimateFirmModal
        isVisibleModal={isVisibleEstimateModal}
        closeModal={(): void => setVisibleEstimateModal(false)}
        completeAction={(): void => setMatchedWorkListData()}
        workId={estiWorkId}
      />
      <WorkUpdateModal
        editWork={editWork}
        completeAction={updateWork}
        isVisibleModal={isVisibleEditWorkModal}
        closeModal={(): void => setVisibleEditWorkModal(false)}
      />
      <FirmDetailModal
        isVisibleModal={isVisibleDetailModal}
        accountId={matchedfirmAccId}
        closeModal={(): void => setVisibleDetailModal(false)}
      />
      <TabView
        navigationState={{ index, routes }}
        sceneContainerStyle={{ flex: 1 }}
        renderScene={SceneMap({
          first: renderOpenWorkList,
          second: renderMatchedWorkList,
        })}
        onIndexChange={changeTabView}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props): React.ReactElement => (
          <TabBar
            {...props}
            indicatorStyle={styles.tabBarIndicator}
            style={styles.tabBar}
            labelStyle={styles.tabBarLabel}
          />
        )}
      />

      <CommandWrap>
        <JBButton
          title="일감 등록하기"
          onPress={(): void =>
            props.navigation.navigate('WorkRegister', { firmRegister: false })
          }
          size="full"
          Primary
        />
      </CommandWrap>
    </View>
  );
};

export default ClientWorkListScreen;
