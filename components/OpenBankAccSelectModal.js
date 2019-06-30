import React from 'react';
import {
  FlatList, Modal, Picker, StyleSheet, View,
} from 'react-native';
import CloseButton from './molecules/CloseButton';
import JBButton from './molecules/JBButton';
import ListSeparator from './molecules/ListSeparator';
import OBAccount from './molecules/OBAccount';
import Coupon from './molecules/Coupon';
import JBText from './molecules/JBText';
import * as firebaseDB from '../utils/FirebaseUtils';
import * as api from '../api/api';
import JBActIndicator from './organisms/JBActIndicator';
import { notifyError } from '../common/ErrorNotice';
import JBEmptyView from './organisms/JBEmptyView';

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
  bgWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentsWrap: {
    backgroundColor: '#FFF',
    padding: 20,
  },
  couponListWrap: {
  },
  commWrap: {
    flexDirection: 'row',
  },
});

export default class OpenBankAccSelectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selFinUseNum: '',
      isLoadingCoupon: true,
      couponSelected: false,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { isVisibleModal, showFirmWorkCoupon } = nextProps;

    if (isVisibleModal) {
      if (showFirmWorkCoupon) {
        this.setFirmworkCoupon();
      }
      this.setOpenBankAccountList();
    }
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    const { selFinUseNum, couponSelected } = this.state;
    const { completeSelect, closeModal } = this.props;

    if (!couponSelected) {
      if (!selFinUseNum) {
        notifyError('유효성검사 에러', `[${selFinUseNum}] 계좌번호를 선택해 주세요`);
        return;
      }
    }

    completeSelect(selFinUseNum, couponSelected);
    closeModal();
  };


  onAccListItemPress = (fintechUseNum) => {
    this.setState({ selFinUseNum: fintechUseNum, couponSelected: false });
  };

  /**
   * 광고 결재할 계좌리스트 설정함수
   */
  setOpenBankAccountList = () => {
    const { accountId } = this.props;

    firebaseDB.getUserInfo(accountId).then((data) => {
      const fUserInfo = data.val();

      const { obAccessToken, obUserSeqNo } = fUserInfo;
      if (obAccessToken === undefined || obUserSeqNo === undefined) {
        this.setState({ isEmptyList: true });
        return;
      }

      api
        .getOBAccList(obAccessToken, obUserSeqNo, 'N', 'A')
        .then((userInfo) => {
          if (userInfo.res_cnt !== '0') {
            this.setState({ accList: userInfo.res_list, isEmptyList: false });
            return;
          }
          this.setState({ isEmptyList: true });
        })
        .catch((error) => {
          notifyError(
            '네트워크 문제가 있습니다, 다시 시도해 주세요.',
            `계좌리스트 조회 실패 -> [${error.name}] ${error.message}`,
          );

          this.setState({ isEmptyList: null });
        });
    });
  };

  /**
   * 차주일감 쿠폰 요청함수
   */
  setFirmworkCoupon = () => {
    const { accountId } = this.props;

    this.setState({ isLoadingCoupon: true });
    api
      .getCoupon(accountId)
      .then((coupon) => {
        if (coupon) {
          this.setState({ couponCnt: coupon.cpCount });
        }

        this.setState({ isLoadingCoupon: false });
      })
      .catch((error) => {
        notifyError(
          '네트워크 문제가 있습니다, 다시 시도해 주세요.',
          `쿠폰 조회 실패 -> [${error.name}] ${error.message}`,
        );

        this.setState({ isLoadingCoupon: false });
      });
  };

  selectFirmWorkCoupon = (selected) => {
    if (!selected) {
      this.setState({ couponSelected: !selected, selFinUseNum: '' });
    } else {
      this.setState({ couponSelected: !selected });
    }
  }

  render() {
    const {
      isVisibleModal, navigation, closeModal, reauthAfterAction, actionName, showFirmWorkCoupon,
    } = this.props;
    const {
      isEmptyList,
      isLoadingCoupon,
      accList,
      selFinUseNum,
      couponCnt,
      couponSelected,
    } = this.state;

    if (showFirmWorkCoupon && isLoadingCoupon) {
      return (
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <JBActIndicator title="쿠폰을 불러오는중.." size={35} />
        </Modal>
      );
    }

    if (isEmptyList === undefined) {
      return (
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <JBActIndicator title="통장리스트 불러오는중.." size={35} />
        </Modal>
      );
    }

    if (isEmptyList === null) {
      return (
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <JBEmptyView
            title="통장리스트 호출에 문제가 있습니다,"
            subTitle="네트워크 환경 확인하여 재시도 후, 문제가 지속되면 관리자에게 문의(내정보 -> 메일문의)해주세요."
            actionName="재시도하기"
            refresh={() => this.setOpenBankAccountList()}
          />
        </Modal>
      );
    }

    if (isEmptyList) {
      return (
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <View style={styles.bgWrap}>
            <View style={styles.contentsWrap}>
              <CloseButton onClose={() => closeModal()} />
              <JBEmptyView
                title="결재 통장리스트가 비어 있습니다."
                subTitle="결제계좌 등록/재인증을 진행해 주세요."
                actionName="통장 등록하기"
                refresh={() => {
                  closeModal();
                  navigation.navigate('OpenBankAuth', {
                    type: 'REAUTH',
                    completeAction: reauthAfterAction,
                  });
                }}
              />
            </View>
          </View>
        </Modal>
      );
    }

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisibleModal}
        onRequestClose={() => closeModal()}
      >
        <View style={styles.bgWrap}>
          <View style={styles.contentsWrap}>
            <CloseButton onClose={() => closeModal()} />
            {showFirmWorkCoupon && (
              <View style={styles.couponListWrap}>
                {!couponCnt && (
                  <JBText text="일감수락쿠폰 미보유(차주일감 등록시 추가됨)" />
                )}
                {couponCnt === 1 && (
                  <JBText text="일감수락쿠폰 1개보유(2개이상 시 사용가능)" />
                )}
                {couponCnt >= 2 && <Coupon name="일감수락 쿠폰" count={couponCnt} selected={couponSelected} onPress={selected => this.selectFirmWorkCoupon(selected)} />}
              </View>
            )}
            <FlatList
              data={accList}
              extraData={selFinUseNum}
              renderItem={({ item }) => OBAccount(item, selFinUseNum, this.onAccListItemPress)}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ListSeparator}
            />
            <JBButton
              title={actionName}
              onPress={() => this.completeAction()}
              size="full"
              Primary
            />
          </View>
        </View>
      </Modal>
    );
  }
}
