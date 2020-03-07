import * as React from 'react';
import * as api from 'api/api';
import * as url from 'constants/Url';

import { Alert } from 'react-native';
import { DefaultNavigationProps } from 'src/types';
import createCtx from 'src/contexts/CreateCtx';
import { noticeUserError } from 'src/container/request';
import useAxios from 'axios-hooks';
import { useLoginProvider } from 'src/contexts/LoginProvider';

interface Context {
  navigation: DefaultNavigationProps;
  openWorkList: Array<object>;
  matchedWorkList: Array<object>;
  confirmApplyWork: (workId: string) => void;
  refetchOpenWorkList: () => void;
}

const [useCtx, Provider] = createCtx<Context>();

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const FirmWorkProvider = (props: Props): React.ReactElement =>
{
  const { user, firm, openWorkPaymentModal } = useLoginProvider();
  const [openWorkList, setOpenWorkList] = React.useState([]);

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
    matchedWorkList: []
  };

  // Init Actions
  const actions = {
    confirmApplyWork: (workId): void =>
    {
      Alert.alert(
        '해당 날짜와 장소에 배차 가능하십니까?',
        '2019.12월 중순까지 [무료 일감수락쿠폰]을 선택해서 지원해 보세요\n\n지원 후, 장비사용 고객의 선택을 기다려야 합니다\n' +
        '\n※ 베타버전에도 정식서비스와 똑같이 사용해 볼수 있게, 계좌등록과정을 빼지 않았습니다',
        [
          { text: '취소' },
          { text: '지원하기', onPress: (): void => openWorkPaymentModal() }
        ]
      );
    },
    applyWork: (workId): void =>
    {
      const { user } = this.props;

      const applyData = {
        workId,
        accountId: user.uid
      };

      api
        .applyWork(applyData)
        .then(resBody =>
        {
          if (resBody)
          {
            this.setOpenWorkListData();
          }
        })
        .catch(error =>
        {
          noticeUserError('FimWorkProvider(applywork call api error)', 'Please try again', error.message);
        });
    },
    refetchOpenWorkList (): void { console.log('refetchOpenWorkList'); openWorkPaymentModal() }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export { useCtx as useFirmWorkProvider, FirmWorkProvider };
