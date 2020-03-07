import * as React from 'react';
import * as api from 'api/api';

import KakaoPayWebView, { KakaoPaymentInfo } from 'src/components/templates/KakaoPayWebView';

import { DefaultNavigationProps } from 'src/types';
import { SubscriptionReadyResponse } from 'src/container/ad/types';
import { User } from 'firebase';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';

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
  firm: Firm;
  setUser: (user: User) => void;
  setFirm: (firm: Firm) => void;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const LoginProvider = (props: Props): React.ReactElement =>
{
  const [user, setUser] = React.useState<User | undefined>();
  const [firm, setFirm] = React.useState<Firm | undefined>();
  const [visiblePaymentModal, setVisiblePaymentModal] = React.useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = React.useState<KakaoPaymentInfo>();

  const states = {
    navigation: props.navigation,
    user,
    firm
  };

  const actions = {
    setUser,
    setFirm,
    openWorkPaymentModal: (): void =>
    {
      const authKey = 'KakaoAK 9366738358634bcb690992c374583819';
      const orderId = `ORDER_${user.uid}_${new Date().getTime()}`;
      api
        .requestWorkPayment(authKey, user.uid, orderId)
        .then((response): void =>
        {
          const result: SubscriptionReadyResponse = response;
          if (result && result.next_redirect_mobile_url)
          {
            const paymentInfo = new KakaoPaymentInfo(authKey, result.next_redirect_mobile_url, result.tid, user.uid, orderId);
            paymentInfo.cid = 'TCSUBSCRIP';
            setPaymentInfo(paymentInfo);
            setVisiblePaymentModal(true);
          }
        })
        .catch((err) =>
        {
          noticeUserError('Ad Create Provider', '정기결제 요청 실패', err.message);
        });
    }
  };

  return (
    <Provider value={{ ...states, ...actions }}>
      {props.children}
      <KakaoPayWebView
        visible={visiblePaymentModal}
        paymentInfo={paymentInfo}
        close={(): void => setVisiblePaymentModal(false)}
      />
    </Provider>
  );
};

export { useCtx as useLoginProvider, LoginProvider };
