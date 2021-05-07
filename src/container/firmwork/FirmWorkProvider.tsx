import * as React from 'react';
import * as jangbeeConfig from '../../../jbcallconfig.json';

import { DefaultNavigationProps, Work } from 'src/types';
import {
  abandonWork,
  acceptWorkRequest,
  applyFirmWork,
  applyWork,
} from 'src/container/firmwork/actions';

import { Alert } from 'react-native';
import { FirmWorkParamList } from 'src/navigation/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import url from 'src/constants/Url';
import useAxios from 'axios-hooks';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Context {
  navigation: DefaultNavigationProps;
  openWorkList: Array<object>;
  matchedWorkList: Array<object>;
  refreshing: boolean;
  matchedRefreshing: boolean;
  tabIndex: number;
  applyWork: (workId: string) => void;
  applyFirmWork: (workId: string) => void;
  acceptWork: (work: object) => void;
  abandonWork: (workId: string) => void;
  refetchOpenWorkList: () => void;
  refetchMatchedWorkList: () => void;
  setTabIndex: (i: number) => void;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: StackNavigationProp<FirmWorkParamList, 'WorkList'>;
  route: RouteProp<FirmWorkParamList, 'WorkList'>;
}

const FirmWorkProvider = (props: Props): React.ReactElement => {
  const { refresh } = props.route;
  const {
    firm,
    userProfile,
    openWorkPaymentModal,
    refetchFirm,
  } = useLoginContext();
  const [refreshing, setRefreshing] = React.useState(false);
  const [matchedRefreshing, setMatchedRefreshing] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);

  // Server Data State
  const [openWorkListResponse, openWorkListRequest] = useAxios(
    `${url.JBSERVER_WORK_FIRM_OPEN}?equipment=${firm?.equiListStr}` +
      `&accountId=${userProfile?.uid}`
  );
  const [matchedWorkListResponse, matchedWorkListRequest] = useAxios(
    `${url.JBSERVER_WORK_FIRM_MATCHED}?` +
      `equipment=${firm?.equiListStr}&accountId=${userProfile?.uid}`
  );

  // Didmount/Unmount
  React.useEffect(() => {
    if (!firm?.equiListStr) {
      Alert.alert(
        '보유장비를 조회할 수 없습니다',
        '아직 장비등록하지 않으셨나요? 아님 통신상태가 좋지 않은거 같습니다',
        [
          {
            text: '다시 시도하기',
            onPress: () => refetchFirm(),
          },
          {
            text: '장비등록하러 가기',
            onPress: (): void => props.navigation.navigate('FirmRegister'),
          },
        ],
        { cancelable: false }
      );
    }

    if (refresh) {
      openWorkListRequest();
      matchedWorkListRequest();
    }
  }, [firm]);

  // Error Handling Of Server API Call
  if (openWorkListResponse.error) {
    noticeUserError(
      'Firm Work Provider(getFirmOpenWorkList)',
      openWorkListResponse.error.message,
      userProfile
    );
  }
  if (matchedWorkListResponse.error) {
    noticeUserError(
      'FirmWorkProvider(getFirmMatchedWorkList)',
      matchedWorkListResponse.error.message,
      userProfile
    );
  }

  // State Action
  const successApply = (work: Work): void => {
    // 매칭비 고객에게 입금
    const clientAccountId = work.accountId;

    openWorkListRequest();
    matchedWorkListRequest();
    setTabIndex(1);
  };

  const failApply = (): void => {
    openWorkListRequest();
  };

  const successAcceptWork = (): void => {
    // @TODO 자산 올려주기

    openWorkListRequest();
    matchedWorkListRequest();
    setTabIndex(1);
  };

  const failAcceptWork = (): void => {
    Alert.alert(
      '배차하기 문제',
      '배차되지 않았습니다, 통장잔고 확인요청, 배차요청 3시간이 지났는지 리스트 리프레쉬 후 확인해 주세요'
    );

    openWorkListRequest();
  };

  // Consumer States
  const states = {
    navigation: props.navigation,
    tabIndex,
    openWorkList:
      openWorkListResponse && openWorkListResponse.data
        ? openWorkListResponse.data
        : [],
    refreshing,
    matchedRefreshing,
    matchedWorkList:
      matchedWorkListResponse && matchedWorkListResponse.data
        ? matchedWorkListResponse.data
        : [],
  };

  // Consumer Actions
  const actions = {
    setTabIndex,
    setRefreshing,
    applyWork: (workId: string): void => {
      if (userProfile.sid) {
        Alert.alert(
          '해당 날짜와 장소에 배차 가능하십니까?',
          '지원 후, 장비사용고객의 선택알람을 기다려 주세요\n',
          [
            { text: '취소' },
            {
              text: '지원하기',
              onPress: (): void =>
                applyWork(workId, userProfile, openWorkListRequest),
            },
          ]
        );
      } else {
        Alert.alert(
          '해당 날짜와 장소에 배차 가능하십니까?',
          '지원 후, 장비사용고객의 선택알람을 기다려 주세요\n' +
            `한번 결재정보를 등록하면 앞으로 보다 신속하게 지원 가능합니다(매칭비 ${jangbeeConfig.workMatchingFee}만원)`,
          [
            { text: '취소' },
            {
              text: '지원하기',
              onPress: (): void =>
                applyWork(workId, userProfile, openWorkListRequest),
            },
            {
              text: '결재등록',
              onPress: (): void =>
                openWorkPaymentModal(jangbeeConfig.workMatchingFee, applyWork, [
                  workId,
                  userProfile,
                  openWorkListRequest,
                ]),
            },
          ]
        );
      }
    },
    applyFirmWork: (work: Work): void => {
      console.log('>>> applyfirmwork: ', work);
      // '다른 차주가 올린 일감은, 선착순으로 한 업체만 매칭비 결재와 동시에 바로 매칭됩니다.',
      if (
        firm &&
        work.modelYearLimit &&
        firm.modelYear &&
        work.modelYearLimit <= firm.modelYear
      ) {
        Alert.alert(
          '죄송합니다, 지원할 수 없는 일감입니다',
          `${work.modelYearLimit}년식이상을 요청한 일감으로 지원할 수 없습니다(보유장비: ${firm.modelYear}년식)`
        );

        return;
      }
      console.log('>>> userProfile', userProfile);
      // 유효한 SID가 있는 경우
      if (userProfile.sid) {
        Alert.alert(
          '확인창',
          `해당 날짜와 장소에 배차 가능하십니까?\n\n매칭비 ${jangbeeConfig.workMatchingFee}원이 결재됩니다.`,
          [
            { text: '취소' },
            {
              text: '지원하기',
              onPress: (): void => {
                applyFirmWork(userProfile.uid, work, userProfile.sid, false)
                  .then(res => (res ? successApply() : failApply()))
                  .catch(error =>
                    noticeUserError(
                      'FirmWorkAction[Apply]',
                      `${error.name},${error.message}`,
                      userProfile
                    )
                  );
              },
            },
          ]
        );
      }
      // SID가 없어 발급 받아야 하는 경우
      else {
        Alert.alert(
          '등록된 결재정보가 없습니다',
          '먼저 최초 한번 결재정보를 등록 해주세요[100원]\n 최초 결재계좌로 차후 선착순 매칭이 됩니다(결재 잔액부족시 우선순위에 밀림)',
          [
            { text: '취소' },
            {
              text: '등록하기',
              onPress: (): void =>
                openWorkPaymentModal(
                  jangbeeConfig.workMatchingFee,
                  applyFirmWork,
                  [userProfile.uid, work, userProfile.sid, false]
                ),
            },
          ]
        );
      }
    },
    acceptWork: (work: object): void => {
      console.log('>>> work:', work);
      if (!userProfile || !userProfile.sid) {
        Alert.alert(
          '자동결제정보 없음 (일감비 2만원)',
          '\n자동결제등록을 추천합니다 (특히, 선착순 매칭시)',
          [
            {
              text: '포기하기',
              onPress: (): void => this.abandonWork(work.id),
            },
            {
              text: '자동이체 등록해놓기',
              onPress: (): void => {
                openWorkPaymentModal(jangbeeConfig.workMatchingFee);
              },
            },
          ],
          { cancelable: true }
        );
        return;
      }
      Alert.alert(
        '매칭비 자동이체 후, 매칭이 완료 됩니다.',
        '매칭 후, 매칭된 일감(오른쪽 상단 메뉴)화면에서 꼭! [전화걸기]통해 고객과 최종 협의하세요.',
        [
          {
            text: '포기하기',
            onPress: (): void =>
              abandonWork(userProfile, work.id, openWorkListRequest),
          },
          // {
          //   text: '쿠폰사용하기',
          //   onPress: (): void => { openCouponModal() }
          // },
          {
            text: '결제하기',
            onPress: (): void => {
              acceptWorkRequest(work.id, userProfile, false, userProfile.sid)
                .then(res => (res ? successAcceptWork() : failAcceptWork()))
                .catch(error =>
                  noticeUserError(
                    'FimWorkAction(acceptWork api call error)',
                    error.message,
                    userProfile
                  )
                );
            },
          },
        ]
      );
    },
    abandonWork: (workId: string): void => {
      Alert.alert('확인창', '정말 포기 하시겠습니까?', [
        {
          text: '포기하기',
          onPress: (): void => abandonWork(user, workId, openWorkListRequest),
        },
        {
          text: '취소',
        },
      ]);
    },
    refetchOpenWorkList: (): void => {
      openWorkListRequest();
    },
    refetchMatchedWorkList: (): void => {
      matchedWorkListRequest();
    },
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useFirmWorkProvider, FirmWorkProvider };
