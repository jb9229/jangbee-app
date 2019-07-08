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
import colors from '../constants/Colors';
import fonts from '../constants/Fonts';
import JBButton from '../components/molecules/JBButton';

const dispatchFee = '10000';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.batangLight,
  },
  scene: {
    flex: 1,
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

  componentWillReceiveProps(nextProps) {
    const { params } = nextProps.navigation.state;

    if (params && params.refresh) {
      this.setOpenWorkListData();
      this.setMatchedWorkListData();
    }
  }

  init = async () => {
    const { navigation, user, firmInfo } = this.props;

    if (firmInfo.equipment) {
      this.setState({ myEquipment: firmInfo.equipment }, () => this.setOpenWorkListData());
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
  acceptWork = (couponSelected, fintechUseNum) => {
    const { user } = this.props;
    const { acceptWorkId } = this.state;

    const acceptData = {
      workId: acceptWorkId,
      accountId: user.uid,
      coupon: couponSelected,
    };

    api
      .acceptWork(acceptData)
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
        if (!couponSelected) {
          this.cancelDispatchFee(fintechUseNum);
        }
        this.setOpenWorkListData();
      })
      .catch((error) => {
        notifyError(error.name, error.message);
      });
  };

  acceptWorkUsingCoupon = () => {
    const { acceptWorkId } = this.state;

    api
      .acceptCouponWork(acceptWorkId)
      .then((resBody) => {
        if (resBody) {
          this.setOpenWorkListData();
          this.setMatchedWorkListData();
          return;
        }
        this.setOpenWorkListData();
      })
      .catch((error) => {
        notifyError(error.name, error.message);
      });
  }

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

  /**
   * 차주 일감지원하기 요청 함수
   */
  applyFirmWork = (couponSelected, fintechUseNum) => {
    const { user, userProfile } = this.props;
    const { acceptWorkId } = this.state;

    const applyData = {
      authToken: userProfile.obAccessToken,
      fintechUseNum,
      workId: acceptWorkId,
      accountId: user.uid,
      coupon: couponSelected,
    };

    api
      .applyFirmWork(applyData)
      .then((resBody) => {
        if (resBody) {
          this.setOpenWorkListData();
        }
      })
      .catch((error) => {
        notifyError(error.name, error.message);
        this.setOpenWorkListData();
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

  confirmApplyWork = (workId) => { // (매칭이된다면, 5천원의 결제 후 배차 할 수 있습니다)
    Alert.alert(
      '해당 날짜와 장소에 배차 가능하십니까?',
      '2019.7월 중순까지 [무료 일감수락쿠폰]을 선택해서 지원해 보세요\n\n지원 후, 장비사용 고객의 선택을 기다려야 합니다\n\n※ 베타버전에도 정식서비스와 똑같이 사용해 볼수 있게, 계좌등록과정을 빼지 않았습니다',
      [
        { text: '취소', onPress: () => {} },
        { text: '지원하기', onPress: () => this.applyWork(workId) },
      ],
    );
  };

  confirmApplyFirmWork = (work) => { // '다른 차주가 올린 일감은, 선착순으로 한 업체만 매칭비 결재와 동시에 바로 매칭됩니다.',
    const { firmInfo } = this.props;

    if (firmInfo && firmInfo.modelYear && Number(firmInfo.modelYear) < Number(work.modelYearLimit)) {
      Alert.alert('죄송합니다, 지원할 수 없는 일감입니다', `${work.modelYearLimit}년식이상을 요청한 일감으로 지원할 수 없습니다(보유장비: ${firmInfo.modelYear}년식)`);

      return;
    }

    Alert.alert(
      '해당 날짜와 장소에 배차 가능하십니까?',
      '2019.7월 중순까지 [무료 일감수락쿠폰]을 선택해서 지원해 보세요\n\n차주일감은 선착순 한업체만 바로매칭 됩니다\n\n※ 베타버전에도 정식서비스와 똑같이 사용해 볼수 있게, 계좌등록과정을 빼지 않았습니다',
      [
        { text: '취소', onPress: () => {} },
        { text: '지원하기', onPress: () => this.setState({ isVisibleAccSelModal: true, acceptWorkId: work.id, withdrawCompleteFnc: this.applyFirmWork }) },
      ],
    );
  };

  confirmAcceptWork = (workId) => {
    Alert.alert(
      '매칭비 자동이체 후, 매칭이 완료 됩니다.',
      '매칭 후, 매칭된 일감(오른쪽 상단 메뉴)화면에서 꼭! [전화걸기]통해 고객과 최종 협의하세요.',
      [
        { text: '취소', onPress: () => {} },
        { text: '포기하기', onPress: () => this.abandonWork(workId) },
        {
          text: '결제하기',
          onPress: () => this.setState({ isVisibleAccSelModal: true, acceptWorkId: workId, withdrawCompleteFnc: this.withdrawDispatchFee }),
        },
      ],
      { cancelabel: false },
    );
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
  withdrawDispatchFee = (couponSelected, fintechUseNum) => {
    const { userProfile } = this.props;
    const { acceptWorkId } = this.state;

    if (couponSelected) {
      this.acceptWork(couponSelected, fintechUseNum);
      return;
    }

    // 지원비 이체
    api
      .transferWithdraw(userProfile.obAccessToken, fintechUseNum, dispatchFee, '장비콜 배차비 출금')
      .then((res) => {
        if (res && res.rsp_code && res.rsp_code === 'A0000') {
          this.acceptWork(couponSelected, fintechUseNum);
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
      withdrawCompleteFnc,
    } = this.state;
    const { user, navigation } = this.props;

    const renderOpenWorkList = () => (
      <FirmOpenWorkList
        list={openWorkList}
        handleRefresh={() => this.setState({ openWorkListRefreshing: true }, () => this.setOpenWorkListData())
        }
        refreshing={openWorkListRefreshing}
        isListEmpty={isOpenWorkListEmpty}
        applyWork={this.confirmApplyWork}
        applyFirmWork={this.confirmApplyFirmWork}
        acceptWork={this.confirmAcceptWork}
        abandonWork={this.confirmAbandonWork}
        accountId={user.uid}
      />
    );

    const renderMatchedWorkList = () => (
      <FirmMatchedWorkList
        list={matchedWorkList}
        handleRefresh={() => this.setState({ matchedWorkListRefreshing: true }, () => this.setMatchedWorkListData())
        }
        refreshing={matchedWorkListRefreshing}
        isListEmpty={isMatchedWorkListEmpty}
      />
    );
    return (
      <View style={styles.Container}>
        <OpenBankAccSelectModal
          isVisibleModal={isVisibleAccSelModal}
          closeModal={() => this.setState({ isVisibleAccSelModal: false })}
          completeSelect={(fintechUseNum, couponSelected) => { withdrawCompleteFnc(couponSelected, fintechUseNum); }}
          accountId={user.uid}
          actionName="결제방법 선택하기"
          mode="COUPON_MODE"
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
        <JBButton
          title="차주 일감 등록하기"
          onPress={() => navigation.navigate('WorkRegister', { firmRegister: true })}
          size="full"
          Primary
        />
      </View>
    );
  }
}

export default withLogin(FirmWorkListScreen);
