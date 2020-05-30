import * as React from 'react';
import * as api from 'api/api';

import { DefaultNavigationProps, UserProfile } from 'src/types';
import KakaoPayWebView, { KakaoPaymentReadyInfo } from 'src/components/templates/KakaoPayWebView';

import { ApplyWorkCallback } from 'src/components/action';
import { Callbacker } from 'src/utils/Callbacker';
import CouponSelectModal from 'src/components/templates/CouponSelectModal';
import LoadingIndicator from 'src/components/molecules/LoadingIndicator';
import ModalTemplate from 'src/components/templates/ModalTemplate';
import { Provider } from 'src/contexts/LoginContext';
import { SubscriptionReadyResponse } from 'src/container/ad/types';
import { User } from 'firebase';
import WebView from 'react-native-webview';
import { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { noticeUserError } from 'src/container/request';
import { updateFirmInfo } from 'src/container/login/action';
import { updatePaymentSubscription } from 'src/utils/FirebaseUtils';

const CALLBACKER_AD_PAYMENT = 'CALLBACKER_AD_PAYMENT';
export class Firm
{
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
}

class LoadingModalData
{
  constructor (loading: boolean, msg: string)
  {
    this.loading = loading;
    this.msg = msg;
  }

  loading: boolean;
  msg: string;
}

export class KakaoPaymentInfo
{
  sid?: string;
}

interface Props {
  children?: React.ReactElement;
}

const LoginProvider = (props: Props): React.ReactElement =>
{
  const [user, setUser] = React.useState<User | undefined>();
  const [userProfile, setUserProfile] = React.useState<UserProfile>();
  const [firm, setFirm] = React.useState<Firm | undefined>();
  const [couponModalVisible, setCouponModalVisible] = React.useState<boolean>(false);
  const [paymentInfo] = React.useState<KakaoPaymentInfo>(new KakaoPaymentInfo());
  const [paymentReadyInfo, setPaymentReadyInfo] = React.useState<KakaoPaymentReadyInfo>();
  const [visiblePaymentModal, setVisiblePaymentModal] = React.useState<boolean>(false);
  const [loadingModalData, setLoadingModalData] = React.useState<LoadingModalData>(new LoadingModalData(false, ''));
  const [webViewModal, setWebViewModal] = React.useState({ visible: false, url: undefined });

  // data
  let callbackAction: ApplyWorkCallback | undefined;

  const states = {
    navigation: props.navigation,
    user,
    userProfile,
    firm,
    paymentInfo
  };

  const actions = {
    setUser,
    setFirm,
    setUserProfile,
    setWebViewModal,
    openWorkPaymentModal: (price: number): void =>
    {
      const orderId = `ORDER_${user.uid}_${new Date().getTime()}`;
      api
        .requestPaymentReady('일감매칭비', user.uid, orderId, price)
        .then((response): void =>
        {
          const result: SubscriptionReadyResponse = response;
          if (result && result.next_redirect_mobile_url)
          {
            const paymentReadyInfo = new KakaoPaymentReadyInfo(result.next_redirect_mobile_url, result.tid, user.uid, orderId);
            setPaymentReadyInfo(paymentReadyInfo);
            setVisiblePaymentModal(true);
          }
        })
        .catch((err) =>
        {
          noticeUserError('Ad Create Provider', err?.message, '정기결제 요청 실패');
        });
    },
    openAdPaymentModal: (price: number, callbackFn, callbackArgs): void =>
    {
      const orderId = `ORDER_${user.uid}_${new Date().getTime()}`;
      api
        .requestPaymentReady('광고정기결제', user.uid, orderId, price)
        .then((response): void =>
        {
          console.log('>>> requestPaymentReady response:', response);
          const result: SubscriptionReadyResponse = response;
          if (result && result.next_redirect_mobile_url)
          {
            const paymentReadyInfo = new KakaoPaymentReadyInfo(result.next_redirect_mobile_url, result.tid, user.uid, orderId);
            setPaymentReadyInfo(paymentReadyInfo);
            setVisiblePaymentModal(true);

            Callbacker.add(CALLBACKER_AD_PAYMENT, callbackFn, callbackArgs);
          }
          else
          {
            noticeUserError('LoginProvider(requestPaymentReady result invalid)', response, '정기준비 요청 실패');
          }
        })
        .catch((err) =>
        {
          noticeUserError('Ad Create Provider', err?.message, '정기결제 요청 실패');
        });
    },
    openCouponModal: (applyWorkCallback?: (user: User, useCoupon: boolean) => void): void =>
    {
      if (applyWorkCallback) { callbackAction = new ApplyWorkCallback(applyWorkCallback, user) }
      setCouponModalVisible(true);
    },
    popLoading: (loading: boolean, msg?: string): void =>
    {
      setLoadingModalData(new LoadingModalData(loading, msg));
    },
    refetchFirm: (): Promise<Firm | null> => updateFirmInfo(user, userProfile, setFirm)
  };

  return (
    <Provider value={{ ...states, ...actions }}>
      {props.children}

      <KakaoPayWebView
        visible={visiblePaymentModal}
        paymentInfo={paymentReadyInfo}
        close={(): void => setVisiblePaymentModal(false)}
        setPaymentSubscription={(sid: string): void =>
        {
          setUserProfile({ ...userProfile, sid: sid });
          updatePaymentSubscription(user.uid, sid)
            .then(() =>
            {
              console.log('success updatePaymentSubscription~~');
              paymentInfo.sid = sid;
              Callbacker.trigger(CALLBACKER_AD_PAYMENT);
              console.log('success call callbacker~~', Callbacker);
            }).catch((error) => { noticeUserError('Firebase Update Fail(updatePaymentSubscription)', error?.message) });
        }}
      />
      <ModalTemplate
        visible={webViewModal.visible}
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
      />
      <CouponSelectModal
        user={user}
        visible={couponModalVisible}
        closeModal={(): void => setCouponModalVisible(false)}
        applyCoupon={(): void => { if (callbackAction) { callbackAction.requestCallback() } }}
      />
      <LoadingIndicator loading={loadingModalData.loading} msg={loadingModalData.msg} />
    </Provider>
  );
};

export default LoginProvider;