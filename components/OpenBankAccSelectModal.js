import React from 'react';
import {
  Alert, FlatList, Modal, StyleSheet, View,
} from 'react-native';
import styled from 'styled-components/native';
import OpenBankAuthWebView from './OpenBankAuthWebView';
import CloseButton from './molecules/CloseButton';
import JBButton from './molecules/JBButton';
import ListSeparator from './molecules/ListSeparator';
import OBAccount from './molecules/OBAccount';
import Coupon from './molecules/Coupon';
import JBText from './molecules/JBText';
import JBTextInput from './molecules/JBTextInput';
import * as firebaseDB from '../utils/FirebaseUtils';
import * as api from '../api/api';
import JBActIndicator from './organisms/JBActIndicator';
import { notifyError } from '../common/ErrorNotice';
import JBEmptyView from './organisms/JBEmptyView';
import fonts from '../constants/Fonts';
import colors from '../constants/Colors';
import { validate } from '../utils/Validation';

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
  couponListWrap: {},
  commWrap: {
    flexDirection: 'row',
  },
});

const Container = styled.View`
  flex: 1;
`;
const CashbackContainer = styled.View`
`;

const AvailCBWrap = styled.View`
  flex-direction: row;
`;

const AvailCBTitle = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 16px;
  margin-bottom: 10px;
  color: ${colors.batangDark};
`;

const AvailCB = styled.Text`
  font-family: ${fonts.title};
  font-size: 16;
  background-color: ${colors.point2Light};
  padding: 3px;
  padding-left: 7px;
  padding-right: 7px;
`;

const CashbackAccSelNotice = styled.Text`
  font-family: ${fonts.titleMiddle};
  font-size: 16px;
  margin-bottom: 10px;
  color: ${colors.batangDark};
  margin-top: 15;
`;

// Static Veriables
const ACCOUNT_MODE = 'ACCOUNT_MODE';
const COUPON_MODE = 'COUPON_MODE';
const CASHBACK_MODE = 'CASHBACK_MODE';

export default class OpenBankAccSelectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selFinUseNum: '',
      isLoadingCoupon: true,
      isVisibleOBAuthModal: false,
      couponSelected: false,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { isVisibleModal, mode } = nextProps;

    if (isVisibleModal) {
      if (mode === COUPON_MODE) {
        this.setFirmworkCoupon();
      }
      if (mode === CASHBACK_MODE) {
        this.setFirmworkCoupon();
      }
      this.setOpenBankAccountList();
    }
  }

  /**
   * 모달 액션 완료 함수
   */
  completeAction = () => {
    // Variables
    const { selFinUseNum, couponSelected, requestCashback } = this.state;
    const { completeSelect, closeModal, mode } = this.props;

    // Callback Complete Function
    if (mode === ACCOUNT_MODE) {
      if (!selFinUseNum) {
        notifyError('유효성검사 에러', `[${selFinUseNum}] 계좌번호를 선택해 주세요`);
        return;
      }
      completeSelect(selFinUseNum);
    } else if (mode === COUPON_MODE) {
      if (!couponSelected) {
        if (!selFinUseNum) {
          notifyError('유효성검사 에러', `쿠폰 또는 계좌번호를[${selFinUseNum}] 선택해 주세요`);
          return;
        }
      }
      completeSelect(selFinUseNum, couponSelected);
    } else if (mode === CASHBACK_MODE) {
      const v = validate('decimalMax', requestCashback, true, 200000);
      if (!v[0]) {
        notifyError('유효성검사 에러', `캐쉬백 요청값이 올바르지 않습니다(1회 최고 요청가능금액: 20만원): [${requestCashback}]`);
        return;
      }

      if (!selFinUseNum) {
        notifyError('유효성검사 에러', `계좌번호를[${selFinUseNum}] 선택해 주세요`);
        return;
      }

      completeSelect(selFinUseNum, requestCashback);
    }
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
  };

  render() {
    const {
      isVisibleModal,
      navigation,
      closeModal,
      reauthAfterAction,
      actionName,
      mode,
      addAccountAction,
    } = this.props;
    const {
      isEmptyList,
      isLoadingCoupon,
      isVisibleOBAuthModal,
      accList,
      selFinUseNum,
      couponCnt,
      couponSelected,
      requestCashback,
    } = this.state;

    if ((mode === COUPON_MODE || mode === CASHBACK_MODE) && isLoadingCoupon) {
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
        <Container>
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
                  refresh={() => this.setState({ isVisibleOBAuthModal: true })}
                />
              </View>
            </View>
          </Modal>
          <OpenBankAuthWebView
            isVisibleModal={isVisibleOBAuthModal}
            type="ADD_ACCOUNT"
            navigation={navigation}
            completeAction={() => this.setState({ isVisibleOBAuthModal: false })}
            closeModal={() => this.setState({ isVisibleOBAuthModal: false })}
          />
        </Container>
      );
    }

    return (
      <Container>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleModal}
          onRequestClose={() => closeModal()}
        >
          <View style={styles.bgWrap}>
            <View style={styles.contentsWrap}>
              <CloseButton onClose={() => closeModal()} />
              {mode === COUPON_MODE ? (
                <View style={styles.couponListWrap}>
                  {!couponCnt && <JBText text="일감수락쿠폰 미보유(차주일감 등록시 추가됨)" />}
                  {couponCnt === 1 && <JBText text="일감수락쿠폰 1개보유(2개이상 시 사용가능)" />}
                  {couponCnt >= 2 && (
                    <Coupon
                      name="일감수락 쿠폰"
                      count={couponCnt}
                      selected={couponSelected}
                      onPress={selected => this.selectFirmWorkCoupon(selected)}
                    />
                  )}
                </View>
              ) : null}
              {mode === CASHBACK_MODE ? (
                <CashbackContainer>
                  <AvailCBWrap>
                    <AvailCBTitle>가용쿠폰개수(장당 5천원):</AvailCBTitle>
                    <AvailCB>{`${couponCnt}장`}</AvailCB>
                  </AvailCBWrap>
                  <JBTextInput
                    title="캐쉬백할 쿠폰개수:"
                    value={requestCashback}
                    onChangeText={text => this.setState({ requestCashback: text })}
                    placeholder="캐쉬백할 쿠폰 개수를 기입해 주세요."
                    keyboardType="numeric"
                    onEndEditing={() => {
                      if (requestCashback > couponCnt) {
                        Alert.alert('가용 쿠폰개수를 확인해 주세요!', `[${couponCnt}] 이하값을 기입해 주세요.`);
                        this.setState({ requestCashback: 0 });
                      }
                    }}
                    onSubmitEditing={() => {
                      if (requestCashback > couponCnt) {
                        Alert.alert('가용 쿠폰개수를 확인해 주세요!', `[${couponCnt}] 이하값을 기입해 주세요.`);
                        this.setState({ requestCashback: 0 });
                      }
                    }}
                  />
                  <CashbackAccSelNotice>캐쉬백 계좌를 선택해 주세요:</CashbackAccSelNotice>
                </CashbackContainer>
              ) : null}
              <JBButton
                title="통장추가하기"
                onPress={() => this.setState({ isVisibleOBAuthModal: true })}
                underline
                align="right"
                Secondary
              />
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
        <OpenBankAuthWebView
          isVisibleModal={isVisibleOBAuthModal}
          type="ADD_ACCOUNT"
          navigation={navigation}
          completeAction={() => this.setState({ isVisibleOBAuthModal: false })}
          closeModal={() => this.setState({ isVisibleOBAuthModal: false })}
        />
      </Container>
    );
  }
}
