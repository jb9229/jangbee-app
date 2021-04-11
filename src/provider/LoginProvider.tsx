import * as React from 'react';
import * as api from 'src/api/api';

import { Firm, useFirmLazyQuery } from 'src/apollo/generated';
import KakaoPayWebView, {
  KakaoPaymentReadyInfo,
} from 'src/components/templates/KakaoPayWebView';
import {
  User,
  UserAssets,
  UserProfile,
  UserType,
  WebViewModalData,
} from 'src/types';
import {
  getUserInfo,
  updatePaymentSubscription,
  updateUserAssets,
} from 'src/utils/FirebaseUtils';

import { Alert } from 'react-native';
import { ApplyWorkCallback } from 'src/components/action';
import { Callbacker } from 'src/utils/Callbacker';
import CouponSelectModal from 'src/components/templates/CouponSelectModal';
import LoadingIndicator from 'src/components/molecules/LoadingIndicator';
import ModalTemplate from 'src/components/templates/ModalTemplate';
import { Provider } from 'src/contexts/LoginContext';
import { SubscriptionReadyResponse } from 'src/container/ad/types';
import WebView from 'react-native-webview';
import { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { noticeUserError } from 'src/container/request';
import { notifyError } from 'src/common/ErrorNotice';
import { useEffect } from 'react';

const CALLBACKER_AD_PAYMENT = 'CALLBACKER_AD_PAYMENT';
const CALLBACKER_WORK_PAYMENT = 'CALLBACKER_WORK_PAYMENT';

class LoadingModalData {
  constructor(loading: boolean, msg: string) {
    this.loading = loading;
    this.msg = msg;
  }

  loading: boolean;
  msg: string;
}

export class KakaoPaymentInfo {
  sid?: string;
}

interface Props {
  children?: React.ReactElement;
}

const LoginProvider = (props: Props): React.ReactElement => {
  // states
  const [userProfile, setUserProfile] = React.useState<UserProfile>();
  const [couponModalVisible, setCouponModalVisible] = React.useState<boolean>(
    false
  );
  const [paymentInfo] = React.useState<KakaoPaymentInfo>(
    new KakaoPaymentInfo()
  );
  const [
    paymentReadyInfo,
    setPaymentReadyInfo,
  ] = React.useState<KakaoPaymentReadyInfo>();
  const [visiblePaymentModal, setVisiblePaymentModal] = React.useState<boolean>(
    false
  );
  const [
    loadingModalData,
    setLoadingModalData,
  ] = React.useState<LoadingModalData>(new LoadingModalData(false, ''));
  const [webViewModal, setWebViewModal] = React.useState<WebViewModalData>({
    visible: false,
    url: undefined,
  });

  // data
  let callbackAction: ApplyWorkCallback | undefined;

  // server data
  const [firmReq, firmRsp] = useFirmLazyQuery({
    onCompleted(data) {
      if (!data?.firm) {
        Alert.alert(
          '등록된 내 장비 불러오기 실패!',
          '내 장비등록 정보 -> 내 장비 등록하기를 먼저 해 주세요',
          [{ text: '확인' }],
          { cancelable: false }
        );

        return null;
      }
    },
    onError(error) {
      notifyError(
        '업체정보 확인중 문제발생',
        `업체정보를 불러오는 도중 문제가 발생했습니다, 다시 시도해 주세요 -> [${error.name}] ${error.message}`,
        [
          { text: '취소' },
          {
            text: '다시 시도하기',
            onPress: (): void => {
              onFirmRefetch();
            },
          },
        ]
      );
    },
  });

  // actions
  const onFirmRefetch = () => {
    if (userProfile?.uid && userProfile?.userType === UserType.FIRM) {
      firmReq({ variables: { accountId: userProfile.uid } });
    }
  };

  // component life cycle
  useEffect(() => {
    onFirmRefetch();
  }, [userProfile]);

  const states = {
    userProfile,
    firm: firmRsp.data?.firm,
    paymentInfo,
  };

  const actions = {
    setUserProfile,
    setWebViewModal,
    saveUserProfileAssets: (assetData: UserAssets): Promise<void> => {
      return updateUserAssets(userProfile?.uid, assetData);
    },
    openWorkPaymentModal: (
      price: number,
      callbackFn,
      callbackArgs: Array<any>
    ): void => {
      const orderId = `ORDER_${userProfile?.uid}_${new Date().getTime()}`;
      api
        .requestPaymentReady('일감매칭비', userProfile?.uid, orderId, price)
        .then((response): void => {
          const result: SubscriptionReadyResponse = response;
          if (result && result.next_redirect_mobile_url) {
            const paymentReadyInfo = new KakaoPaymentReadyInfo(
              result.next_redirect_mobile_url,
              result.tid,
              userProfile?.uid,
              orderId
            );
            setPaymentReadyInfo(paymentReadyInfo);
            setVisiblePaymentModal(true);

            if (callbackFn) {
              Callbacker.add(CALLBACKER_WORK_PAYMENT, callbackFn, callbackArgs);
            }
          }
        })
        .catch(err => {
          noticeUserError(
            'Ad Create Provider[정기결제 요청 실패]',
            err?.message,
            userProfile
          );
        });
    },
    openAdPaymentModal: (
      price: number,
      callbackFn,
      callbackArgs: Array<any>
    ): void => {
      const orderId = `ORDER_${userProfile?.uid}_${new Date().getTime()}`;
      api
        .requestPaymentReady('광고정기결제', userProfile?.uid, orderId, price)
        .then((response): void => {
          console.log('>>> requestPaymentReady response:', response);
          const result: SubscriptionReadyResponse = response;
          if (result && result.next_redirect_mobile_url) {
            const paymentReadyInfo = new KakaoPaymentReadyInfo(
              result.next_redirect_mobile_url,
              result.tid,
              userProfile?.uid,
              orderId
            );
            setPaymentReadyInfo(paymentReadyInfo);
            setVisiblePaymentModal(true);

            Callbacker.add(CALLBACKER_AD_PAYMENT, callbackFn, callbackArgs);
          } else {
            noticeUserError(
              'LoginProvider(requestPaymentReady result invalid, 정기준비 요청 실패)',
              response,
              userProfile
            );
          }
        })
        .catch(err => {
          noticeUserError(
            'Ad Create Provider(정기결제 요청 실패)',
            err?.message,
            userProfile
          );
        });
    },
    openCouponModal: (
      applyWorkCallback?: (user: User, useCoupon: boolean) => void
    ): void => {
      if (applyWorkCallback) {
        callbackAction = new ApplyWorkCallback(applyWorkCallback, userProfile);
      }
      setCouponModalVisible(true);
    },
    popLoading: (loading: boolean, msg?: string): void => {
      setLoadingModalData(new LoadingModalData(loading, msg));
    },
    refetchFirm: onFirmRefetch,
    refetchUserProfile: (): Promise<UserProfile> => {
      return getUserInfo(userProfile.uid).then(data => {
        const userInfo = data.val();

        if (userInfo) {
          setUserProfile(userInfo);
        }

        return userInfo;
      });
    },
  };

  return (
    <Provider value={{ ...states, ...actions }}>
      {props.children}

      <KakaoPayWebView
        visible={visiblePaymentModal}
        paymentInfo={paymentReadyInfo}
        close={(): void => setVisiblePaymentModal(false)}
        setPaymentSubscription={(sid: string): void => {
          setUserProfile({ ...userProfile, sid: sid });
          updatePaymentSubscription(userProfile?.uid, sid)
            .then(() => {
              console.log('success updatePaymentSubscription~~');
              console.log('>>> Callbacker.arguments: ', Callbacker.arguments);
              paymentInfo.sid = sid;
              Callbacker.trigger(CALLBACKER_AD_PAYMENT);
              Callbacker.trigger(CALLBACKER_WORK_PAYMENT, sid);
              console.log('success call callbacker~~', Callbacker);
            })
            .catch(error => {
              noticeUserError(
                'Firebase Update Fail(updatePaymentSubscription)',
                error?.message
              );
            });
        }}
      />
      <ModalTemplate
        visible={webViewModal.visible}
        contents={
          <WebView
            source={{ uri: webViewModal.url }}
            style={{ flex: 1 }}
            onError={(err: WebViewErrorEvent): void => {
              console.log('>>> WebView onError:', err);
            }}
          />
        }
      />
      <CouponSelectModal
        user={userProfile}
        visible={couponModalVisible}
        closeModal={(): void => setCouponModalVisible(false)}
        applyCoupon={(): void => {
          if (callbackAction) {
            callbackAction.requestCallback();
          }
        }}
      />
      <LoadingIndicator
        loading={loadingModalData.loading}
        msg={loadingModalData.msg}
      />
    </Provider>
  );
};

export default LoginProvider;
