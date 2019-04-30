import React from 'react';
import {
  Alert, Dimensions, StyleSheet, View,
} from 'react-native';
import { SceneMap, TabView, TabBar } from 'react-native-tab-view';
import * as api from '../api/api';
import { withLogin } from '../contexts/LoginProvider';
import OpenBankAccSelectModal from '../components/OpenBankAccSelectModal';
import FirmOpenWorkList from '../components/FirmOpenWorkList';
import FirmMatchedWorkList from '../components/FirmMatchedWorkList';
import { notifyError } from '../common/ErrorNotice';
import { getMyEquipment } from '../utils/AsyncStorageUtils';
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';

const dispatchFee = '3000';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
  tabBarIndicator: {
    backgroundColor: colors.point,
  },
  tabBar: {
    backgroundColor: colors.point2Dark,
  },
  tabBarLabel: {
    fontFamily: fonts.titleMiddle,
    fontWeight: 'bold',
  },
});

class FirmWorkListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenWorkListEmpty: undefined,
      isMatchedWorkListEmpty: undefined,
      isVisibleAccSelModal: false,
      openWorkListRefreshing: false,
      matchedWorkListRefreshing: false,
      myEquipment: undefined,
      index: 0,
      routes: [{ key: 'first', title: '진행중인 일감' }, { key: 'second', title: '매칭된 일감' }],
      openWorkList: [],
      matchedList: undefined,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { navigation, user } = this.props;
    const myEquipment = await getMyEquipment(user.uid);

    if (myEquipment) {
      this.setState({ myEquipment }, () => this.setOpenWorkListData());
    } else {
      Alert.alert(
        '보유장비 조회 문제',
        '내정보 -> 장비등록하기 또는 네트워크문제로 다시 시도해 주세요.',
        [
          { text: '다시 시도하기', onPress: () => this.init() },
          { text: '장비등록하러 가기', onPress: () => navigation.navigate('FirmMyInfo') },
        ],
        { cancelable: false },
      );
      this.setState({ isOpenWorkListEmpty: true });
    }
  };

  /**
   * 매칭된일감 포기 요청함수
   */
  abandonWork = (workId) => {
    const { user } = this.props;

    const abandonData = {
      workId,
      matchedAccId: user.uid,
    };

    api
      .abandonWork(abandonData)
      .then((result) => {
        if (result) {
          this.setOpenWorkListData();
        }
      })
      .catch(error => notifyError(error.name, error.message));
  };

  /**
   * 일감 매칭요청 수락하기 함수
   */
  acceptWork = (fintechUseNum) => {
    const { user } = this.props;
    const { acceptWorkId } = this.state;

    const applyData = {
      workId: acceptWorkId,
      accountId: user.uid,
    };

    api
      .acceptWork(applyData)
      .then((resBody) => {
        if (resBody) {
          this.setOpenWorkListData();
          this.setMatchedWorkListData();
          this.setState({ isVisibleAccSelModal: false });
          return;
        }
        Alert.alert(
          '배차하기 문제',
          '배차되지 않았습니다, 통장잔고 및 통장 1년인증 상태, 배차요청 3시간이 지났는지 리스트 리프레쉬 후 확인해 주세요',
        );
        this.cancelDispatchFee(fintechUseNum);
        this.setOpenWorkListData();
      })
      .catch((error) => {
        notifyError(error.name, error.message);
      });
  };

  /**
   * 일감지원하기 요청 함수
   */
  applyWork = (workId) => {
    const { user } = this.props;

    const applyData = {
      workId,
      accountId: user.uid,
    };

    api
      .applyWork(applyData)
      .then((resBody) => {
        if (resBody) {
          this.setOpenWorkListData();
        }
      })
      .catch((error) => {
        notifyError(error.name, error.message);
      });
  };

  changeTabView = (index) => {
    const { matchedWorkList } = this.state;

    if (index === 1 && matchedWorkList === undefined) {
      this.setMatchedWorkListData();
    }

    this.setState({ index });
  };

  cancelDispatchFee = (fintechUseNum) => {
    const { userProfile } = this.props;
    const { acceptWorkId } = this.state;

    // 배차 실패로 환불
    api
      .transferDeposit(
        userProfile.obAccessToken,
        fintechUseNum,
        dispatchFee,
        `장비콜일감 배차비 환불(${acceptWorkId})`,
        `장비콜일감 배차비 환불(${acceptWorkId})`,
      )
      .then((res) => {
        if (res && res.rsp_code && res.rsp_code === 'A0000') {
          Alert.alert('배차비 환불됨', '배차비를 정상 환불 했습니다.');
          return;
        }
        Alert.alert(
          '배차비 환불 문제',
          `네트워크 환경 확인 후 다시 시도해 주세요(${res.rsp_code}, ${res.rsp_message})`,
          [
            { text: '환불 다시 시도하기', onPress: () => this.cancelDispatchFee(fintechUseNum) },
            { text: '취소', onPress: () => {} },
          ],
          { cancelable: false },
        );
      })
      .catch((error) => {
        notifyError(
          '배차비 환불 문제',
          `네트워크 환경 확인 후 다시 시도해 주세요(${error.name}, ${error.message})`,
          [
            { text: '환불 다시 시도하기', onPress: () => this.cancelDispatchFee(fintechUseNum) },
            { text: '취소', onPress: () => {} },
          ],
          { cancelable: false },
        );
      });
  };

  /**
   * 매칭된 일감 포기 확인 함수
   */
  confirmAbandonWork = (workId) => {
    Alert.alert(
      '매칭된 일감 포기',
      '정말 포기 하시겠습니까?',
      [
        { text: '예', onPress: () => this.abandonWork(workId) },
        { text: '아니요', onPress: () => {} },
      ],
      { cancelabel: false },
    );
  };

  /**
   * 매칭된 일감리스트 설정함수
   */
  setMatchedWorkListData = () => {
    const { user } = this.props;
    const { myEquipment } = this.state;

    api
      .getFirmMatchedWorkList(myEquipment, user.uid)
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
   * 진행중인 일감리스트 데이터 설정함수
   */
  setOpenWorkListData = () => {
    const { user } = this.props;
    const { myEquipment } = this.state;

    api
      .getFirmOpenWorkList(myEquipment, user.uid)
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
   * 일감 매칭요청 수락하기 함수
   */
  withdrawDispatchFee = (fintechUseNum) => {
    const { userProfile } = this.props;
    const { acceptWorkId } = this.state;

    // 지원비 이체
    api
      .transferWithdraw(userProfile.obAccessToken, fintechUseNum, dispatchFee, '장비콜 배차비 출금')
      .then((res) => {
        if (res && res.rsp_code && res.rsp_code === 'A0000') {
          this.acceptWork(fintechUseNum);
          return;
        }
        notifyError(
          '배차비 출금 문제',
          `네트워크 환경확인 또는 통장잔액을 확인후 다시 시도해 주세요(${res.rsp_code}, ${
            res.rsp_message
          })`,
        );
      })
      .catch((error) => {
        notifyError(
          '배차비 출금 문제',
          `네트워크 환경확인 또는 통장잔액을 확인후 다시 시도해 주세요(${error.name}, ${
            error.message
          })`,
        );
      });
  };

  render() {
    const {
      isOpenWorkListEmpty,
      isMatchedWorkListEmpty,
      isVisibleAccSelModal,
      openWorkList,
      matchedWorkList,
      openWorkListRefreshing,
      matchedWorkListRefreshing,
    } = this.state;
    const { user } = this.props;

    const renderOpenWorkList = () => (
      <FirmOpenWorkList
        list={openWorkList}
        handleRefresh={() => this.setState({ openWorkListRefreshing: true }, () => this.setOpenWorkListData())
        }
        refreshing={openWorkListRefreshing}
        isListEmpty={isOpenWorkListEmpty}
        applyWork={this.applyWork}
        acceptWork={workId => this.setState({ isVisibleAccSelModal: true, acceptWorkId: workId })}
        abandonWork={this.confirmAbandonWork}
      />
    );

    const renderMatchedWorkList = () => (
      <View style={styles.scene}>
        <FirmMatchedWorkList
          list={matchedWorkList}
          handleRefresh={() => this.setState({ matchedWorkListRefreshing: true }, () => this.setMatchedWorkListData())
          }
          refreshing={matchedWorkListRefreshing}
          isListEmpty={isMatchedWorkListEmpty}
        />
      </View>
    );
    return (
      <View style={styles.Container}>
        <OpenBankAccSelectModal
          isVisibleModal={isVisibleAccSelModal}
          closeModal={() => this.setState({ isVisibleAccSelModal: false })}
          completeSelect={() => Alert.alert(
            '배차수락 후 전화연결 하기',
            '배차 수락후 매칭된 일감 -> 전화하기 버튼을 눌러 고객님과 통화를 통해 비용 및 세부사항를 꼭 협의해 주세요!!',
            [{ text: '확인', onPress: () => this.withdrawDispatchFee() }],
            { calcellable: false },
          )
          }
          accountId={user.uid}
          actionName="결제통장 선택"
          {...this.props}
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
      </View>
    );
  }
}

export default withLogin(FirmWorkListScreen);
