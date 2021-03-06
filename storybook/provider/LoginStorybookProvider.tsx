import * as React from 'react';
import * as api from 'src/api/api';

import { DefaultNavigationProps, UserProfile } from 'src/types';

import { ApplyWorkCallback } from 'src/components/action';
import { KakaoPaymentReadyInfo } from 'src/components/templates/KakaoPayWebView';
import { Provider } from 'src/contexts/LoginContext';
import { SubscriptionReadyResponse } from 'src/container/ad/types';
import { User } from 'firebase';
import { noticeUserError } from 'src/container/request';

export class Firm {
  id: string;
  accountId: string;
  fname: string;
  equiListStr: string;
  thumbnail: string;
  phoneNumber: string;
  modelYear: string;
  address: string;
  addressDetail: string;
  sidoAddr: string;
  sigunguAddr: string;
  addrLongitude: string;
  addrLatitude: string;
  workAlarmSido: string;
  workAlarmSigungu: string;
  introduction: string;
  photo1: string;
  photo2: string;
  photo3: string;
  blog: string;
  homepage: string;
  sns: string;
  ratingCnt: number;
  distance: number;
}

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
  navigation: DefaultNavigationProps;
}

const LoginStorybookProvider = (props: Props): React.ReactElement => {
  const [userProfile, setUserProfile] = React.useState<UserProfile>();
  const [firm] = React.useState<Firm | undefined>();
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
  const [webViewModal, setWebViewModal] = React.useState({
    visible: false,
    url: undefined,
  });

  // data
  let callbackAction: ApplyWorkCallback | undefined;

  const user = {
    uid: 'HGrkuKNAWyXVpT8gegrcSt1oJOH2',
    displayName: null,
    email: null,
    phoneNumber: '01052023337',
    photoURL: '',
    providerId: '',
  };

  const states = {
    navigation: props.navigation,
    user,
    userProfile,
    firm,
    paymentInfo,
  };

  const actions = {
    setUserProfile,
    setWebViewModal,
    openWorkPaymentModal: (price: number): void => {
      const orderId = `ORDER_${user.uid}_${new Date().getTime()}`;
      api
        .requestPaymentReady('일감매칭비', user.uid, orderId, price)
        .then((response): void => {
          const result: SubscriptionReadyResponse = response;
          if (result && result.next_redirect_mobile_url) {
            const paymentReadyInfo = new KakaoPaymentReadyInfo(
              result.next_redirect_mobile_url,
              result.tid,
              user.uid,
              orderId
            );
            setPaymentReadyInfo(paymentReadyInfo);
            setVisiblePaymentModal(true);
          }
        })
        .catch(err => {
          noticeUserError(
            'Ad Create Provider[정기결제 요청 실패]',
            err?.message,
            user
          );
        });
    },
    openAdPaymentModal: (price: number): void => {
      const orderId = `ORDER_${user.uid}_${new Date().getTime()}`;
      api
        .requestPaymentReady('광고정기결제', user.uid, orderId, price)
        .then((response): void => {
          const result: SubscriptionReadyResponse = response;
          if (result && result.next_redirect_mobile_url) {
            const paymentReadyInfo = new KakaoPaymentReadyInfo(
              result.next_redirect_mobile_url,
              result.tid,
              user.uid,
              orderId
            );
            setPaymentReadyInfo(paymentReadyInfo);
            setVisiblePaymentModal(true);
          }
        })
        .catch(err => {
          noticeUserError(
            'Ad Create Provider[정기결제 요청 실패]',
            err?.message,
            user
          );
        });
    },
    openCouponModal: (
      applyWorkCallback?: (user: User, useCoupon: boolean) => void
    ): void => {
      if (applyWorkCallback) {
        callbackAction = new ApplyWorkCallback(applyWorkCallback, user);
      }
      setCouponModalVisible(true);
    },
    popLoading: (loading: boolean, msg?: string): void => {
      setLoadingModalData(new LoadingModalData(loading, msg));
    },
  };

  return (
    <Provider value={{ ...states, ...actions }}>
      {props.children}

      {/* <KakaoPayWebView
        visible={visiblePaymentModal}
        paymentInfo={paymentReadyInfo}
        close={(): void => setVisiblePaymentModal(false)}
        setPaymentSubscription={(sid: string): void =>
        {
          setUserProfile({ ...userProfile, sid: sid });
          updatePaymentSubscription(user.uid, sid)
            .then((result) =>
            {
              if (result)
              {
                paymentInfo.sid = sid;
              }
            }).catch((error) => console.log(error));
        }}
      /> */}
      {/* <ModalTemplate
        visible={webViewModal.visible}
        setVisible={(flag): void => setWebViewModal({ ...webViewModal, visible: flag })}
        contents={
          <WebView
            source={{ uri: webViewModal.url }}
            style={{ flex: 1 }}
            onError={(err: WebViewErrorEvent): void =>
            {
              console.log('>>> WebView onError:', err);
            }}
          />
        }
        full
      /> */}
      {/* <CouponSelectModal
        user={user}
        visible={couponModalVisible}
        closeModal={(): void => setCouponModalVisible(false)}
        applyCoupon={(): void => { if (callbackAction) { callbackAction.requestCallback() } }}
      /> */}
      {/* <LoadingIndicator loading={loadingModalData.loading} msg={loadingModalData.msg} /> */}
    </Provider>
  );
};

export default LoginStorybookProvider;
