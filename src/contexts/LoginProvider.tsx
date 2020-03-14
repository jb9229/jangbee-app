import * as React from 'react';
import * as api from 'api/api';

import { DefaultNavigationProps, UserProfile } from 'src/types';
import KakaoPayWebView, { KakaoPaymentReadyInfo } from 'src/components/templates/KakaoPayWebView';

import { ApplyWorkCallback } from 'src/components/action';
import CouponSelectModal from 'src/components/templates/CouponSelectModal';
import { SubscriptionReadyResponse } from 'src/container/ad/types';
import { User } from 'firebase';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import { updatePaymentSubscription } from 'src/utils/FirebaseUtils';

export class Firm
{
  id: string;
  accountId: string;
  fname: string;
  equiListStr: string;
  thumbnail: string;
  phoneNumber: string;
  // modelYear: string;
  // address: string;
  // addressDetail: string;
  // sidoAddr: string;
  // addrLogitude: string;
  // addrLatitude: string;
  // workAlarmSido: string;
  // workAlarmSigungu: string;
  // instroduction: string;
  // photo1: string;
  // photo2: string;
  // photo3: string;
  // blog: string;
  // homepage: string;
  // sns: string;
  // ratingCnt: number;
}
interface Context {
  navigation: DefaultNavigationProps;
  user: User;
  userProfile: UserProfile;
  firm: Firm;
  paymentInfo: KakaoPaymentInfo;
  setUser: (user: User) => void;
  setFirm: (firm: Firm) => void;
  setUserProfile: (p: UserProfile) => void;
  openWorkPaymentModal: (price: number) => void;
  openCouponModal: () => void;
}

class KakaoPaymentInfo
{
  sid?: string;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const LoginProvider = (props: Props): React.ReactElement =>
{
  const [user, setUser] = React.useState<User | undefined>();
  const [userProfile, setUserProfile] = React.useState<UserProfile>();
  const [firm, setFirm] = React.useState<Firm | undefined>();
  const [couponModalVisible, setCouponModalVisible] = React.useState<boolean>(false);
  const [paymentInfo] = React.useState<KakaoPaymentInfo>(new KakaoPaymentInfo());
  const [visiblePaymentModal, setVisiblePaymentModal] = React.useState<boolean>(false);
  const [paymentReadyInfo, setPaymentReadyInfo] = React.useState<KakaoPaymentReadyInfo>();

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
    openWorkPaymentModal: (price: number): void =>
    {
      const authKey = 'KakaoAK 9366738358634bcb690992c374583819';
      const orderId = `ORDER_${user.uid}_${new Date().getTime()}`;
      api
        .requestWorkPayment(authKey, user.uid, orderId, price)
        .then((response): void =>
        {
          const result: SubscriptionReadyResponse = response;
          if (result && result.next_redirect_mobile_url)
          {
            const paymentReadyInfo = new KakaoPaymentReadyInfo(authKey,
              result.next_redirect_mobile_url, result.tid, user.uid, orderId);
            paymentReadyInfo.cid = 'TCSUBSCRIP';
            setPaymentReadyInfo(paymentReadyInfo);
            setVisiblePaymentModal(true);
          }
        })
        .catch((err) =>
        {
          noticeUserError('Ad Create Provider', '정기결제 요청 실패', err.message);
        });
    },
    openCouponModal: (applyWorkCallback?: (user: User, useCoupon: boolean) => void): void =>
    {
      if (applyWorkCallback) { callbackAction = new ApplyWorkCallback(applyWorkCallback, user) }
      setCouponModalVisible(true);
    }
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
          updatePaymentSubscription(user.uid, sid)
            .then((result) =>
            {
              if (result)
              {
                paymentInfo.sid = sid;
              }
            });
        }}
      />
      <CouponSelectModal
        user={user}
        visible={couponModalVisible}
        closeModal={(): void => setCouponModalVisible(false)}
        applyCoupon={(): void => { if (callbackAction) { callbackAction.requestCallback() } }}
      />
    </Provider>
  );
};

export { useCtx as useLoginProvider, LoginProvider };
