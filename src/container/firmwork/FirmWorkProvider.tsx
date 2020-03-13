import * as React from 'react';
import * as api from 'api/api';
import * as url from 'constants/Url';

import { acceptWorkRequest, applyWork } from 'src/container/firmwork/actions';

import { Alert } from 'react-native';
import { DefaultNavigationProps } from 'src/types';
import { User } from 'firebase';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import useAxios from 'axios-hooks';
import { useLoginProvider } from 'src/contexts/LoginProvider';

interface Context {
  navigation: DefaultNavigationProps;
  openWorkList: Array<object>;
  matchedWorkList: Array<object>;
  refreshing: boolean;
  applyWork: (workId: string) => void;
  refetchOpenWorkList: () => void;
  setRefreshing: () => boolean;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const FirmWorkProvider = (props: Props): React.ReactElement =>
{
  const { user, firm, paymentInfo, openWorkPaymentModal, openCouponModal } = useLoginProvider();
  const [refreshing, setRefreshing] = React.useState(false);

  // Server Data State
  const [openWorkListResponse, openWorkListRequest] = useAxios(`${url.JBSERVER_WORK_FIRM_OPEN}?equipment=${firm?.equiListStr}
    &accountId=${user?.uid}`);

  // Didmount/Unmount
  React.useEffect(() =>
  {
    if (!firm?.equiListStr)
    {
      Alert.alert(
        '보유장비를 조회할 수 없습니다',
        '아직 장비등록하지 않으셨나요? 아님 통신상태가 좋지 않은거 같습니다',
        [
          { text: '다시 시도하기' },
          {
            text: '장비등록하러 가기',
            onPress: (): void => props.navigation.navigate('FirmMyInfo')
          }
        ],
        { cancelable: false }
      );
    }
    else
    {

    }
  }, [firm]);

  // Error Handling Of Server API Call
  if (openWorkListResponse.error)
  {
    noticeUserError('Firm Work Provider(getFirmOpenWorkList)', '접속이 원활하지 않습니다, 재시도 해주세요', openWorkListResponse.error.message);
  }
  console.log(openWorkListResponse?.data);
  // Init States
  const states = {
    navigation: props.navigation,
    openWorkList: openWorkListResponse && openWorkListResponse.data ? openWorkListResponse.data : [],
    refreshing,
    matchedWorkList: []
  };

  // Init Actions
  const actions = {
    setRefreshing,
    applyWork: (workId: string): void =>
    {
      if (paymentInfo.sid)
      {
        Alert.alert(
          '해당 날짜와 장소에 배차 가능하십니까?',
          '지원 후, 장비사용고객의 선택알람을 기다려 주세요\n',
          [
            { text: '취소' },
            { text: '지원하기', onPress: (): void => applyWork(workId, user, openWorkListRequest) }
          ]
        );
      }
      else
      {
        Alert.alert(
          '해당 날짜와 장소에 배차 가능하십니까?',
          '지원 후, 장비사용고객의 선택알람을 기다려 주세요\n' +
          '한번 결재정보를 등록하면 앞으로 보다 신속하게 지원 가능합니다(매칭비 2만원)',
          [
            { text: '취소' },
            { text: '지원하기', onPress: (): void => applyWork(workId, user, openWorkListRequest) },
            { text: '결재등록', onPress: (): void => openWorkPaymentModal(0) }
          ]
        );
      }
    },
    acceptWork: (): void =>
    {
      if (!paymentInfo || !paymentInfo.sid) { openWorkPaymentModal(20000); return }
      Alert.alert(
        '매칭비 자동이체 후, 매칭이 완료 됩니다.',
        '매칭 후, 매칭된 일감(오른쪽 상단 메뉴)화면에서 꼭! [전화걸기]통해 고객과 최종 협의하세요.',
        [
          { text: '포기하기', onPress: (): void => this.abandonWork(workId) },
          {
            text: '쿠폰사용하기',
            onPress: (): void => { openCouponModal() }
          },
          {
            text: '결제하기',
            onPress: (): void => { acceptWorkRequest(user, false) }
          }
        ]
      );
    },
    refetchOpenWorkList (): void { openWorkListRequest() }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useFirmWorkProvider, FirmWorkProvider };
