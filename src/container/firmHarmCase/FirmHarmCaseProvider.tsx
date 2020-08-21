import * as Notifications from 'expo-notifications';
import * as React from 'react';
import * as api from 'src/api/api';

import { DefaultNavigationProps, FirmHarmCaseCountData } from 'src/types';
import { useMutation, useQuery } from '@apollo/client';

import { ADD_FIRMCHAT_MESSAGE } from 'src/api/mutations';
import { Alert } from 'react-native';
import { EvaluListType } from 'src/container/firmHarmCase/type';
import { FIRM_CHATMESSAGE } from 'src/api/queries';
import { FIRM_NEWCHAT } from 'src/api/subscribe';
import { Provider } from 'src/contexts/FirmHarmCaseContext';
import { addNotificationListener } from '../notification/NotificationAction';
import { getClientEvaluCount } from 'src/container/firmHarmCase/action';
import moment from 'moment';
import { noticeUserError } from 'src/container/request';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Props {
  children?: React.ReactElement;
  navigation: DefaultNavigationProps;
}

const FirmHarmCaseProvider = (props: Props): React.ReactElement =>
{
  React.useEffect(() =>
  {
    const { params } = props.navigation.state;

    if (params && params.search)
    {
      setSearchArea('TEL');
      setSearchWord(params.search);
      searchFilterCliEvalu(params.search);
    }
    else
    {
      getClientEvaluCount(user?.uid, setCountData);
      setClinetEvaluList();
      setSearchWord('');
    }

    // subscription
    subscribeToMore({
      document: FIRM_NEWCHAT, updateQuery: (prev, { subscriptionData }) =>
      {
        console.log('>>> prev.firmChatMessage:', prev.firmChatMessage);
        console.log('>>> subscriptionData:', subscriptionData.data);
        if (!subscriptionData.data) return prev.firmChatMessage;
        const newFeedItem = subscriptionData.data.firmNewChat;
        return Object.assign({}, prev, {
          firmChatMessage: [newFeedItem, ...prev.firmChatMessage]
        });
      }
    });
  }, []);

  React.useEffect(() =>
  {
    (async () =>
    {
      addNotificationListener(user.uid, _handleNotification);
      // runListener();
      // checkBLListLoading();
      const firm = await refetchFirm();
      if (!firm) { setTimeout(() => { props.navigation.navigate('FirmRegister') }, 500) }
    })();

    return (): void => { Notifications.removeAllNotificationListeners() };
  }, []);

  const _handleNotification = (response): void =>
{
  if (response?.request?.content)
  {
    const notification = response.request.content;
    // Notifications.setBadgeCountAsync(0);
    // TODO Notice 확인 시, Notice 알람 제거

    if (notification.data?.notice === 'NOTI_WORK_REGISTER')
    {
      noticeCommonNavigation(notification, '일감 지원하기', () =>
        props.navigation.navigate('FirmWorkList', { refresh: true })
      );
    }
    else if (notification.data?.notice === 'NOTI_WORK_ADD_REGISTER')
    {
      noticeCommonNavigation(notification, '지원자 확인하기', () =>
        props.navigation.navigate('WorkList', { refresh: true })
      );
    }
    else if (notification.data?.notice === 'NOTI_WORK_SELECTED')
    {
      noticeCommonNavigation(notification, '배차 수락하러가기', () =>
        props.navigation.navigate('FirmWorkList', { refresh: true })
      );
    }
    else if (notification.data?.notice === 'NOTI_WORK_ABANDON')
    {
      noticeCommonNavigation(notification, '배차 다시 요청하기', () =>
        props.navigation.navigate('WorkList', { refresh: true })
      );
    }
    else if (notification.data?.notice === 'NOTI_WORK_CLOSED')
    {
      noticeCommonNavigation(notification, '업체 평가하기', () =>
        props.navigation.navigate('WorkList', { refresh: true })
      );
    }
    else if (notification.data?.notice === 'NOTI_CEVALU_REGISTER')
    {
      noticeCommonNavigation(
        notification,
        '피해사례(악덕) 조회하기',
        () => props.navigation.navigate('ClientEvalu')
      );
    }
    else
    {
      noticeCommonNavigation(notification, '확인', () => {});
    }
  }
  else
  {
    console.log('=== notification:', response)
    Alert.alert(
      '유효하지 않은 알람입니다',
      `내용: ${response}`,
      [
        {
          text: '확인',
          onPress: (): void =>
          {
            // Notifications.dismissNotificationAsync(
            //   notification.notificationId
            // );
          }
        }
      ],
      { cancelable: false }
    );
  }
};

const noticeCommonNavigation = (notification, actionName, action): void =>
{
  setTimeout(() =>
  {
    Alert.alert(
      notification.data.title,
      notification.data.body,
      [
        {
          text: '취소',
          onPress: () =>
          {
            // Notifications.dismissNotificationAsync(
            //   notification.notificationId
            // );
          },
          style: 'cancel'
        },
        {
          text: actionName,
          onPress: () =>
          {
            // Notifications.dismissNotificationAsync(
            //   notification.notificationId
            // );
            action();
          }
        }
      ],
      { cancelable: false }
    );
  }, 1000);
};

  const { refetchFirm, user, firm } = useLoginContext();
  const [visibleCreateModal, setVisibleCreateModal] = React.useState(false);
  const [visibleUpdateModal, setVisibleUpdateModal] = React.useState(false);
  const [visibleEvaluLikeModal, setVisibleEvaluLikeModal] = React.useState(false);
  const [cliEvaluList, setCliEvaluList] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [lastList, setLastList] = React.useState(false);
  const [newestEvaluList, setNewestEvaluList] = React.useState(false);
  const [evaluLikeList, setEvaluLikeList] = React.useState([]);
  const [searchWord, setSearchWord] = React.useState('temp');
  const [searchArea, setSearchArea] = React.useState('TEL');
  const [searchTime, setSearchTime] = React.useState('');
  const [searchNotice, setSearchNotice] = React.useState('');
  const [countData, setCountData] = React.useState<FirmHarmCaseCountData>();
  const [updateEvalu, setUpdateEvalu] = React.useState();
  const [evaluLikeSelected, setEvaluLikeSelected] = React.useState();
  const [evaluListType, setEvaluListType] = React.useState(EvaluListType.LATEST);
  const [chatMessge, setChatMessge] = React.useState([]);

  // Server api call
  const { subscribeToMore, ...chatMessagesResponse } = useQuery(FIRM_CHATMESSAGE, {
    onCompleted: (data) =>
    {
      if (data) { setChatMessge(data?.firmChatMessage) }
      else { noticeUserError('FirmHarmCaseProvider(addFirmChatMessageReq onCompleted)', 'no data!!', user) }
    }
  });
  const [addFirmChatMessageReq, addFirmChatMessageRsp] = useMutation(ADD_FIRMCHAT_MESSAGE, {
    onError: (err) =>
    {
      noticeUserError('FirmHarmCaseProvider(addFirmChatMessageReq result)', err?.message, user);
    }
  });

  // Init Actions
  const setClinetEvaluList = () =>
  {
    api
      .getClientEvaluList(page, user.uid, false)
      .then(resBody =>
      {
        if (resBody && resBody.content)
        {
          let notice;
          if (resBody.content.length === 0)
          {
            notice = '블랙리스트를 조회 또는 추가해 주세요.';
            setCliEvaluList([]);
            setSearchNotice(notice);
            setLastList(resBody.last);
            setEvaluListType(EvaluListType.LATEST);
            setNewestEvaluList(true);

            return;
          }
          const beforeTwoMonth = moment()
            .add(-2, 'month')
            .format('MM/DD');
          const now = moment().format('MM/DD');
          notice = `최근[${beforeTwoMonth} ~ ${now}] 리스트 입니다, 평가 및 주의해 주세요.`;
          setLastList(resBody.last);
          setSearchNotice(notice);
          setNewestEvaluList(true);
          setEvaluListType(EvaluListType.LATEST);
          setCliEvaluList(
            page === 0
              ? resBody.content
              : [...cliEvaluList, ...resBody.content]);
          setSearchTime(moment().format('YYYY.MM.DD HH:mm'));
        }
      })
      .catch(ex =>
      {
        noticeUserError(
          '최근 피해사례 요청 문제',
          `최근 피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`, user
        );
      });
  };

  const setCliEvaluLikeList = (evaluId) =>
  {
    api
      .getClientEvaluLikeList(evaluId)
      .then(resBody =>
      {
        setEvaluLikeList(resBody);
        setEvaluListType(EvaluListType.LATEST);
      })
      .catch(error =>
        noticeUserError(
          '피해사례 공감 조회 문제',
          `공감 조회에 문제가 있습니다, 다시 시도해 주세요(${error.message})`, user
        )
      );
  };

  const searchFilterCliEvalu = (searchWord: string): void =>
  {
    if (!searchWord)
    {
      setSearchNotice('검색어를 기입해 주세요!');
      return;
    }

    const pNumber = searchWord.split('-').join('');
    const paramStr = `searchWord=${pNumber}`;

    api
      .searchClientEvaluList(paramStr)
      .then(resBody =>
      {
        if (resBody)
        {
          setEvaluListType(EvaluListType.SEARCH);
          let notice = '';
          if (resBody.length === 0)
          {
            notice = `[${searchWord}]는 현재 피해사례에 조회되지 않습니다.`;
          }
          setSearchWord(searchWord);
          setCliEvaluList(resBody);
          setSearchNotice(notice);
          setSearchTime(moment().format('YYYY.MM.DD HH:mm'));
          setLastList(true);
        }
      })
      .catch(ex =>
      {
        noticeUserError(
          '피해사례 요청 문제',
          `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`, user
        );
      });
  };

  const hideEvaluList = (): void =>
  {
    setEvaluListType(EvaluListType.NONE);
    setPage(0);
    setNewestEvaluList(false);
    setCliEvaluList(null);
  };

  // Init States
  const states = {
    navigation: props.navigation, user, firm, searchWord, searchNotice, searchArea, evaluListType,
    cliEvaluList, countData,
    chatMessge: chatMessagesResponse?.data?.firmChatMessage || [],
    setSearchWord,
    visibleCreateModal, setVisibleCreateModal, visibleUpdateModal, visibleEvaluLikeModal,
    updateEvalu, searchTime,
    evaluLikeSelected, evaluLikeList
  };

  const actions = {
    deleteCliEvalu: (id: string): void =>
    {
      api
        .deleteCliEvalu(id)
        .then(() => setClinetEvaluList())
        .catch(error =>
          noticeUserError(
            '피해사례 삭제 문제',
            `피해사례 삭제에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`, user
          )
        );
    },
    setSearchArea,
    setClinetEvaluList,
    createClientEvaluLike: (newEvaluLike) =>
    {
      api
        .createClientEvaluLike(newEvaluLike)
        .then(() =>
        {
          setCliEvaluLikeList(newEvaluLike.evaluId);
        })
        .catch(error =>
          noticeUserError(
            '공감/비공감 요청 문제',
            `요청에 문제가 있습니다, 다시 시도해 주세요${error.message}`, user
          )
        );
    },
    openCliEvaluLikeModal: (item, isMine) =>
    {
      setEvaluLikeSelected(item);
      setVisibleEvaluLikeModal(true);

      setCliEvaluLikeList(item.id);
    },
    setCliEvaluLikeList,
    cancelClientEvaluLike: (evaluation, like) =>
    {
      api
        .deleteCliEvaluLike(evaluation.id, user.uid, like)
        .then(() => setCliEvaluLikeList(evaluation.id))
        .catch(error =>
          noticeUserError(
            '공감/비공감 취소 문제',
            `피해사례 공감/비공감 취소 요청에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`, user
          )
        );
    },
    closeEvaluLikeModal: (refresh) =>
    {
      if (refresh)
      {
        setClinetEvaluList();
      }
      setVisibleEvaluLikeModal(false);
    },
    searchFilterCliEvalu: (word: string): void => searchFilterCliEvalu(word),
    openUpdateCliEvaluForm: (item) =>
    {
      setUpdateEvalu(item);
      setVisibleUpdateModal(true);
    },
    handleLoadMore: () =>
    {
      if (lastList)
      {
        return;
      }
      setPage(page + 1);
      if (newestEvaluList)
      {
        setClinetEvaluList();
      }
    },
    onClickNewestEvaluList: () =>
    {
      if (evaluListType === EvaluListType.LATEST) { hideEvaluList(); return }

      setSearchWord('');
      setPage(0);
      setNewestEvaluList(true);
      setCliEvaluList(null);
      setClinetEvaluList();
    },
    getClientEvaluCount: (accountId: string, setCountData: (n: string) => void) =>
    {
      api
        .getClientEvaluCount(accountId)
        .then(countData =>
        {
          if (countData)
          {
            setCountData(countData);
          }
        })
        .catch(ex =>
        {
          noticeUserError(
            '피해사례 통계 요청',
            `피해사례 통계 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`, user
          );
        });
    },
    senChatMessage: (message: object) =>
    {
      if (!firm) { Alert.alert('장비등록 정보없음!!', '장비등록을 먼저 해 주세요~~'); return }

      const newMessage = {
        ...message[0],
        createdAt: new Date().getTime(),
        user: {
          _id: firm.accountId,
          name: firm.fname,
          avatar: firm.thumbnail
        }
      };

      console.log('>>> newMessage', newMessage);
      addFirmChatMessageReq({ variables: { message: newMessage } });
    },
    onClickSearch: () => {
      props.navigation.navigate('FirmHarmCaseSearch')
    },
    onClickAddFirmHarmCase: () => {
      props.navigation.navigate('FirmHarmCaseCreate')
    },
    onClickMyEvaluList: () => {
      props.navigation.navigate('FirmHarmCaseSearch', { myHarmCase: true })
    }
  };

  // UI Component
  return (
    <Provider value={{ ...states, ...actions }}>{props.children}</Provider>
  );
};

export default FirmHarmCaseProvider;
