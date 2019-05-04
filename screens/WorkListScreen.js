import React from 'react';
import {
  Alert, StyleSheet, Dimensions, View,
} from 'react-native';
import { SceneMap, TabView, TabBar } from 'react-native-tab-view';
import * as api from '../api/api';
import { withLogin } from '../contexts/LoginProvider';
import ClientEstimateFirmModal from '../components/ClientEstimateFirmModal';
import WorkUpdateModal from '../components/WorkUpdateModal';
import ClientOpenWorkList from '../components/ClientOpenWorkList';
import ClientMatchedWorkList from '../components/ClientMatchedWorkList';
import JBButton from '../components/molecules/JBButton';
import { notifyError } from '../common/ErrorNotice';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import FirmDetailModal from '../components/FirmDetailModal';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.batangLight,
  },
  tabBarIndicator: {
    backgroundColor: colors.point,
  },
  tabBar: {
    backgroundColor: colors.point2,
  },
  tabBarLabel: {
    fontFamily: fonts.titleMiddle,
    fontWeight: 'bold',
  },
});

class ClientWorkListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleEstimateModal: false,
      isVisibleEditWorkModal: false,
      isVisibleDetailModal: false,
      isOpenWorkListEmpty: undefined,
      isMatchedWorkListEmpty: undefined,
      openWorkListRefreshing: false,
      matchedWorkListRefreshing: false,
      index: 0,
      routes: [{ key: 'first', title: '모집중인 일감' }, { key: 'second', title: '모집된 일감' }],
      openWorkList: [],
      matchedWorkList: undefined,
    };
  }

  componentDidMount() {
    // TODO did mount 후에는 setsate 안하게
    this.setOpenWorkListData();
  }

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.navigation.state;

    if (params && params.refresh) {
      this.setOpenWorkListData();
    }
  }

  /**
   * Tab View 변경함수
   */
  changeTabView = (index) => {
    const { matchedWorkList } = this.state;

    if (index === 1 && matchedWorkList === undefined) {
      this.setMatchedWorkListData();
    }

    this.setState({ index });
  };

  /**
   * 2시간 지난후 지원자선택 취소 확인함수
   */
  confirmCancelSelFirm = (workId) => {
    Alert.alert('지원자 선택 취소', '해당 업체가 응답이 없습니다, 새로운 지원자를 선택해 주제요', [
      { text: '취소', onPress: () => {} },
      { text: '지원자 선택 취소', onPress: () => this.calcelSelFirm(workId) },
    ]);
  };

  /**
   * 2시간 지난후 지원자선택 취소 함수
   */
  calcelSelFirm = (workId) => {
    api
      .cancelSelFirm(workId)
      .then((resBody) => {
        if (resBody) {
          this.setOpenWorkListData();
          return;
        }

        notifyError('지원자 선택취소 문제발생', '지원자 선택 취소를 다시 시도해 주세요');
        this.setOpenWorkListData();
      })
      .catch(error => notifyError(error.name, error.message));
  };

  /**
   * 업체평가 요청 함수
   */
  estimateFirm = () => {};

  /**
   * 리스트 데이터 설정함수
   */
  setOpenWorkListData = () => {
    const { user } = this.props;

    api
      .getClientOpenWorkList(user.uid)
      .then((resBody) => {
        if (resBody && resBody.length > 0) {
          this.setState({
            openWorkList: resBody,
            isOpenWorkListEmpty: false,
            openWorkListRefreshing: false,
          });

          return;
        }

        this.setState({ isOpenWorkListEmpty: true, openWorkListRefreshing: false });
      })
      .catch(error => notifyError(error.name, error.message));
  };

  /**
   * 매칭된 일감리스트 설정함수
   */
  setMatchedWorkListData = () => {
    const { user } = this.props;

    api
      .getClientMatchedWorkList(user.uid)
      .then((resBody) => {
        if (resBody && resBody.length > 0) {
          this.setState({
            matchedWorkList: resBody,
            isMatchedWorkListEmpty: false,
            matchedWorkListRefreshing: false,
          });

          return;
        }

        this.setState({ isMatchedWorkListEmpty: true, matchedWorkListRefreshing: false });
      })
      .catch(error => notifyError(error.name, error.message));
  };

  /**
   * 일감내용 수정 요청함수
   */
  updateWork = (updateData) => {
    api
      .updateWork(updateData)
      .then((resBody) => {
        if (resBody) {
          this.setOpenWorkListData();
          return;
        }

        notifyError('일감수정 문제 발생', '일감 수정을 다시 시도해 주세요');
        this.setOpenWorkListData();
      })
      .catch(error => notifyError(error.name, error.message));
  };

  render() {
    const { navigation } = this.props;
    const {
      isVisibleEstimateModal,
      isVisibleEditWorkModal,
      isVisibleDetailModal,
      isOpenWorkListEmpty,
      estiWorkId,
      matchedfirmAccId,
      matchedWorkList,
      isMatchedWorkListEmpty,
      openWorkList,
      openWorkListRefreshing,
      matchedWorkListRefreshing,
      editWork,
    } = this.state;

    const renderOpenWorkList = () => (
      <ClientOpenWorkList
        list={openWorkList}
        handleRefresh={() => this.setState({ openWorkListRefreshing: true }, () => this.setOpenWorkListData())
        }
        refreshing={openWorkListRefreshing}
        isListEmpty={isOpenWorkListEmpty}
        selectFirm={workId => navigation.navigate('AppliFirmList', { workId })}
        cancelSelFirm={this.confirmCancelSelFirm}
        registerWork={() => navigation.navigate('WorkRegister')}
        editWork={work => this.setState({ editWork: work, isVisibleEditWorkModal: true })}
      />
    );

    const renderMatchedWorkList = () => (
      <ClientMatchedWorkList
        list={matchedWorkList}
        handleRefresh={() => this.setState({ matchedWorkListRefreshing: true }, () => this.setMatchedWorkListData())
        }
        refreshing={matchedWorkListRefreshing}
        isListEmpty={isMatchedWorkListEmpty}
        estimateFirm={workId => this.setState({ isVisibleEstimateModal: true, estiWorkId: workId })}
        openMatchedFirmInfo={matchedAccId => this.setState({ matchedfirmAccId: matchedAccId, isVisibleDetailModal: true })
        }
      />
    );

    return (
      <View style={styles.Container}>
        <ClientEstimateFirmModal
          isVisibleModal={isVisibleEstimateModal}
          closeModal={() => this.setState({ isVisibleEstimateModal: false })}
          completeAction={() => this.setMatchedWorkListData()}
          workId={estiWorkId}
        />
        <WorkUpdateModal
          editWork={editWork}
          completeAction={this.updateWork}
          isVisibleModal={isVisibleEditWorkModal}
          closeModal={() => this.setState({ isVisibleEditWorkModal: false })}
        />
        <FirmDetailModal
          isVisibleModal={isVisibleDetailModal}
          accountId={matchedfirmAccId}
          closeModal={() => this.setState({ isVisibleDetailModal: false })}
        />
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: renderOpenWorkList,
            second: renderMatchedWorkList,
          })}
          onIndexChange={this.changeTabView}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={styles.tabBarIndicator}
              style={styles.tabBar}
              labelStyle={styles.tabBarLabel}
            />
          )}
        />

        <JBButton
          title="일감 등록하기"
          onPress={() => navigation.navigate('WorkRegister')}
          size="full"
          Primary
        />
      </View>
    );
  }
}

export default withLogin(ClientWorkListScreen);
