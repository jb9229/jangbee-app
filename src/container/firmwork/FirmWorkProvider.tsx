import * as React from 'react';
import * as url from 'constants/Url';

import { abandonWork, acceptWorkRequest, applyWork } from 'src/container/firmwork/actions';

import { Alert } from 'react-native';
import { DefaultNavigationProps } from 'src/types';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import useAxios from 'axios-hooks';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Context {
  navigation: DefaultNavigationProps;
  openWorkList: Array<object>;
  matchedWorkList: Array<object>;
  refreshing: boolean;
  matchedRefreshing: boolean;
  applyWork: (workId: string) => void;
  acceptWork: (workId: string) => void;
  abandonWork: (workId: string) => void;
  refetchOpenWorkList: () => void;
  refetchMatchedWorkList: () => void;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const FirmWorkProvider = (props: Props): React.ReactElement =>
{
  const { user, firm, paymentInfo, openWorkPaymentModal, openCouponModal } = useLoginContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [matchedRefreshing, setMatchedRefreshing] = React.useState(false);

  // Server Data State
  const [openWorkListResponse, openWorkListRequest] = useAxios(`${url.JBSERVER_WORK_FIRM_OPEN}?equipment=${firm?.equiListStr}` +
    `&accountId=${user?.uid}`);
  const [matchedWorkListResponse, matchedWorkListRequest] = useAxios(`${url.JBSERVER_WORK_FIRM_MATCHED}?` +
    `equipment=${firm?.equiListStr}&accountId=${user?.uid}`);

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
    noticeUserError('Firm Work Provider(getFirmOpenWorkList)', openWorkListResponse.error.message);
  }
  if (matchedWorkListResponse.error)
  {
    noticeUserError('FirmWorkProvider(getFirmMatchedWorkList)', matchedWorkListResponse.error.message);
  }

  // Init States
  const states = {
    navigation: props.navigation,
    openWorkList: openWorkListResponse && openWorkListResponse.data ? openWorkListResponse.data : [],
    refreshing, matchedRefreshing,
    matchedWorkList: matchedWorkListResponse && matchedWorkListResponse.data ? matchedWorkListResponse.data : []
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
    acceptWork: (workId: string): void =>
    {
      if (!paymentInfo || !paymentInfo.sid)
      {
        Alert.alert(
          '자동결제정보 없음 (일감비 2만원)',
          '\n자동결제등록을 추천합니다 (특히, 선착순 매칭시)',
          [
            { text: '포기하기', onPress: (): void => this.abandonWork(workId) },
            {
              text: '자동이체 등록해놓기',
              onPress: (): void => { openWorkPaymentModal(20000) }
            }
          ],
          { cancelable: true }
        );
        return;
      }
      Alert.alert(
        '매칭비 자동이체 후, 매칭이 완료 됩니다.',
        '매칭 후, 매칭된 일감(오른쪽 상단 메뉴)화면에서 꼭! [전화걸기]통해 고객과 최종 협의하세요.',
        [
          { text: '포기하기', onPress: (): void => abandonWork(user, workId, openWorkListRequest) },
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
    abandonWork: (workId: string): void =>
    {
      Alert.alert(
        '확인창',
        '정말 포기 하시겠습니까?',
        [
          { text: '포기하기', onPress: (): void => abandonWork(user, workId, openWorkListRequest) },
          {
            text: '취소'
          }
        ]
      );
    },
    refetchOpenWorkList: (): void => { openWorkListRequest() },
    refetchMatchedWorkList: (): void => { matchedWorkListRequest() }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useFirmWorkProvider, FirmWorkProvider };
