import * as React from 'react';
import * as api from 'src/api/api';

import { FIRMHARMCASE_COUNT, FIRM_CHATMESSAGE } from 'src/api/queries';
import { useMutation, useQuery } from '@apollo/client';

import { ADD_FIRMCHAT_MESSAGE } from 'src/api/mutations';
import { Alert } from 'react-native';
import { ClientEvaluParamList } from 'src/navigation/types';
import { EvaluListType } from 'src/container/firmHarmCase/type';
// import { FIRM_NEWCHAT } from 'src/api/subscribe';
import { Provider } from 'src/contexts/FirmHarmCaseContext';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import { noticeUserError } from 'src/container/request';
import { useLoginContext } from 'src/contexts/LoginContext';

interface Props {
  children?: React.ReactElement;
  navigation: StackNavigationProp<ClientEvaluParamList, 'ClientEvalu'>;
  route: RouteProp<ClientEvaluParamList, 'ClientEvalu'>;
}

const FirmHarmCaseProvider: React.FC<Props> = ({
  navigation,
  route,
  children,
}): React.ReactElement => {
  React.useEffect(() => {
    const { search } = route.params;

    if (search) {
      setSearchArea('TEL');
      setSearchWord(search);
      searchFilterCliEvalu(search);
    } else {
      setSearchWord('');
    }

    // subscription
    // subscribeToMore({
    //   document: FIRM_NEWCHAT, updateQuery: (prev, { subscriptionData }) =>
    //   {
    //     console.log('>>> prev.firmChatMessage:', prev.firmChatMessage);
    //     console.log('>>> subscriptionData:', subscriptionData.data);
    //     if (!subscriptionData.data) return prev.firmChatMessage;
    //     const newFeedItem = subscriptionData.data.firmNewChat;
    //     return Object.assign({}, prev, {
    //       firmChatMessage: [newFeedItem, ...prev.firmChatMessage]
    //     });
    //   }
    // });
  }, []);

  const { userProfile, firm } = useLoginContext();
  const [visibleCreateModal, setVisibleCreateModal] = React.useState(false);
  const [visibleUpdateModal, setVisibleUpdateModal] = React.useState(false);
  const [visibleEvaluLikeModal, setVisibleEvaluLikeModal] = React.useState(
    false
  );
  const [cliEvaluList, setCliEvaluList] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [lastList, setLastList] = React.useState(false);
  const [newestEvaluList, setNewestEvaluList] = React.useState(false);
  const [evaluLikeList, setEvaluLikeList] = React.useState([]);
  const [searchWord, setSearchWord] = React.useState('temp');
  const [searchArea, setSearchArea] = React.useState('TEL');
  const [searchTime, setSearchTime] = React.useState('');
  const [searchNotice, setSearchNotice] = React.useState('');
  const [updateEvalu, setUpdateEvalu] = React.useState();
  const [evaluLikeSelected, setEvaluLikeSelected] = React.useState();
  const [evaluListType, setEvaluListType] = React.useState(
    EvaluListType.LATEST
  );
  const [chatMessge, setChatMessge] = React.useState([]);

  // Server api call
  const { subscribeToMore, ...chatMessagesResponse } = useQuery(
    FIRM_CHATMESSAGE,
    {
      onCompleted: data => {
        if (data) {
          setChatMessge(data?.firmChatMessage);
        } else {
          noticeUserError(
            'FirmHarmCaseProvider(addFirmChatMessageReq onCompleted)',
            'no data!!',
            userProfile
          );
        }
      },
    }
  );
  const [addFirmChatMessageReq, addFirmChatMessageRsp] = useMutation(
    ADD_FIRMCHAT_MESSAGE,
    {
      onError: err => {
        noticeUserError(
          'FirmHarmCaseProvider(addFirmChatMessageReq result)',
          err?.message,
          userProfile
        );
      },
    }
  );
  const firmHarmCaseCountRsp = useQuery(FIRMHARMCASE_COUNT, {
    variables: { id: userProfile.uid },
    onError: err => {
      noticeUserError(
        'FirmHarmCaseCount(firmHarmCaseCount result)',
        err?.message,
        userProfile
      );
    },
  });

  const setCliEvaluLikeList = evaluId => {
    api
      .getClientEvaluLikeList(evaluId)
      .then(resBody => {
        setEvaluLikeList(resBody);
        setEvaluListType(EvaluListType.LATEST);
      })
      .catch(error =>
        noticeUserError(
          '피해사례 공감 조회 문제',
          `공감 조회에 문제가 있습니다, 다시 시도해 주세요(${error.message})`,
          userProfile
        )
      );
  };

  const searchFilterCliEvalu = (searchWord: string): void => {
    if (!searchWord) {
      setSearchNotice('검색어를 기입해 주세요!');
      return;
    }

    const pNumber = searchWord.split('-').join('');
    const paramStr = `searchWord=${pNumber}`;

    api
      .searchClientEvaluList(paramStr)
      .then(resBody => {
        if (resBody) {
          setEvaluListType(EvaluListType.SEARCH);
          let notice = '';
          if (resBody.length === 0) {
            notice = `[${searchWord}]는 현재 피해사례에 조회되지 않습니다.`;
          }
          setSearchWord(searchWord);
          setCliEvaluList(resBody);
          setSearchNotice(notice);
          setSearchTime(moment().format('YYYY.MM.DD HH:mm'));
          setLastList(true);
        }
      })
      .catch(ex => {
        noticeUserError(
          '피해사례 요청 문제',
          `피해사례 요청에 문제가 있습니다, 다시 시도해 주세요${ex.message}`,
          userProfile
        );
      });
  };

  const hideEvaluList = (): void => {
    setEvaluListType(EvaluListType.NONE);
    setPage(0);
    setNewestEvaluList(false);
    setCliEvaluList(null);
  };

  // Init States
  const states = {
    navigation: navigation,
    firm,
    searchWord,
    searchNotice,
    searchArea,
    evaluListType,
    cliEvaluList,
    chatMessge: chatMessagesResponse?.data?.firmChatMessage || [],
    countData: firmHarmCaseCountRsp.data?.firmHarmCaseCount || {
      myCnt: -1,
      totalCnt: -1,
    },
    setSearchWord,
    visibleCreateModal,
    setVisibleCreateModal,
    visibleUpdateModal,
    visibleEvaluLikeModal,
    updateEvalu,
    searchTime,
    evaluLikeSelected,
    evaluLikeList,
  };

  const actions = {
    setSearchArea,
    createClientEvaluLike: newEvaluLike => {
      api
        .createClientEvaluLike(newEvaluLike)
        .then(() => {
          setCliEvaluLikeList(newEvaluLike.evaluId);
        })
        .catch(error =>
          noticeUserError(
            '공감/비공감 요청 문제',
            `요청에 문제가 있습니다, 다시 시도해 주세요${error.message}`,
            userProfile
          )
        );
    },
    openCliEvaluLikeModal: (item, isMine) => {
      setEvaluLikeSelected(item);
      setVisibleEvaluLikeModal(true);

      setCliEvaluLikeList(item.id);
    },
    setCliEvaluLikeList,
    cancelClientEvaluLike: (evaluation, like) => {
      api
        .deleteCliEvaluLike(evaluation.id, userProfile.uid, like)
        .then(() => setCliEvaluLikeList(evaluation.id))
        .catch(error =>
          noticeUserError(
            '공감/비공감 취소 문제',
            `피해사례 공감/비공감 취소 요청에 문제가 있습니다, 다시 시도해 주세요(${error.messages})`,
            userProfile
          )
        );
    },
    closeEvaluLikeModal: refresh => {
      setVisibleEvaluLikeModal(false);
    },
    searchFilterCliEvalu: (word: string): void => searchFilterCliEvalu(word),
    openUpdateCliEvaluForm: item => {
      setUpdateEvalu(item);
      setVisibleUpdateModal(true);
    },
    handleLoadMore: () => {
      if (lastList) {
        return;
      }
      setPage(page + 1);
    },
    onClickNewestEvaluList: () => {
      if (evaluListType === EvaluListType.LATEST) {
        hideEvaluList();
        return;
      }

      setSearchWord('');
      setPage(0);
      setNewestEvaluList(true);
      setCliEvaluList(null);
    },
    senChatMessage: (message: object) => {
      if (!firm) {
        Alert.alert('장비등록 정보없음!!', '장비등록을 먼저 해 주세요~~');
        return;
      }

      const newMessage = {
        ...message[0],
        createdAt: new Date().getTime(),
        user: {
          _id: firm.accountId,
          name: firm.fname,
          avatar: firm.thumbnail,
        },
      };

      console.log('>>> newMessage', newMessage);
      addFirmChatMessageReq({ variables: { message: newMessage } });
    },
    onClickSearch(): void {
      navigation.navigate('FirmHarmCaseSearch', { searchWord: undefined });
    },
    onClickAddFirmHarmCase(): void {
      navigation.navigate('FirmHarmCaseCreate');
    },
    onClickMyEvaluList(): void {
      navigation.navigate('FirmHarmCaseSearch', { initSearchMine: true });
    },
    onClickTotalEvaluList(): void {
      navigation.navigate('FirmHarmCaseSearch', { initSearchAll: true });
    },
  };

  // UI Component
  return <Provider value={{ ...states, ...actions }}>{children}</Provider>;
};

export default FirmHarmCaseProvider;
